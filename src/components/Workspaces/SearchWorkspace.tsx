import { useShallow } from "zustand/react/shallow";

import RecipeCard from "../RecipeCard";
import { useBrowseStore } from "../../features/browse/useBrowseStore";
import { useTaxonomyViewModel } from "../../features/taxonomy/useTaxonomyViewModel";
import { useRecipeCatalogViewModel } from "../../features/browse/useRecipeCatalogViewModel";
import { useRecipeEditorActions } from "../../features/editor/useRecipeEditorViewModel";
import { useAppShellViewModel } from "../../features/app/useAppShellViewModel";
import { cn } from "../../lib/cn";

const QUICK_FILTER_TAGS = ["Quick", "Vegetarian", "Dinner", "Breakfast"];

function SearchWorkspace() {
  const { query, updateSearchText, toggleFilterTag, setMinRating, setMaxTotalMinutes, clearAllFilters } =
    useBrowseStore(
      useShallow((s) => ({
        query: s.query,
        updateSearchText: s.updateSearchText,
        toggleFilterTag: s.toggleFilterTag,
        setMinRating: s.setMinRating,
        setMaxTotalMinutes: s.setMaxTotalMinutes,
        clearAllFilters: s.clearAllFilters,
      })),
    );
  const { taxonomy, tagLookup } = useTaxonomyViewModel();
  const { visibleRecipes, deleteRecipe, updateRecipeRating } = useRecipeCatalogViewModel();
  const { openEditEditor } = useRecipeEditorActions();
  const { openRecipeDetail } = useAppShellViewModel();

  const hasActiveFilters =
    query.selectedTagIds.length > 0 ||
    query.searchText.length > 0 ||
    typeof query.minRating === "number" ||
    typeof query.maxTotalMinutes === "number";

  const quickFilterTagIds = QUICK_FILTER_TAGS.map((name) =>
    taxonomy.tags.find((t) => t.name === name)?.id,
  ).filter((id): id is string => Boolean(id));

  return (
    <div className="search-shell">
      <div className={cn("search-hero", query.searchText && "compact")}>
        <h1 className="search-hero-title">Find anything in your library</h1>
        <div className="search-hero-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
          <input
            type="text"
            placeholder="Search recipes, ingredients, tags…"
            value={query.searchText}
            onChange={(e) => updateSearchText(e.target.value)}
            autoFocus
          />
        </div>
        <div className="quick-filters">
          {quickFilterTagIds.map((tagId) => (
            <button
              key={tagId}
              type="button"
              className={cn("filter-chip", query.selectedTagIds.includes(tagId) && "active")}
              onClick={() => toggleFilterTag(tagId)}
            >
              {tagLookup.get(tagId)?.name}
            </button>
          ))}
          <button
            type="button"
            className={cn("filter-chip", query.minRating === 4 && "active")}
            onClick={() => setMinRating(query.minRating === 4 ? undefined : 4)}
          >
            Top rated
          </button>
        </div>
      </div>

      <div className="results-pane">
        {hasActiveFilters ? (
          <div className="active-filters">
            <span className="active-filter-label">Active:</span>
            {query.selectedTagIds.map((tagId) => (
              <span key={tagId} className="active-filter-tag">
                {tagLookup.get(tagId)?.name ?? tagId}
                <button type="button" onClick={() => toggleFilterTag(tagId)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            ))}
            {typeof query.minRating === "number" ? (
              <span className="active-filter-tag">
                {query.minRating}+ stars
                <button type="button" onClick={() => setMinRating(undefined)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            ) : null}
            {typeof query.maxTotalMinutes === "number" ? (
              <span className="active-filter-tag">
                Under {query.maxTotalMinutes} min
                <button type="button" onClick={() => setMaxTotalMinutes(undefined)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </span>
            ) : null}
            <button type="button" className="clear-all-btn" onClick={clearAllFilters}>Clear all</button>
          </div>
        ) : null}

        <div className="results-header">
          <span className="results-count">
            {visibleRecipes.length} <span>result{visibleRecipes.length === 1 ? "" : "s"}</span>
          </span>
        </div>

        {visibleRecipes.length === 0 ? (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <div className="search-empty-title">No matches</div>
            <div className="search-empty-desc">Try a different search term or remove filters to see more recipes.</div>
          </div>
        ) : (
          <div className="recipe-grid">
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
    </div>
  );
}

export default SearchWorkspace;
