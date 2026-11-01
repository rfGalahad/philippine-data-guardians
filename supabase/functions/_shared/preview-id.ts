import { generateIdPdf } from "./generate-id-pdf.ts";
import { buildFullAddress } from "./address.ts";

const TEMPLATE_URL =
  "https://res.cloudinary.com/diuruuyas/image/upload/v1793499169/membership-id-template_rkt0fb.png";

const templateBytes = new Uint8Array(await (await fetch(TEMPLATE_URL)).arrayBuffer());

// Optional: drop a test photo next to this file to check the photo fit
let photoBytes: Uint8Array | null = null;
try {
  photoBytes = await Deno.readFile(new URL("./preview-photo.jpg", import.meta.url));
} catch { /* no photo, the initials fallback is used */ }

const samples = [
  {
    file: "normal",
    name: "Test Account Two",
    plan: "Professional",
    address: { 
      houseNumber: "Mag", 
      street: "Cho", 
      barangay: "Bayabas",
      cityMunicipality: "City of Cabadbaran", 
      province: "Agusan del Norte" 
    },
    photo: photoBytes,
  },
  {
    file: "long-text-no-photo",
    name: "Maria Cristina Dela Cruz-Villanueva Jr.",
    plan: "Student Academic",
    address: { 
      houseNumber: "Blk 12 Lot 34", 
      street: "Mabuhay Extension Street",
      barangay: "San Isidro Poblacion", 
      cityMunicipality: "City of Cabadbaran",
      province: "Agusan del Norte" 
    },
    photo: null,
  },
];

await Deno.mkdir("preview-out", { recursive: true });

for (const s of samples) {
  const pdf = await generateIdPdf({
    memberId: "PDG-2026-045",
    fullName: s.name,
    plan: s.plan,
    fullAddress: buildFullAddress(s.address),
    qrValue: "PDG-2026-045",
    templateBytes,
    photoBytes: s.photo,
  });
  await Deno.writeFile(`preview-out/${s.file}.pdf`, pdf);
}

console.log("Wrote preview-out/*.pdf");