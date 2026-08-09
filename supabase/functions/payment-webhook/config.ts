export const CONFIG = {
  emailFrom: "Philippine Data Guardians <members@phdataguardians.org>",
  logoUrl: "https://res.cloudinary.com/diuruuyas/image/upload/v1779172364/logo-pdg-1_gojiba.png",
  webhookEvent: "checkout_session.payment.paid",
  timestampToleranceSecs: 300,
  redirectUrls: {
    newUser: "https://privacy-lens-sooty.vercel.app/setup-account",
    existingUser: "https://privacy-lens-sooty.vercel.app/login",
  },
} as const;