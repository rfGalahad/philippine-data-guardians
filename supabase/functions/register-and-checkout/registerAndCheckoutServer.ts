import {
  ActiveMembershipError,
  checkEmailMembership,
  deleteMember,
  registerMember, 
  renewMembership
} from "../_shared/members.ts";
import { deletePendingPayment } from "../_shared/payments.ts";
import { removePhoto, uploadPhoto, validatePhoto } from "../_shared/photos.ts";
import { getPlan } from "../_shared/plan.ts";
import { createMemberPayload } from "../_shared/payload.ts";
import { createCheckout } from "../_shared/checkout.ts";
import { getFullName } from "../_shared/utils.ts";
import type { RegistrationValues } from "../_shared/schema.ts";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type Created = {
  memberId: string;
  subscriptionId: string;
  paymentId: string;
  isExisting: boolean;
  memberCreated: boolean;
};

// ---------------------------------------------------------------------------
// FUNCTION
// ---------------------------------------------------------------------------

export async function registerAndCheckoutServer(
  values: RegistrationValues,
  photo: File,
  plan: string,
  opts: { confirmRenewal: boolean; baseUrl?: string },
) {
  // 1. VALIDATE PHOTO
  const ext = validatePhoto(photo); 

  const status = await checkEmailMembership(values.emailAddress);

  // 2. CHECK ACTIVE MEMBERSHIP
  if (status.exists && !opts.confirmRenewal) {
    throw new ActiveMembershipError(status.expires_at ?? null, status.is_active);
  }

  // 3. TRACK WHAT THIS REQUEST CREATES
  let photoPath: string | null = null;
  let created: Created | null = null;

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
      payment: { 
        method: "paymongo", 
        referenceNumber: "pending" 
      },
      paymentStatus: "pending",
    });

    const register = status.exists
      ? await renewMembership(payload) 
      : await registerMember(payload);

    created = {
      memberId: register.member_id,
      subscriptionId: register.subscription_id,
      paymentId: register.payment_id,
      isExisting: register.is_existing_subscriber,
      memberCreated: register.member_created ?? false,
    };

    // 6. CHECKOUT
    const checkout = await createCheckout({
      paymentId: register.payment_id,
      amount: Number(register.amount),
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

async function rollback(created: Created | null, photoPath: string | null) {
  if (created) {
    try {
      if (created.isExisting) {
        await deletePendingPayment(created.paymentId);
        if (created.memberCreated) await deleteMember(created.memberId);
      } else {
        await deleteMember(created.memberId);
      }
    } catch (e) {
      console.error("Rollback DB cleanup failed", e);
      return; // the member may still reference the photo, so keep the file
    }
  }
  if (photoPath) {
    try {
      await removePhoto(photoPath);
    } catch (e) {
      console.error("Rollback photo cleanup failed", e);
    }
  }
}