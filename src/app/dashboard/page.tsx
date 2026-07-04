import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Freedom HQ — your dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Freedom HQ</p>
        <h1 className="mt-1 text-3xl font-bold">Command dashboard</h1>
        <p className="mt-2 text-olive-400">
          Your briefing, your tools, your next moves — all in one place.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
