import { useState } from "react";

import DashboardGrid from "../../../components/layout/DashboardGrid";
import NotificationPanel from "../../../components/layout/NotificationPanel";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Main content */}

        <main className="flex-1 p-6 lg:grid-cols-3 row-2 gap-6">
            <DashboardGrid sidebarOpen={sidebarOpen} />

        </main>
        <NotificationPanel />

    </div>
  );
}
