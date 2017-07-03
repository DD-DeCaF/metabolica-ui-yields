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
