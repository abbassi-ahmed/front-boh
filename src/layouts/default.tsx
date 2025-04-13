import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Navbar } from "../components/navbar";

const DefaultLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden p-4 bg-zinc-900/90 border-b border-zinc-800/50 backdrop-blur-sm">
          <Navbar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-purple-900/20 to-black">
          <div className="hidden md:block p-6">
            <Navbar />
          </div>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
