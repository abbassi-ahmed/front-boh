import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const currentRoute = useLocation();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-xl font-semibold text-purple-600 cursor-pointer">
        {currentRoute.pathname.replace("/user/", "").toUpperCase()}
      </div>
    </div>
  );
};
