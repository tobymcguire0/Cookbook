import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useShallow } from "zustand/react/shallow";

import RecipeCard from "../RecipeCard";
import { useBrowseWorkspaceViewModel } from "../../features/browse/useBrowseWorkspaceViewModel";
import { useBrowseStore } from "../../features/browse/useBrowseStore";
import { useTaxonomyViewModel } from "../../features/taxonomy/useTaxonomyViewModel";
import { useRecipeEditorActions } from "../../features/editor/useRecipeEditorViewModel";
import { usePreferencesStore } from "../../features/preferences/usePreferencesStore";
import { cn } from "../../lib/cn";
import type { RecipeSort } from "../../lib/models";

function BrowseWorkspace() {
  const auth = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const compact = usePreferencesStore((s) => s.compactCards);

  const {
    visibleRecipes,
    groupedRecipes,
    groupByCategoryId,
    deleteRecipe,
    updateRecipeRating,
    openEditEditor,
    openRecipeDetail,
    tagLookup,
  } = useBrowseWorkspaceViewModel();

  const { taxonomy } = useTaxonomyViewModel();
  const { openCreateEditor } = useRecipeEditorActions();
  const { sortBy, updateSortBy, updateGroupByCategory } = useBrowseStore(
    useShallow((s) => ({
      sortBy: s.query.sortBy,
      updateSortBy: s.updateSortBy,
      updateGroupByCategory: s.updateGroupByCategory,
    })),
  );

  const isGrouped = Boolean(groupByCategoryId) && groupedRecipes.length > 0;
  const gridClass = cn("recipe-grid", view === "list" && "list", compact && view === "grid" && "compact");

  return (
    <>
      {!auth.isAuthenticated ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-md)",
            padding: "var(--sp-3) var(--sp-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--sp-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
            <span aria-hidden="true">🔑</span>
            <span className="text-sm">
              Log in to sync recipes across devices and access more importing options.
            </span>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => void auth.signinRedirect()}>
            Log in
          </button>
        </div>
      ) : null}
      <div className="filter-bar">
        <label className="group-by-control">
          <span className="group-by-label">Group by</span>
          <select
            className="sort-select"
            value={groupByCategoryId}
            onChange={(e) => updateGroupByCategory(e.target.value)}
          >
            <option value="">None</option>
            {taxonomy.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="sort-menu">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => updateSortBy(e.target.value as RecipeSort)}
          >
            <option value="updated">Recently added</option>
            <option value="title">A → Z</option>
            <option value="rating">Highest rated</option>
            <option value="cuisine">By cuisine</option>
          </select>
          <div className="grid-toggle">
            <button
              type="button"
              className={cn("grid-toggle-btn", view === "grid" && "active")}
              onClick={() => setView("grid")}
              title="Grid view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button
              type="button"
              className={cn("grid-toggle-btn", view === "list" && "active")}
              onClick={() => setView("list")}
              title="List view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {visibleRecipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <div className="empty-title">No recipes found</div>
            <div className="empty-desc">Try adjusting your filters or import a new recipe to get cooking.</div>
            <button type="button" className="btn btn-primary" onClick={() => openCreateEditor("website")}>
              Import recipe
            </button>
          </div>
        ) : isGrouped ? (
          <div className="grouped-recipes">
            {groupedRecipes.map((section) => (
              <section key={section.id} className="grouped-recipe-section">
                <h2 className="grouped-recipe-heading">
                  {section.label}
                  <span className="grouped-recipe-count">{section.recipes.length}</span>
                </h2>
                <div className={gridClass}>
                  {section.recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      tagLookup={tagLookup}
                      onEdit={openEditEditor}
                      onDelete={deleteRecipe}
                      onOpenDetail={openRecipeDetail}
                      onRate={updateRecipeRating}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={gridClass}>
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                tagLookup={tagLookup}
                onEdit={openEditEditor}
                onDelete={deleteRecipe}
                onOpenDetail={openRecipeDetail}
                onRate={updateRecipeRating}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BrowseWorkspace;
