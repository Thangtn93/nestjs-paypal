import { Inject, Injectable } from '@nestjs/common';
import {
  PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN,
  PAYPAL_AXIOS_INSTANCE_TOKEN,
  PAYPAL_MODULE_OPTIONS,
  PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN,
} from '@app/constants';
import { AxiosInstance } from 'axios';
import { PaypalModuleOptions } from '@app/interfaces';
import { PaypalUtilsService, PaypalAuthorizationService } from '@app/services';
import { PaypalErrorsConstants } from '@app/errors';
import {
  PaypalOrderDto,
  InitiateOrderHeadersDto,
  // CreatePaypalOrderDto,
  CreatePaypalProductDto,
  CreatePaypalPlanDto,
  CreateSubscriptionDto,
  AuthorizeOrderHeadersDto,
  CreateReasonDto
} from '@app/dtos';
// import { UpdatePaypalOrderDto } from '@app/dtos/order/update-paypal-order.dto';
import { PaymentSourceResponseDto } from '@app/dtos/payment-source-response.dto';

@Injectable()
export class PaypalSubscriptionService {
  constructor(
    @Inject(PAYPAL_AXIOS_INSTANCE_TOKEN)
    private readonly axiosInstance: AxiosInstance,
    @Inject(PAYPAL_MODULE_OPTIONS)
    private readonly options: PaypalModuleOptions,
    @Inject(PAYPAL_AUTHORIZATION_SERVICE_INSTANCE_TOKEN)
    private paypalAuthorizationService: PaypalAuthorizationService,
    @Inject(PAYPAL_UTILS_SERVICE_INSTANCE_TOKEN)
    private paypalUtilsService: PaypalUtilsService,
  ) {}

  async _preparePaypalRequestHeaders(customHeaders?: any) {
    const initiateTokenResponse =
      await this.paypalAuthorizationService.getAccessToken();
    const { access_token } = initiateTokenResponse;
    return {
      'Content-Type': 'application/json',
      Authorization: access_token
        ? `Bearer ${access_token}`
        : `Basic ${this.paypalAuthorizationService.getBasicKey()}`,
      ...customHeaders,
    };
  }

  async createProduct(
    productPayload: CreatePaypalProductDto,
    headers?: InitiateOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);

    return this.axiosInstance
      .post(`${apiUrl}/v1/catalogs/products`, productPayload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        console.log(e);
        throw {
          ...PaypalErrorsConstants.INITIATE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
  async createPlan(
    planPayload: CreatePaypalPlanDto,
    headers?: InitiateOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);

    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/plans`, planPayload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        console.log(e);
        throw {
          ...PaypalErrorsConstants.INITIATE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
  async createSubscription(
    subscriptionPayload: CreateSubscriptionDto,
    headers?: InitiateOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);

    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/subscriptions`, subscriptionPayload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        console.log(e);
        throw {
          ...PaypalErrorsConstants.INITIATE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
   async captureSubscriptionOrder(
    id: string,
    payload: PaymentSourceResponseDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/subscriptions/${id}/capture`, payload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.CAPTURE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
  async suspendSubscription(
    id: string,
    payload: CreateReasonDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/subscriptions/${id}/suspend`, payload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.CAPTURE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
  async activateSubscription(
    id: string,
    payload: CreateReasonDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/subscriptions/${id}/activate`, payload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.CAPTURE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
  async cancelSubscription(
    id: string,
    payload: CreateReasonDto,
    headers?: AuthorizeOrderHeadersDto,
  ): Promise<PaypalOrderDto> {
    const _headers = await this._preparePaypalRequestHeaders(headers);
    const apiUrl = this.paypalUtilsService.getApiUrl(this.options.environment);
    return this.axiosInstance
      .post(`${apiUrl}/v1/billing/subscriptions/${id}/cancel`, payload, {
        headers: _headers,
      })
      .then((r) => r.data)
      .catch((e) => {
        throw {
          ...PaypalErrorsConstants.CAPTURE_ORDER_FAILED,
          nativeError: e?.response?.data || e,
        };
      });
  }
}
