import { FindByFrequencyListResponse, FrequencyRequest } from '@types';

export interface FindSubscriptionsInterface {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
}
