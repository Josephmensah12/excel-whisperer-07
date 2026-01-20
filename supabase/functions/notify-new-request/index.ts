
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CallRequest {
  name: string
  email: string
  phone: string
  ship_from_city: string
  ship_to_city: string
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: CallRequest = await req.json()

    console.log('Processing new call request:', {
      name: payload.name,
      email: payload.email,
      recipient: 'may@goldcoastgloballogistics.com',
      cc: 'joe@goldcoastgloballogistics.com',
      timestamp: new Date().toISOString()
    })

    // Send email using Resend with enhanced error handling
    const emailRequest = {
      from: 'Gold Coast Global Logistics <info@goldcoastgloballogistics.com>',
      to: ['may@goldcoastgloballogistics.com'],
      cc: ['joe@goldcoastgloballogistics.com'],
      reply_to: payload.email,
      subject: 'New Call Request Received',
      html: `
        <h2>New Call Request Details</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Ship From:</strong> ${payload.ship_from_city}</p>
        <p><strong>Ship To:</strong> ${payload.ship_to_city}</p>
        <p><em>Timestamp: ${new Date().toISOString()}</em></p>
      `,
    }

    console.log('Sending email with configuration:', {
      to: emailRequest.to,
      cc: emailRequest.cc,
      subject: emailRequest.subject,
      timestamp: new Date().toISOString()
    })

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailRequest),
    })

    const responseData = await emailResponse.text()
    
    console.log('Resend API Response:', {
      status: emailResponse.status,
      statusText: emailResponse.statusText,
      data: responseData,
      headers: Object.fromEntries(emailResponse.headers.entries()),
      timestamp: new Date().toISOString()
    })

    if (!emailResponse.ok) {
      const errorMessage = responseData.includes('can only send testing emails') 
        ? 'Email recipients need to be verified in Resend first. Please verify your domain or add the recipient emails as test emails in Resend.'
        : `Failed to send email: ${responseData}`;

      console.error('Failed to send email. Response:', {
        status: emailResponse.status,
        data: responseData,
        error: errorMessage,
        timestamp: new Date().toISOString()
      })
      
      throw new Error(errorMessage)
    }

    console.log('Email sent successfully to recipient and CC', {
      timestamp: new Date().toISOString()
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing request:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

serve(handler)
