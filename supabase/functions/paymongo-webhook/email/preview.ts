import { writeFileSync } from "node:fs";
import { membershipEmail } from "./membershipEmail.ts";

const html = membershipEmail(
  "Juan Dela Cruz",
  "juan@example.com",
  "PDG-000123",
  "https://res.cloudinary.com/diuruuyas/image/upload/v1779172364/logo-pdg-1_gojiba.png", // swap for your real logo URL
);

writeFileSync("preview.html", html);
console.log("Wrote preview.html");