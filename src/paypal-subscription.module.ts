import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import axios from 'axios';
import {
  PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
  PAYPAL_AXIOS_INSTANCE_TOKEN,
  PAYPAL_MODULE_OPTIONS,
  PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
  PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN
} from '@app/constants';
import {
  PaypalModuleAsyncOptions,
  PaypalModuleOptions,
  PaypalModuleOptionsFactory,
} from '@app/interfaces';
import {
  PaypalAuthorizationService,
  PaypalUtilsService,
  PaypalSubscriptionService
} from '@app/services';

@Global()
@Module({})
export class PaypalSubscriptioModule {
  static register(options: PaypalModuleOptions): DynamicModule {
    return {
      module: PaypalSubscriptioModule,
      providers: [
        {
          provide: PAYPAL_AXIOS_INSTANCE_TOKEN,
          useValue: axios.create(),
        },
        {
          provide: PAYPAL_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalSubscriptionService,
        }, 
        {
          provide: PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalAuthorizationService,
        },
        {
          provide: PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalUtilsService,
        },
      ],
      exports: [

        {
          provide: PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalSubscriptionService,
        },
      ],
    };
  }

  static registerAsync(options: PaypalModuleAsyncOptions): DynamicModule {
    return {
      module: PaypalSubscriptioModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: PAYPAL_AXIOS_INSTANCE_TOKEN,
          useFactory: (_: PaypalModuleOptions) => axios.create(),
          inject: [PAYPAL_MODULE_OPTIONS],
        },
        {
          provide: PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalSubscriptionService,
        },
        {
          provide: PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalAuthorizationService,
        },
        {
          provide: PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalUtilsService,
        },
        ...(options.extraProviders || []),
      ],
      exports: [
        {
          provide: PAYPAL_SUBSCRIPTION_SERVICE_INSTANCE_TOKEN,
          useClass: PaypalSubscriptionService,
        },
      ],
    };
  }

  private static createAsyncProviders(
    options: PaypalModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PaypalModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PAYPAL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: PAYPAL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PaypalModuleOptionsFactory) =>
        optionsFactory.createPaypalModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}

