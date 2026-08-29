import { type ReactNode } from "react";
import { Pencil, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// ACCORDION SECTION
// ---------------------------------------------------------------------------

export const AccordionSection = ({
  title,
  isOpen,
  onToggle,
  onEdit,
  children,
}: AccordionSectionProps) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="group flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex flex-1 items-center justify-between rounded-md py-4 pl-2 -ml-2 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          <span className="font-medium text-gray-900">{title}</span>
          <ChevronDown
            size={18}
            strokeWidth={2}
            className={`mr-1 shrink-0 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 group-hover:opacity-100"
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-sm text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
};