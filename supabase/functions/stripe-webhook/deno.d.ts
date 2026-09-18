declare module 'npm:@supabase/supabase-js@2' {
  export function createClient(...args: unknown[]): any;
}

declare module 'npm:stripe@22.6.2' {
  export default class Stripe {
    constructor(secretKey: string);
    webhooks: {
      constructEvent(rawBody: string, signature: string, secret: string): {
        id: string;
        type: string;
        data: { object: unknown };
      };
    };
  }
}
