import { useAuth } from "react-oidc-context";
import { useShallow } from "zustand/react/shallow";

import { useBrowseStore } from "../features/browse/useBrowseStore";
import { useLoginPromptStore } from "../features/auth/useLoginPromptStore";
import { useRecipeEditorActions } from "../features/editor/useRecipeEditorViewModel";
import { useSearchViewModel } from "../features/browse/useSearchViewModel";
import { cn } from "../lib/cn";
import FilterPanel from "./FilterPanel";

function AppSidebar() {
  const auth = useAuth();
  const openLoginPrompt = useLoginPromptStore((s) => s.openPrompt);
  const { activeView, setActiveWorkspace } = useBrowseStore(
    useShallow((s) => ({
      activeView: s.activeView,
      setActiveWorkspace: s.setActiveWorkspace,
    })),
  );

  const search = useSearchViewModel();
  const { openCreateEditor } = useRecipeEditorActions();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C8.5 3 5.5 5 4 8H20C18.5 5 15.5 3 12 3Z"/>
          <path d="M3.5 10C3.2 11.3 3 12 3 13C3 18 7 21 12 21C17 21 21 18 21 13C21 12 20.8 11.3 20.5 10H3.5Z" opacity=".5"/>
          <path d="M8 14C8 14 9 16 12 16C15 16 16 14 16 14" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <span className="sidebar-logo-name">Saucer</span>
      </div>

      <nav className="sidebar-section">
        <div className="sidebar-section-label">Library</div>
        <div className="sidebar-nav">
          <button
            type="button"
            className={cn("sidebar-nav-item", activeView === "browse" && "active")}
            onClick={() => setActiveWorkspace("browse")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
            All Recipes
          </button>
          <button
            type="button"
            className={cn("sidebar-nav-item", activeView === "search" && "active")}
            onClick={() => setActiveWorkspace("search")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            Search
          </button>
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => openCreateEditor("website")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Import Recipe
          </button>
        </div>
      </nav>

      <div className="sidebar-section sidebar-section-filters">
        <div className="sidebar-section-label">Filters</div>
        <FilterPanel />
      </div>

      <div className="sidebar-footer">
        <button type="button" className="btn-random" onClick={search.chooseRandomRecipe}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20l8-8"/><path d="M21 3l-9 9"/><path d="M4 4l5 5"/><path d="M16 16l5 5"/></svg>
          Random Recipe
        </button>
        <button
          type="button"
          className={cn("sidebar-nav-item", activeView === "settings" && "active")}
          onClick={() => {
            if (!auth.isAuthenticated) {
              openLoginPrompt("Log in to access settings.");
              return;
            }
            setActiveWorkspace("settings");
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
