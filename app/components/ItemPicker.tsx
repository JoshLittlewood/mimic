"use client";

import React, { useEffect, useState } from "react";
import { RequestItem, RequestCategory } from "../types";
import { fetchAvailableItems } from "../lib/api";

interface ItemPickerProps {
  onAddItem: (item: RequestItem) => void;
}

const categoryConfig: Record<
  RequestCategory,
  { label: string; icon: React.ReactNode }
> = {
  ui: {
    label: "UI Actions",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  api: {
    label: "API Actions",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  payment: {
    label: "Payment Actions",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
};

export function ItemPicker({ onAddItem }: ItemPickerProps) {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<RequestCategory>
  >(new Set(["ui", "api", "payment"]));

  useEffect(() => {
    fetchAvailableItems()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (category: RequestCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const groupedItems = items.reduce<Record<RequestCategory, RequestItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    { ui: [], api: [], payment: [] }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#00539F] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#EE1C2E]/10 text-[#EE1C2E] rounded-lg border border-[#EE1C2E]/20">
        {error}
      </div>
    );
  }

  const categories: RequestCategory[] = ["ui", "api", "payment"];

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const config = categoryConfig[category];
        const categoryItems = groupedItems[category];
        const isExpanded = expandedCategories.has(category);

        return (
          <div
            key={category}
            className="border border-[#2a2a3a] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 bg-[#1a1a24] hover:bg-[#22222e] transition-colors"
            >
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#00539F]">{config.icon}</span>
                <span className="font-medium">{config.label}</span>
                <span className="text-xs text-gray-500 bg-[#2a2a3a] px-2 py-0.5 rounded">
                  {categoryItems.length}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isExpanded && categoryItems.length > 0 && (
              <div className="border-t border-[#2a2a3a]">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 hover:bg-[#1a1a24] transition-colors border-b border-[#2a2a3a] last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">
                          {item.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-mono ${
                            item.request.method === "GET"
                              ? "bg-[#00539F]/20 text-[#4d9fff]"
                              : "bg-[#EE1C2E]/20 text-[#ff6b6b]"
                          }`}
                        >
                          {item.request.method}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-400 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onAddItem(item)}
                      className="ml-2 p-2 text-[#00539F] hover:bg-[#00539F]/10 rounded-lg transition-colors"
                      aria-label={`Add ${item.name}`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
