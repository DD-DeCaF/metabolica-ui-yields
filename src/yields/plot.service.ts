import * as angular from 'angular';

export class PlotService {

	plotPhase(domId, metabolite, growthRate, theoreticalYields) {
		var strains = {'wild': 'rgb(22, 96, 167)', 'modified': 'rgb(205, 12, 24)'};
		var point = {
			x: growthRate,
			y: [theoreticalYields.flux],
			type: 'scatter',
			showlegend: false,
			line: {color: strains['modified']},
			name: 'experiment data'
		};

		var data = [point];

		var currentKey = null;

		angular.forEach(strains, function(color, strainKey) {
			var points = theoreticalYields['phase-planes'][strainKey];
			angular.forEach(theoreticalYields['phase-planes'][strainKey], function (value, key) {
				if (key != 'objective_lower_bound' && key != 'objective_upper_bound') {
					currentKey = key;
				}
			});
			var keys = ['objective_lower_bound', 'objective_upper_bound'];
			for (var ind in keys) {
 				this.push({
					x: points[keys[ind]],
					y: points[currentKey],
					type: 'scatter',
					mode: 'lines',
					showlegend: false,
					line: {color: color},
					name: currentKey
				});
			}

			if (currentKey !== null) {

                let last = points['objective_upper_bound'].length - 1;

				this.push({
						x: [points['objective_lower_bound'][0], points['objective_upper_bound'][0]],
						y: [points[currentKey][0], points[currentKey][0]],
						type: 'scatter',
						mode: 'lines',
						showlegend: false,
						line: {color: color},
						name: currentKey
				});

                this.push({
						x: [points['objective_lower_bound'][last], points['objective_upper_bound'][last]],
						y: [points[currentKey][last], points[currentKey][last]],
						type: 'scatter',
						mode: 'lines',
						showlegend: false,
						line: {color: color},
						name: currentKey
				});
			}

		}, data);

		var layout = {
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
