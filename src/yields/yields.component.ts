// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as angular from 'angular';
import {PlotService} from './plot.service';
import {TheoreticalYieldService} from './yields.service';
import * as module from './yields.component.html';
import './yields.component.scss';


class TheoreticalYieldController {
    private $timeout:angular.ITimeoutService;
    TheoreticalYieldService:TheoreticalYieldService;
    PlotService:PlotService;
    plotData:any;
    isWaiting:boolean;
    experiments:any[];
    samples:any[];
    models:any[];
    formConfig:any[];
    searchTexts:any;
    data:any;

    constructor($timeout, TheoreticalYieldService:TheoreticalYieldService, PlotService:PlotService) {
        this.$timeout = $timeout;
        this.TheoreticalYieldService = TheoreticalYieldService;
        this.PlotService = PlotService;
        this.experiments = [];
        this.samples = [];
        this.models = [];
        this.isWaiting = false;
        this.plotData = {};
        this.loadLists();
        this.formConfig = [
            {
                'title': 'Experiment',
                'attr': 'experiments',
                'list': () => this.experiments
            },
            {
                'title': 'Samples',
                'attr': 'samples',
                'list': () => this.samples[this.searchTexts.experiments]
            },
            {
                'title': 'Model',
                'attr': 'models',
                'list': () => this.models[this.searchTexts.samples]
            }
        ];
        this.searchTexts = {};
        this.data = {};
    }

    loadLists() {
        this.loadExperiments();
    }

    loadExperiments() {
        this.TheoreticalYieldService.loadExperiments()
            .then((data:any) => {
                data.data['response'].forEach((value) => {
                    this.experiments.push({
                        value: value.id,
                        display: value.name
                    })
                });
                this.loadSamples();
            })
    }

    loadSamples() {
        this.experiments.forEach((value) => {
            let experimentId = value.value;
            this.samples[experimentId] = [];
            this.TheoreticalYieldService.loadSamples(experimentId)
                .then((data:any) => {
                    data.data['response'].forEach((sample) => {
                        this.samples[experimentId].push({
                            value: sample.id,
                            display: sample.name
                        })
                    });
                    this.loadModelOptions();
                });
        });
    }

    loadModelOptions() {
        this.samples.forEach((value) => {
            value.forEach((sample) => {
                let sampleIds = sample.value;
                this.TheoreticalYieldService.loadModelOptions(sampleIds)
                    .then((data:any) => {
                        this.models[sampleIds] = [];
                        data.data['response'].forEach((value) => {
                            this.models[sampleIds].push({
                                value: value,
                                display: value
                            })
                        });
                    })
            });

        });
    }

    submit() {
        let currentSampleGroup = this.searchTexts['samples'];
        let currentModel = this.searchTexts['models'];
        this.isWaiting = true;
        this.TheoreticalYieldService.sampleYields(currentSampleGroup, currentModel)
            .then((data:any) => {
                    this.isWaiting = false;
                    this.data[currentSampleGroup] = data.data['response'];
                    angular.forEach(this.data[currentSampleGroup], (phaseYields, phase) => {
                        angular.forEach(phaseYields['metabolites'], (metaboliteYield, metabolite) => {
                            var id = 'plot_' + phase + '_' + metabolite;
                            this.plotData[id] = this.PlotService.plotPhase(id, metabolite,
                                phaseYields['growthRate'], metaboliteYield);
                        });
                    });
                },
                // Error
                ([status, dataResponse]) => {
                    this.isWaiting = false;
                }
            );
    }
}

export const TheoreticalYieldComponent:angular.IComponentOptions = {
    controller: TheoreticalYieldController,
    controllerAs: 'TheoreticalYieldController',
    template: module.toString()
};
