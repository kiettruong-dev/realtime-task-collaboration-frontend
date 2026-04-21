import { getAccessToken } from "@/utils/token";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const token = getAccessToken();

  if (!token) {
    console.log(!token);
    return <Navigate to="/login" />;
  }

  return children;
}
