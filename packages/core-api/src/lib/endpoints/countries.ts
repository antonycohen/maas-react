import { CountriesMap } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/countries';

export class CountriesEndpoint {
    constructor(private client: ApiClient) {}

    async getCountries(): Promise<CountriesMap> {
        return this.client.getById<CountriesMap>(BASE_PATH);
    }
}
