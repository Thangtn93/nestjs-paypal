export class CreatePaypalPlanDto {
    readonly product_id: string;
    readonly name: string;
    readonly description: string;
    readonly billing_cycles: BillingCycle[];
    readonly payment_preferences: PaymentPreferences;
    readonly taxes: Taxes;
  }
  
  export class Frequency {
    readonly interval_unit: string;
    readonly interval_count: number;
  }
  
  export class PricingScheme {
    readonly fixed_price: {
      readonly value: string;
      readonly currency_code: string;
    };
  }
  
  export class BillingCycle {
    readonly frequency: Frequency;
    readonly tenure_type: string;
    readonly sequence: number;
    readonly total_cycles: number;
    readonly pricing_scheme?: PricingScheme; // Optional
  }
  
  export class SetupFee {
    readonly value: string;
    readonly currency_code: string;
  }
  
  export class PaymentPreferences {
    readonly auto_bill_outstanding: boolean;
    readonly setup_fee: SetupFee;
    readonly setup_fee_failure_action: string;
    readonly payment_failure_threshold: number;
  }
  
  export class Taxes {
    readonly percentage: string;
    readonly inclusive: boolean;
  }
  