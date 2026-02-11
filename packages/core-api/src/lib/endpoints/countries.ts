import { Country } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../types';

const BASE_PATH = '/api/v1/countries';

export class CountriesEndpoint {
    constructor(private client: ApiClient) {}

    async getCountries(params: GetCollectionQueryParams<Country>): Promise<ApiCollectionResponse<Country>> {
        const { fields, offset, limit } = params;
        return this.client.getCollection<Country>(BASE_PATH, fields, {
            offset,
            limit,
        });
    }
}
