import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./styles/theme";

export const App = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
