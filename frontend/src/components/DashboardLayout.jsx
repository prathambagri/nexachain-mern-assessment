import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen max-md:flex-col">
      <Sidebar />
      <main className="flex-1 px-10 pt-8 pb-16 max-w-[1160px] max-md:px-[18px] max-md:pt-6 max-md:pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
