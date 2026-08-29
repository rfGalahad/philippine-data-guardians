import { ActivityLogPanel } from "@/features/activityLog";

import { GrowthChart } from "../components/GrowthChart";


export default function DashboardPage() {

  return (
    <div className="min-h-screen w-full bg-surface-light p-8 font-body">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GrowthChart/>
        <ActivityLogPanel />
      </div>
    </div>
  );
}