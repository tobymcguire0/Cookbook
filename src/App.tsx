import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

import AppWorkspace from "./components/AppWorkspace";
import AppSidebar from "./components/AppSidebar";
import LoginPromptModal from "./components/LoginPromptModal";
import SaucerLoader from "./components/SaucerLoader";
import { useAppBootstrap } from "./features/app/useAppBootstrap";
import { useAppShellViewModel } from "./features/app/useAppShellViewModel";
import { useAuthStatusStore } from "./features/auth/useAuthStatusStore";
import { useRequireAuth } from "./features/auth/useRequireAuth";
import { useSyncEffect } from "./features/sync/useSyncEffect";
import { usePreferencesEffect } from "./features/preferences/usePreferencesEffect";

function AppContent() {
  useAppBootstrap();
  useSyncEffect();
  usePreferencesEffect();
  const auth = useAuth();
  useEffect(() => {
    useAuthStatusStore.getState().setIsAuthenticated(auth.isAuthenticated);
  }, [auth.isAuthenticated]);
  const { loading } = useAppShellViewModel();

  return (
    <div className="app-shell">
      <AppSidebar />
      <AppWorkspace />
      {loading ? <SaucerLoader variant="overlay" label="Loading local Saucer…" /> : null}
      <LoginPromptModal />
    </div>
  );
}

function App() {
  const auth = useRequireAuth();

  if (auth.isLoading) {
    return <SaucerLoader variant="splash" label="Signing you in…" />;
  }

  if (auth.error) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div style={{ maxWidth: "32rem", padding: "var(--sp-6)", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
          <p className="text-xs font-semi" style={{ textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)" }}>
            Authentication
          </p>
          <h1 className="text-2xl font-bold" style={{ marginTop: "var(--sp-2)" }}>Sign-in needs attention</h1>
          <p className="text-sm text-muted" style={{ marginTop: "var(--sp-3)" }}>Authentication error: {auth.error.message}</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: "var(--sp-4)" }} onClick={() => auth.signinRedirect()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <AppContent />;
}

export default App;
