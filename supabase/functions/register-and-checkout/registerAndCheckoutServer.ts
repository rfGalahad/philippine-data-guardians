import {
  ActiveMembershipError,
  checkEmailMembership,
  deleteMember,
  registerMember, 
} from "../_shared/members.ts";
import { deletePendingPayment } from "../_shared/payments.ts";
import { removePhoto, uploadPhoto, validatePhoto } from "../_shared/photos.ts";
import { getPlan } from "../_shared/plan.ts";
import { createMemberPayload } from "../_shared/payload.ts";
import { createCheckout } from "../_shared/checkout.ts";
import { getFullName } from "../_shared/utils.ts";
import type { RegistrationValues } from "../_shared/schema.ts";


export async function registerAndCheckoutServer(
  values: RegistrationValues,
  photo: File,
  plan: string,
  opts: { confirmRenewal: boolean; baseUrl?: string },
) {
  // 1. VALIDATE PHOTO
  const ext = validatePhoto(photo);

  // 2. CHECK ACTIVE MEMBERSHIP
  if (!opts.confirmRenewal) {
    const status = await checkEmailMembership(values.emailAddress);
    if (status.exists && status.is_active) {
      throw new ActiveMembershipError(status.expires_at ?? null);
    }
  }

  // 3. TRACK WHAT THIS REQUEST CREATES
  let photoPath: string | null = null;
  let created: { memberId: string; subscriptionId: string; isExisting: boolean } | null = null;

  try {
    // 4. UPLOAD PHOTO
    const uploaded = await uploadPhoto(photo, ext);
    photoPath = uploaded.path;

    // 5. REGISTER
    const planDetails = await getPlan(plan);
    const payload = createMemberPayload({
      values,
      photoUrl: uploaded.url,
      plan: planDetails,
      payment: { method: "paymongo", referenceNumber: "pending" },
      paymentStatus: "pending",
    });

    const reg = await registerMember(payload);
    created = {
      memberId: reg.member_id,
      subscriptionId: reg.subscription_id,
      isExisting: reg.is_existing_subscriber,
    };

    // 6. CHECKOUT
    const checkout = await createCheckout({
      paymentId: reg.payment_id,
      amount: Number(reg.amount),
      customerName: getFullName(values),
      email: values.emailAddress,
      description: `${plan} - PDG Membership Registration`,
      serviceName: "membership",
      baseUrl: opts.baseUrl
    });

    return { url: checkout.url };
  } catch (err) {
    await rollback(created, photoPath);
    throw err;
  }
}

async function rollback(
  created: { memberId: string; subscriptionId: string; isExisting: boolean } | null,
  photoPath: string | null,
) {
  try {
    if (created) {
      if (created.isExisting) await deletePendingPayment(created.subscriptionId);
      else await deleteMember(created.memberId);
    }
    if (photoPath && !created?.isExisting) await removePhoto(photoPath);
  } catch (cleanupErr) {
    console.error("Rollback failed", cleanupErr);
  }
}