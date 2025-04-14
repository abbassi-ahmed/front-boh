import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Settings,
  LogOut,
  VideoIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/user/home", icon: HomeIcon, label: "Statistics" },
  { path: "/user/my-videos", icon: VideoIcon, label: "My Videos" },
  { path: "/user/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      const sidebar = document.getElementById("sidebar");
      if (
        isMobileOpen &&
        sidebar &&
        !sidebar.contains(e.target) &&
        !e.target.classList.contains("mobile-menu-button")
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      <button
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        className="mobile-menu-button md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors duration-200 shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        id="sidebar"
        className={`
          ${isCollapsed ? "w-20" : "w-72"} 
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          fixed md:relative h-screen bg-zinc-900 border-r border-zinc-800/50 
          transition-all duration-300 ease-in-out z-40
          shadow-xl md:shadow-none
          backdrop-blur-sm bg-opacity-95
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
            <h1
              className={`text-2xl font-bold text-purple-500 transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Dashboard
            </h1>

            {isCollapsed ? (
              <span className="text-2xl font-bold text-purple-500 mx-auto">
                D
              </span>
            ) : null}

            {/* Collapse toggle button (desktop only) */}
            <button
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center p-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-purple-900/30 text-purple-400 font-medium"
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                        group relative
                      `}
                    >
                      <item.icon
                        className={`
                        ${isActive ? "text-purple-400" : ""}
                        ${isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}
                        transition-all duration-200
                        group-hover:scale-110
                      `}
                      />

                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div
                          className="
                          absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-zinc-200 
                          rounded text-sm whitespace-nowrap opacity-0 invisible
                          group-hover:opacity-100 group-hover:visible
                          transition-all duration-200 z-50
                        "
                        >
                          {item.label}
                        </div>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer with logout */}
          <div className="p-3 border-t border-zinc-800/50 mt-auto">
            <button
              onClick={logout}
              className={`
                w-full flex items-center p-3 rounded-lg text-red-400 
                hover:bg-red-900/20 hover:text-red-300 transition-all duration-200
                ${isCollapsed ? "justify-center" : ""}
                group relative
              `}
            >
              <LogOut
                className={`
                ${isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}
                transition-all duration-200
              `}
              />

              {!isCollapsed && <span>Logout</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div
                  className="
                  absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-zinc-200 
                  rounded text-sm whitespace-nowrap opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 z-50
                "
                >
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
