import { FindByFrequencyListResponse, FrequencyRequest } from '@types';

export interface SubscriptionClientInterface {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
}
