import { Attributes, Context, SpanKind } from '@opentelemetry/api';
import {
  Sampler,
  SamplingDecision,
  SamplingResult,
} from '@opentelemetry/sdk-trace-node';

export type SamplingRule = {
  pathPrefix: string;
  ratio: number;
};

export class PathBasedSampler implements Sampler {
  constructor(private readonly rules: SamplingRule[]) {}

  shouldSample(
    _context: Context,
    _traceId: string,
    _spanName: string,
    _spanKind: SpanKind,
    attributes: Attributes
  ): SamplingResult {
    const path = attributes['http.target'];

    if (typeof path === 'string') {
      for (const rule of this.rules) {
        if (path.startsWith(rule.pathPrefix)) {
          return {
            decision:
              Math.random() < rule.ratio
                ? SamplingDecision.RECORD_AND_SAMPLED
                : SamplingDecision.NOT_RECORD,
          };
        }
      }
    }

    return { decision: SamplingDecision.RECORD_AND_SAMPLED };
  }

  toString(): string {
    return `${this.constructor.name}`;
  }
}
