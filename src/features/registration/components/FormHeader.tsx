import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  icon: ReactNode;
}

export const FormHeader = ({ title, icon }: HeaderProps) => {
  return (
    <div className="relative mb-1 flex items-center gap-3.5 border-b-[1.5px] p-6 border-[rgba(5,50,97,0.1)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(5,50,97,0.07)]">
        {icon}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[0.62rem] font-bold uppercase leading-none tracking-widest text-[rgba(5,50,97,0.4)]">
          PDG Registration
        </span>
        <span className="text-[1.05rem] font-bold leading-tight tracking-[-0.2px] text-[#053261] sm:text-[1.25rem]">
          {title}
        </span>
      </div>
    </div>
  );
};