import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

import { getAccessToken } from "./utils/token";
import { connectSocket } from "./socket/socket";
import LoginPage from "./pages/login/login_page";
import WorkspacePage from "./pages/workspace/workspace_page";
import TaskPage from "./pages/task/task_page";
import RegisterPage from "./pages/register/register_page";
import MainLayout from "./layout/main_layout";

export default function App() {
  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/workspaces/:workspaceId" element={<TaskPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
