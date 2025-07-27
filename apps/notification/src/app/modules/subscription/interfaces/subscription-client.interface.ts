import {
  FindByFrequencyListResponse,
  FrequencyRequest,
} from '@shared-types/grpc/subscription';

export interface SubscriptionClientInterface {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
}
