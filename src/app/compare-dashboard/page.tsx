'use client';

import DashboardPage from "../dashboard/page";

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <DashboardPage />
      </div>
      <div className="w-1/2">
        <DashboardPage />
      </div>
    </div>
  );
}
