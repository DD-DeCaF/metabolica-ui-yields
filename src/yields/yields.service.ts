import * as angular from "angular";
export class TheoreticalYieldService {
    private $http:angular.IHttpService;
    private api:string;

    constructor($http, decafAPI) {
        this.$http = $http;
        this.api = decafAPI;
    }

    loadExperiments(): angular.IPromise<any> {
        return this.$http({
            method: 'GET',
            url: `${this.api}/experiments`
        });
    }

    loadSamples(experimentId): angular.IPromise<any> {
        return this.$http({
            method: 'GET',
            url: `${this.api}/experiments/${experimentId}/samples`
        });
    }

    loadModelOptions(sampleIds): angular.IPromise<any> {
        return this.$http({
            method: 'POST',
            url: `${this.api}/samples/model-options`,
            data: {'sampleIds': sampleIds}
        });
    }

    sampleYields(sampleIds, modelId): angular.IPromise<any> {
        return this.$http({
            method: 'POST',
            url: `${this.api}/data-adjusted/maximum-yield`,
            data: {'sampleIds': sampleIds, 'modelId': modelId}
        });
    }
}

