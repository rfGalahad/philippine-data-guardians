import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req) => {

  const { user_id, type, title, body, data } = await req.json();

  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id,
    type,
    title,
    body,
    data,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});