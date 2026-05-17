import { useAuth } from "react-oidc-context";

import { hasAuthCallbackParams } from "./oidc";

type AuthRedirectState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  activeNavigator?: string;
  error?: unknown;
  search: string;
};

export function shouldStartSignIn({
  isAuthenticated,
  isLoading,
  activeNavigator,
  error,
  search,
}: AuthRedirectState) {
  return (
    !isAuthenticated &&
    !isLoading &&
    !activeNavigator &&
    !error &&
    !hasAuthCallbackParams(search)
  );
}

export function useRequireAuth() {
  return useAuth();
}
