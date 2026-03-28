"use client";

import { useCallback, memo } from "react";
import { categories } from "@/lib/resourcesData";
import { useRouter } from "next/navigation";

type Props = {
  resourceCounts: Record<string, number>;
  activeCategory: string;
};

function CategoryFilter({
  resourceCounts,
  activeCategory,
}: Props) {
  const router = useRouter();

  // Stable callback to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === "all") {
      router.push("/resources");
    } else {
      router.push(`/resources/category/${categoryId}`);
    }
  }, [router]);

  return (
    <div
      className="flex flex-wrap gap-3 justify-center"
      role="tablist"
      aria-label="Resource categories"
    >
      {categories.map((category) => {
        const CategoryIcon = category.icon;
        const isActive = activeCategory === category.id;
        const isEmoji = typeof CategoryIcon === "string";

        // Memoized icon renderer to prevent re-creation
        const renderIcon = () => {
          if (isEmoji) {
            return <span className="text-base" aria-hidden="true">{CategoryIcon}</span>;
          }
          // Type assertion: we know it's a component if not a string
          const IconComponent = CategoryIcon as React.ComponentType<{
            className?: string;
          }>;
          return <IconComponent className="w-4 h-4" aria-hidden="true" />;
        };

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isActive
                ? "text-white shadow-lg transform scale-105"
                : "hover:scale-105"
            }`}
            style={{
              backgroundColor: isActive ? "var(--accent)" : "var(--surface)",
              color: isActive ? "white" : "var(--foreground)",
            }}
            role="tab"
            aria-selected={isActive}
            aria-label={`${category.name} category${category.id !== "all" ? ` (${resourceCounts[category.id] || 0} resources)` : ''}`}
            tabIndex={isActive ? 0 : -1}
          >
            <span className={isActive ? "text-white" : ""}>{renderIcon()}</span>
            <span>{category.name}</span>
            {category.id !== "all" && (
              <span className="text-xs opacity-75" aria-label={`${resourceCounts[category.id] || 0} resources`}>
                ({resourceCounts[category.id] || 0})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Memoize component to prevent re-renders when parent updates
export default memo(CategoryFilter, (prevProps, nextProps) => {
  return (
    prevProps.activeCategory === nextProps.activeCategory &&
    prevProps.resourceCounts === nextProps.resourceCounts
  );
});
