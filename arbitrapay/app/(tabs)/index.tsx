import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function Index() {
  const { profile, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  if (profile?.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}