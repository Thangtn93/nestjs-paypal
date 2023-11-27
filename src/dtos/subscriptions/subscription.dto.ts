export class SubscriberName {
    readonly given_name: string;
    readonly surname: string;
  }
  
  export class SubscriberAddress {
    readonly full_name: string;
    readonly address_line_1: string;
    readonly address_line_2: string;
    readonly admin_area_2: string;
    readonly admin_area_1: string;
    readonly postal_code: string;
    readonly country_code: string;
  }
  
  export class Subscriber {
    readonly name: SubscriberName;
    readonly email_address: string;
    readonly shipping_address: SubscriberAddress;
  }
  
  export class ShippingAmount {
    readonly currency_code: string;
    readonly value: string;
  }
  
  export class PaymentMethod {
    readonly payer_selected: string;
    readonly payee_preferred: string;
  }
  
  export class ApplicationContext {
    readonly brand_name: string;
    readonly locale: string;
    readonly shipping_preference: string;
    readonly user_action: string;
    readonly payment_method: PaymentMethod;
    readonly return_url: string;
    readonly cancel_url: string;
  }
  
  export class CreateSubscriptionDto {
    readonly plan_id: string;
    readonly start_time: string;
    readonly quantity: string;
    readonly shipping_amount: ShippingAmount;
    readonly subscriber: Subscriber;
    readonly application_context: ApplicationContext;
  }
  