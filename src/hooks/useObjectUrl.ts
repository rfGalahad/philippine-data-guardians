import { useEffect, useMemo } from 'react';

export function useObjectUrl(file: File | Blob | string | null | undefined) {

  const isBlobLike = file instanceof Blob;

  const url = useMemo(() => {
    if (!file) return null;
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!isBlobLike || !url) return;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url, isBlobLike]);

  return url;
}