import { getSafeOrigin, json, preflight } from "../_shared/cors.ts";
import { ActiveMembershipError } from "../_shared/members.ts";
import { registrationSchema } from "../_shared/schema.ts";

import { registerAndCheckoutServer } from "./registerAndCheckoutServer.ts";

// --------------------------------------------------------------------------------------------//
// FUNCTION
// --------------------------------------------------------------------------------------------//

Deno.serve(async (req) => {

  // HANDLE PREFLIGHT REQUEST
  if (req.method === "OPTIONS") return preflight(req);

  // READ AND VALIDATE DATA
  let form: FormData;
  let rawValues: unknown;
  try {
    form = await req.formData();
    rawValues = JSON.parse(form.get("values") as string);
  } catch {
    return json(req, { error: "Malformed request" }, 400);
  }

  const photo = form.get("photo");
  if (!(photo instanceof File)) return json(req, { error: "Photo required" }, 400);

  const parsed = registrationSchema.safeParse(rawValues);
  if (!parsed.success) {
    console.error("Validation failed:", JSON.stringify(parsed.error.issues, null, 2));
    return json(req, { error: "Invalid input", issues: parsed.error.issues }, 400);
  }

  // TODO: verify CAPTCHA token + rate limit

  // REGISTER AND CHECKOUT
  try {
    const out = await registerAndCheckoutServer(parsed.data, photo, parsed.data.plan, {
      confirmRenewal: form.get("confirmRenewal") === "true",
      baseUrl: getSafeOrigin(req) ?? undefined
    });
    return json(req, out);
  } catch (e) {
    if (e instanceof ActiveMembershipError)
      return json(req, { code: "ACTIVE_MEMBERSHIP", expiresAt: e.expiresAt }, 409);
    console.error(e);
    return json(req, { error: "Registration failed" }, 500);
  }
});