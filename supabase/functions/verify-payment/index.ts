import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { createClient } from "npm:@supabase/supabase-js@2";

//----------------------------------------------------------- 
// CONSTANTS 
//----------------------------------------------------------- 

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler = withSupabase({ auth: ["publishable"] }, async (req) => {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return Response.json(
        { paid: false, error: "Missing reference" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("payments")
      .select(`
        payment_status,
        subscribers ( email ),
        subscriptions (
          plans ( plan_name ),
          services ( service_name )
        )
      `)
      .eq("reference_number", reference)
      .maybeSingle();

    if (error) {
      console.error("Lookup error:", error);
      return Response.json(
        { paid: false, error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      {
        paid: data?.payment_status === "paid",
        email: data?.subscribers?.email ?? null,
        planName: data?.subscriptions?.plans?.plan_name ?? null,
        serviceName: data?.subscriptions?.services?.service_name ?? null,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { paid: false, error: err.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
});

//----------------------------------------------------------- 
// MAIN FUNCTION
//----------------------------------------------------------- 

export default {
  fetch: (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    return handler(req);
  },
};