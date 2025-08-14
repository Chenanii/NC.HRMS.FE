import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <>
      {isSidebarOpen && <Sidebar />}
      <div style={{ marginLeft: isSidebarOpen ? "240px" : "0", transition: "margin-left 0.3s" }}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main>{children}</main>
      </div>
    </>
  );
}
