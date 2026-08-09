import { useEffect, useState } from "react";


export function useObjectUrl(file: File | null | undefined) {

  const [prevFile, setPrevFile] = useState(file);
  const [url, setUrl] = useState<string | null>(() =>
    file ? URL.createObjectURL(file) : null
  );

  if (file !== prevFile) {
    setPrevFile(file);
    setUrl(file ? URL.createObjectURL(file) : null);
  }

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}