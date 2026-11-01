import { encodeBase64 } from "jsr:@std/encoding/base64";
import { generateIdPdf } from "./generate-id-pdf.ts"; 
import { supabaseAdmin } from "./supabaseAdmin.ts";          

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

export interface IssuedId {
  base64: string;
  filename: string;
  downloadUrl: string | null;
}

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const TEMPLATE_URL = "https://res.cloudinary.com/diuruuyas/image/upload/v1793499169/membership-id-template_rkt0fb.png"; // your uploaded template
const BUCKET = "member-ids"; // private bucket
const LINK_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

let templateCache: Uint8Array | null = null;

async function getTemplate(): Promise<Uint8Array> {
  if (templateCache) return templateCache;
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Template fetch failed (${res.status})`);
  templateCache = new Uint8Array(await res.arrayBuffer());
  return templateCache;
}

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

export async function issueMemberId(member: {
  memberId: string;
  name: string;
  plan: string | null;
  fullAddress: string;
  photoPath: string | null; // storage path, not public URL
}): Promise<IssuedId> {
  const path = `${member.memberId}.pdf`;

  let photoBytes: Uint8Array | null = null;
  if (member.photoPath) {
    const { data, error } = await supabaseAdmin.storage.from("member-photos").download(member.photoPath);
    if (error) console.error("[issueId] photo_download_failed", { path: member.photoPath, error });
    else photoBytes = new Uint8Array(await data.arrayBuffer());
  } else {
    console.warn("[issueId] no_photo_path", { memberId: member.memberId });
  }

  const templateBytes = await getTemplate();

  const pdfBytes = await generateIdPdf({
    memberId: member.memberId,
    fullName: member.name,
    plan: member.plan,
    fullAddress: member.fullAddress,
    qrValue: member.memberId, // or a verification URL, see below
    templateBytes,
    photoBytes,
  });

  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, pdfBytes, { contentType: "application/pdf", upsert: true });
  if (upErr) throw upErr;

  const { error: updErr } = await supabaseAdmin
    .from("members")
    .update({ id_pdf_path: path })
    .eq("member_id", member.memberId);
  if (updErr) console.error("[issueId] id_pdf_path_update_failed", updErr);

  const filename = `PDG-Membership-ID-${member.memberId}.pdf`;
  const { data: signed } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, LINK_TTL_SECONDS, { download: filename });

  return {
    base64: encodeBase64(pdfBytes),
    filename,
    downloadUrl: signed?.signedUrl ?? null,
  };
}