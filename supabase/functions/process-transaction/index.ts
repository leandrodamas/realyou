
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = 'https://lzfbljphegenrocnumqy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZmJsanBoZWdlbnJvY251bXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDgyNDEsImV4cCI6MjA2MDU4NDI0MX0.dUeTBG6jKzj5a8rPfozPBEDLfGtgpGmLLNcPKsCPfuo'

interface TransactionData {
  userId: string
  providerId: string
  amount: number
  serviceFeePercentage: number
  description?: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the transaction data from the request
    const { userId, providerId, amount, serviceFeePercentage, description } = await req.json() as TransactionData

    // Calculate fees
    const serviceFeeAmount = (amount * serviceFeePercentage) / 100
    const netAmount = amount - serviceFeeAmount

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        provider_id: providerId,
        amount,
        service_fee_percentage: serviceFeePercentage,
        service_fee_amount: serviceFeeAmount,
        net_amount: netAmount,
        description,
        status: 'completed'
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Record the service fee
    const { error: feeError } = await supabase
      .from('service_fee_records')
      .insert({
        transaction_id: transaction.id,
        amount: serviceFeeAmount,
        percentage: serviceFeePercentage
      })

    if (feeError) {
      throw feeError
    }

    return new Response(
      JSON.stringify({
        transaction,
        serviceFeeAmount,
        netAmount
      }),
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
