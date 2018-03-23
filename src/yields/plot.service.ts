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

export class PlotService {

    plotPhase(domId, metabolite, growthRate, theoreticalYields) {
        let strains = {'wild': 'rgb(22, 96, 167)', 'modified': 'rgb(205, 12, 24)'};
        let point = {
            x: growthRate,
            y: [theoreticalYields.flux.reduce((p, c) => c += p) / theoreticalYields.flux.length],
            type: 'scatter',
            showlegend: false,
            line: {color: strains['modified']},
            name: 'experiment data'
        };

        let data = [point];

        let currentKey = null;

        angular.forEach(strains, function (color, strainKey) {
            if(theoreticalYields['phasePlanes'].hasOwnProperty(strainKey)) {
                let points = theoreticalYields['phasePlanes'][strainKey];
                currentKey = points['objectiveId'];
                let keys = ['objectiveLowerBound', 'objectiveUpperBound'];
                for (let ind in keys) {
                    this.push({
                        x: points[keys[ind]],
                        y: points['objective'],
                        type: 'scatter',
                        mode: 'lines',
                        showlegend: false,
                        line: {color: color},
                        name: currentKey
                    });
                }

                if (currentKey !== null) {

                    let last = points['objectiveUpperBound'].length - 1;

                    this.push({
                        x: [points['objectiveLowerBound'][0], points['objectiveUpperBound'][0]],
                        y: [points['objective'][0], points['objective'][0]],
                        type: 'scatter',
                        mode: 'lines',
                        showlegend: false,
                        line: {color: color},
                        name: currentKey
                    });

                    this.push({
                        x: [points['objectiveLowerBound'][last], points['objectiveUpperBound'][last]],
                        y: [points['objective'][last], points['objective'][last]],
                        type: 'scatter',
                        mode: 'lines',
                        showlegend: false,
                        line: {color: color},
                        name: currentKey
                    });
                }
            }

        }, data);

        let layout = {
            autosize: false,
            width: 400,
            height: 300,
            title: metabolite,
            xaxis: {title: 'growth, 1/h'},
            yaxis: {title: currentKey},
            margin: {
                l: 60,
                r: 15,
                b: 45,
                t: 60,
                pad: 10
            }
        };

        return {
            'data': data,
            'layout': layout
        };
    }
}
