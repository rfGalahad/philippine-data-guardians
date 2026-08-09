import { LayoutGrid } from "lucide-react";

export default function SubscribersPage() {
  return (
    <div className="min-h-screen w-full bg-surface-light p-8">

      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">Nothing here yet</p>
        </div>
      </div>
    </div>
  );
}