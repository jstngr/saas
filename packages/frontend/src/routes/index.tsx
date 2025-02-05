import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { EmailVerification } from "../pages/auth/EmailVerification";
import { MagicLinkLanding } from "../pages/auth/MagicLinkLanding";
import { AccountLocked } from "../pages/auth/AccountLocked";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";
import { SecuritySettings } from "../pages/settings/SecuritySettings";
import { AppLayout } from "../components/layout/AppLayout/AppLayout";
import { AuthLayout } from "../components/layout/AuthLayout/AuthLayout";
import { ProjectList } from "../pages/projects/ProjectList";

export const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthLayout />}>
      <Route
        path="login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />
      <Route
        path="magic-link"
        element={
          <PublicRoute>
            <MagicLinkLanding />
          </PublicRoute>
        }
      />
      <Route
        path="locked"
        element={
          <PublicRoute>
            <AccountLocked />
          </PublicRoute>
        }
      />
    </Route>

    <Route
      path="/"
      element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }
    >
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings/security" element={<SecuritySettings />} />
    </Route>
  </Routes>
);
