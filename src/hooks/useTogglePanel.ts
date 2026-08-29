import { useCallback, useState } from "react";

export function useTogglePanel() {
  const [open, setOpen] = useState(false);

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => setOpen(false), []);

  return { open, openPanel, closePanel };
}