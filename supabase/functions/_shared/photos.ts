import { supabaseAdmin } from "./supabaseAdmin.ts";

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const BUCKET = "member-photos";
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// --------------------------------------------------------------------------------------------//
// FUNCTIONS
// --------------------------------------------------------------------------------------------//

export function validatePhoto(photo: File): string {
  const ext = EXT[photo.type];
  if (!ext) throw new Error("Invalid photo type");
  if (photo.size > MAX_BYTES) throw new Error("Photo too large");
  return ext;
}

export async function uploadPhoto(photo: File, ext: string) {
  const path = `photos/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, photo, { contentType: photo.type });
  if (error) throw new Error(`Failed to upload photo: ${error.message}`);

  const url = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return { path, url };
}

export async function removePhoto(path: string) {
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}