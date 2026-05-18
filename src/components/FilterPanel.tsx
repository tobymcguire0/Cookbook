import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBrowseStore } from "../features/browse/useBrowseStore";
import { useRecipeCatalogViewModel } from "../features/browse/useRecipeCatalogViewModel";
import { useTaxonomyViewModel } from "../features/taxonomy/useTaxonomyViewModel";
import { cn } from "../lib/cn";

function ChevronIcon() {
  return (
    <svg className="filter-group-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FilterPanel() {
  const { query, toggleFilterTag, clearAllFilters } = useBrowseStore(
    useShallow((s) => ({
      query: s.query,
      toggleFilterTag: s.toggleFilterTag,
      clearAllFilters: s.clearAllFilters,
    })),
  );
  const { taxonomy } = useTaxonomyViewModel();
  const { visibleRecipes } = useRecipeCatalogViewModel();

  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const toggleCollapsed = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipe of visibleRecipes) {
      for (const tagId of recipe.tagIds) {
        counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
      }
    }
    return counts;
  }, [visibleRecipes]);

  const selectedTagIds = query.selectedTagIds;

  const renderableCategories = useMemo(() => {
    return taxonomy.categories
      .map((category) => {
        const tags = taxonomy.tags
          .filter((tag) => tag.categoryId === category.id)
          .filter((tag) => (tagCounts.get(tag.id) ?? 0) > 0 || selectedTagIds.includes(tag.id));
        const selectedCount = tags.reduce(
          (acc, tag) => acc + (selectedTagIds.includes(tag.id) ? 1 : 0),
          0,
        );
        return { category, tags, selectedCount };
      })
      .filter((group) => group.tags.length > 0);
  }, [taxonomy, tagCounts, selectedTagIds]);

  const hasActiveFilters =
    selectedTagIds.length > 0 ||
    query.searchText.length > 0;

  return (
    <div className="sidebar-filter-panel">
      {hasActiveFilters ? (
        <div className="filter-group filter-clear-top">
          <button type="button" className="clear-all-btn" onClick={clearAllFilters}>
            Clear all filters
          </button>
        </div>
      ) : null}
      {renderableCategories.map(({ category, tags, selectedCount }) => {
        const isCollapsed = collapsed.has(category.id);
        return (
          <div key={category.id} className={cn("filter-group", isCollapsed && "collapsed")}>
            <div
              className="filter-group-header"
              role="button"
              tabIndex={0}
              onClick={() => toggleCollapsed(category.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleCollapsed(category.id);
                }
              }}
            >
              <span className="filter-group-title">
                {category.name}
                {selectedCount > 0 ? (
                  <span className="filter-group-count">{selectedCount}</span>
                ) : null}
              </span>
              <ChevronIcon />
            </div>
            <div className="filter-group-body">
              {tags.map((tag) => (
                <label key={tag.id} className="filter-option">
                  <button
                    key={tag.id}
                    type="button"
                    className={cn("filter-option", selectedTagIds.includes(tag.id) && "active")}
                    aria-pressed={selectedTagIds.includes(tag.id)}
                    onClick={() => toggleFilterTag(tag.id)}
                  >
                    <span className="sidebar-tag-dot" style={{ background: selectedTagIds.includes(tag.id) ? "var(--accent-dark)" : "var(--accent-light)" }} />
                    {tag.name}
                    <span className="filter-option-count">{tagCounts.get(tag.id) ?? 0}</span>
                  </button>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FilterPanel;
