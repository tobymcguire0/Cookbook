import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

import { useLoginPromptStore } from "../features/auth/useLoginPromptStore";

function LoginPromptModal() {
  const auth = useAuth();
  const open = useLoginPromptStore((s) => s.open);
  const message = useLoginPromptStore((s) => s.message);
  const close = useLoginPromptStore((s) => s.close);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  function handleLogin() {
    close();
    void auth.signinRedirect();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        background: "rgba(62,43,30,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "32rem",
          padding: "var(--sp-6)",
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--r-lg)",
        }}
      >
        <p
          className="text-xs font-semi"
          style={{ textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          Authentication
        </p>
        <h1 id="login-prompt-title" className="text-2xl font-bold" style={{ marginTop: "var(--sp-2)" }}>
          Log in to continue
        </h1>
        <p className="text-sm text-muted" style={{ marginTop: "var(--sp-3)" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
          <button type="button" className="btn btn-primary" onClick={handleLogin}>
            Log in
          </button>
          <button type="button" className="btn btn-secondary" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPromptModal;
