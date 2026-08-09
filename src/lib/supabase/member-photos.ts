import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// CONSTANTS 
// ---------------------------------------------------------------------------

const STORAGE_BUCKET = 'member-photos';
const PHOTO_FOLDER = 'photos';

// ---------------------------------------------------------------------------
// QUERIES 
// ---------------------------------------------------------------------------

export function getMemberPhotoPath(url: string): string | null {
  const marker = `/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split('?')[0];
}

export function getMemberPhotoUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMemberPhoto(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${PHOTO_FOLDER}/${fileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(`Failed to upload photo: ${error.message}`);
  return filePath;
}

export async function removeMemberPhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.error('Failed to clean up photo after failed registration:', error.message);
}