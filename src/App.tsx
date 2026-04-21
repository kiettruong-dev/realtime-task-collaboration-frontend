import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

import { getAccessToken } from "./utils/token";
import { connectSocket } from "./socket/socket";
import LoginPage from "./pages/login/login_page";
import WorkspacePage from "./pages/workspace/workspace_page";

export default function App() {
  const token = getAccessToken();

  // 🔌 Auto connect socket nếu đã login
  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
