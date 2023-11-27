import { Inject } from '@nestjs/common';
import { PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN } from '@app/constants';

export interface ScandiniaviaPaypalSubscriptionDecorator {
  (
    target: Record<string, unknown>,
    key: string | symbol,
    index?: number | undefined,
  ): void;
}

export function InjectScandiniaviaPaypalSubscription(): ScandiniaviaPaypalSubscriptionDecorator {
  return Inject(PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN);
}
