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

import angular from 'angular';
import CHART from '../../img/icons/multiline_chart.svg';
import {TheoreticalYieldService} from './yields.service';
import {PlotService} from './plot.service';
import {TheoreticalYieldComponent} from './yields.component'
import {DecafAPIProvider} from './providers/decafapi.provider';


export const TheoreticalYieldModule = angular.module('yields', [
	])
	.provider('decafAPI', DecafAPIProvider)
	.service('TheoreticalYieldService', TheoreticalYieldService)
	.service('PlotService', PlotService)
	.component('yields', TheoreticalYieldComponent)
	.config(function ($mdIconProvider, $stateProvider, appNavigationProvider) {
        $mdIconProvider.icon('chart', CHART, 24);

        appNavigationProvider.register('app.yields', {
            title: 'Theoretical Yield',
            icon: 'chart',
			authRequired: false,
			tooltip: 'Assess strain performance in the context of theoretical growth and production yields'
        });

        $stateProvider
            .state({
                name: 'app.yields',
                url: '/yields',
                component: 'yields',
                data: {
                    title: 'Theoretical Yield' // FIXME look up from app nagivation provider
                }
            })
    });
