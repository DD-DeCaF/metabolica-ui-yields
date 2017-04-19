export class TheoreticalYieldService {
    private $http:angular.IHttpService;
    private api:string;

    constructor($http, decafAPI) {
        this.$http = $http;
        this.api = decafAPI;
    }

    loadExperiments() {
        return this.$http({
            method: 'GET',
            url: `${this.api}/experiments`
        });
    }

    loadSamples(experimentId) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/experiments/${experimentId}/samples`
        });
    }

    loadModelOptions(sampleIds) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/samples/model-options`,
            params: {'sample-ids': JSON.stringify(sampleIds)}
        });
    }

    sampleYields(sampleIds, modelId) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/data-adjusted/maximum-yield`,
            params: {'sample-ids': JSON.stringify(sampleIds), 'model-id': modelId}
        });
    }
}

