
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface SubscriptionPlanRequest {
  planName: string;
  amount: number;
  currency: string;
  billingDay?: number;
  trialPeriodMonths?: number;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planName, amount, currency, billingDay = 1, trialPeriodMonths = 0 } = await req.json() as SubscriptionPlanRequest

    const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    // Create subscription plan in Mercado Pago
    const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: planName,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          repetitions: 12,
          billing_day: billingDay,
          billing_day_proportional: true,
          ...(trialPeriodMonths > 0 && {
            free_trial: {
              frequency: trialPeriodMonths,
              frequency_type: "months"
            }
          }),
          transaction_amount: amount,
          currency_id: currency
        },
        back_url: "https://app.yoursite.com/settings"
      })
    })

    const plan = await response.json()

    if (!response.ok) {
      throw new Error(plan.message || 'Failed to create subscription plan')
    }

    return new Response(
      JSON.stringify({ plan }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
