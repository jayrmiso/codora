"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchableMultiSelectItem = {
  id: string;
  label: string;
  description?: string | null;
  badge?: string | null;
  leading?: ReactNode;
};

type Props = {
  summary: string;
  items: SearchableMultiSelectItem[];
  selectedIds: Set<string>;
  disabled?: boolean;
  emptyMessage: string;
  searchPlaceholder: string;
  onToggle: (id: string) => void;
};

export function SearchableMultiSelect({
  summary,
  items,
  selectedIds,
  disabled = false,
  emptyMessage,
  searchPlaceholder,
  onToggle,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeMenu() {
      setOpen(false);
      setQuery("");
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.current && !rootRef.current.contains(target)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [
        item.label,
        item.description ?? "",
        item.badge ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [items, query]);

  return (
    <div ref={rootRef} className="relative">
      <button
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition hover:border-white/20 hover:bg-white/[0.05]"
        type="button"
        disabled={disabled}
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);

          if (!nextOpen) {
            setQuery("");
          }
        }}
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1 truncate text-white/70">{summary}</span>
        <ChevronDown
          size={16}
          className={open ? "rotate-180 text-white transition" : "text-white/45 transition"}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 rounded-3xl border border-white/10 bg-[#0c0c0c] p-3 shadow-2xl shadow-black/50">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <Search size={14} className="text-white/35" />
            <input
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              type="text"
            />
          </label>

          <div className="mt-3 max-h-64 overflow-y-auto pr-1">
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const active = selectedIds.has(item.id);

                  return (
                    <button
                      key={item.id}
                      className={[
                        "flex items-start gap-3 rounded-2xl border px-3 py-3 text-left transition",
                        active
                          ? "border-white/30 bg-white/[0.08]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                      ].join(" ")}
                      type="button"
                      disabled={disabled}
                      onClick={() => onToggle(item.id)}
                    >
                      <span className="mt-0.5 shrink-0">{item.leading}</span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium text-white">
                            {item.label}
                          </span>
                          {item.badge ? (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                              {item.badge}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/45">
                          {item.description ?? "Select this item."}
                        </span>
                      </span>

                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15">
                        {active ? <Check size={12} className="text-white" /> : null}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/45 sm:col-span-2">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
