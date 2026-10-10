import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export function useUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useClickOutside(menuRef, close);

  return { menuRef, isOpen, toggle, close };
}