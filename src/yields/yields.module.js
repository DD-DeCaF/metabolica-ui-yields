import angular from 'angular';
import GROUPWORK from '../../img/icons/group_work.svg';
import {TheoreticalYieldService} from './yields.service';
import {PlotService} from './plot.service';
import {TheoreticalYieldComponent} from './yields.component'


export const TheoreticalYieldModule = angular.module('yields', [
	])
	.service('TheoreticalYieldService', TheoreticalYieldService)
	.service('PlotService', PlotService)
	.component('yields', TheoreticalYieldComponent)
	.config(function ($mdIconProvider, $stateProvider, appNavigationProvider) {
        $mdIconProvider.icon('group_work', GROUPWORK, 24);

        appNavigationProvider.register('app.yields', {
            title: 'Theoretical Yield',
            icon: 'group_work'
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
