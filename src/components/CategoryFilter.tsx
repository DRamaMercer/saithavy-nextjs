"use client";

import { categories } from "@/lib/resourcesData";
import { useRouter } from "next/navigation";

type Props = {
  resourceCounts: Record<string, number>;
  activeCategory: string;
};

export default function CategoryFilter({ resourceCounts, activeCategory }: Props) {
  const router = useRouter();

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/resources");
    } else {
      router.push(`/resources/category/${categoryId}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const CategoryIcon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              isActive 
                ? "text-white shadow-lg transform scale-105 bg-amber-600" 
                : "hover:scale-105"
            }`}
            style={{ 
              backgroundColor: isActive ? "var(--accent)" : "var(--surface)",
              color: isActive ? "white" : "var(--foreground)"
            }}
          >
            <CategoryIcon className={`w-4 h-4 ${isActive ? "text-white" : category.color}`} />
            {category.name}
            {category.id !== "all" && (
              <span className="text-xs opacity-75">
                ({resourceCounts[category.id] || 0})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
