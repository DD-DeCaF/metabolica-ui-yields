import * as angular from 'angular';
import {PlotService} from './plot.service';
import {TheoreticalYieldService} from './yields.service';
import * as module from './yields.component.html';
import './yields.component.scss';


class TheoreticalYieldController {
    private $timeout: angular.ITimeoutService;
    TheoreticalYieldService: TheoreticalYieldService;
    PlotService: PlotService;
    plotData: any;
    isWaiting: boolean;
    experiments: any[];
    samples: any[];
    formConfig: any[];
    searchTexts: any;
    data: any;

    constructor($timeout, TheoreticalYieldService: TheoreticalYieldService, PlotService: PlotService) {
        this.$timeout = $timeout;
        this.TheoreticalYieldService = TheoreticalYieldService;
        this.PlotService = PlotService;
        this.experiments = [];
        this.samples = [];
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
                'title': 'Sample',
                'attr': 'samples',
                'list': () => this.samples[this.searchTexts.experiments]
            }
        ];
        this.searchTexts = {};
        this.data = {};
    }

    querySearch (query, data) {
        return query ? data.filter( this.createFilterFor(query) ) : data;
    }

    createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(option) {
            return (angular.lowercase(option.display).indexOf(lowercaseQuery) !== -1);
        };
    }

    loadLists() {
        this.loadExperiments();
    }

    loadExperiments() {
        this.TheoreticalYieldService.loadExperiments()
            .then((data: any) => {
                data.data.forEach((value) => {
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
                .then((data: any) => {
                        data.data.forEach((sample) => {
                            this.samples[experimentId].push({
                                value: sample.id,
                                display: sample.name
                            })
                        })
                    }
                )
        });
    }

    submit() {
        let currentSample = this.searchTexts['samples'];
        this.isWaiting = true;
        this.TheoreticalYieldService.sampleYields(currentSample)
            .then((data: any) =>
                {
                    this.isWaiting = false;
                    this.data[currentSample] = data.data;
                    angular.forEach(this.data[currentSample], (phaseYields, phase) => {
                        angular.forEach(phaseYields.metabolites, (metaboliteYield, metabolite) => {
                            var id = 'plot_' + phase + '_' + metabolite;
                            this.plotData[id] = this.PlotService.plotPhase(id, metabolite, phaseYields['growth-rate'], metaboliteYield);
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

export const TheoreticalYieldComponent: angular.IComponentOptions = {
    controller: TheoreticalYieldController,
    controllerAs: 'TheoreticalYieldController',
    template: module.toString()
};
