"use client";

import { ChevronDown, Search } from "lucide-react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { getSearchableMultiSelectState } from "./searchable-multi-select.mjs";

export type SearchableMultiSelectItem = {
  id: string;
  label: string;
  description?: string | null;
  badge?: string | null;
  leading?: ReactNode;
};

type Props = {
  label: string;
  summary: string;
  items: SearchableMultiSelectItem[];
  selectedIds: Set<string>;
  disabled?: boolean;
  emptyMessage: string;
  searchPlaceholder: string;
  searchLabel: string;
  onToggle: (id: string) => void;
};

export function SearchableMultiSelect({
  label,
  summary,
  items,
  selectedIds,
  disabled = false,
  emptyMessage,
  searchPlaceholder,
  searchLabel,
  onToggle,
}: Props) {
  const menuGap = 12;
  const viewportMargin = 16;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMovedFocusRef = useRef(false);
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const closeMenu = useCallback((options?: { restoreFocus?: boolean }) => {
    setOpen(false);
    setQuery("");
    setMenuStyle(null);
    hasMovedFocusRef.current = false;

    if (options?.restoreFocus) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }, []);

  const syncMenuPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const measuredMenuHeight = menuRef.current?.offsetHeight ?? 0;
    const menuHeight = measuredMenuHeight > 0 ? measuredMenuHeight : 332;
    const width = Math.min(rect.width, window.innerWidth - viewportMargin * 2);
    const maxLeft = Math.max(viewportMargin, window.innerWidth - viewportMargin - width);
    const left = Math.min(Math.max(rect.left, viewportMargin), maxLeft);
    const spaceBelow = window.innerHeight - rect.bottom - viewportMargin;
    const spaceAbove = rect.top - viewportMargin;
    const shouldFlip =
      menuHeight > spaceBelow && (spaceAbove > menuHeight * 0.5 || spaceAbove > spaceBelow);
    const top = shouldFlip
      ? Math.max(viewportMargin, rect.top - menuHeight - menuGap)
      : Math.max(
          viewportMargin,
          Math.min(rect.bottom + menuGap, window.innerHeight - viewportMargin - menuHeight),
        );

    setMenuStyle({ top, left, width });
  }, [menuGap, viewportMargin]);

  useEffect(() => {
    if (!open) {
      return;
    }

    syncMenuPosition();
    const frameId = requestAnimationFrame(syncMenuPosition);

    window.addEventListener("resize", syncMenuPosition);
    window.addEventListener("scroll", syncMenuPosition, true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", syncMenuPosition);
      window.removeEventListener("scroll", syncMenuPosition, true);
    };
  }, [open, syncMenuPosition]);

  useEffect(() => {
    if (!open || !menuStyle || hasMovedFocusRef.current) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
      hasMovedFocusRef.current = true;
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [menuStyle, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu({ restoreFocus: true });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, open]);

  const { filteredItems, emptyStateMessage } = useMemo<{
    filteredItems: SearchableMultiSelectItem[];
    emptyStateMessage: string;
  }>(
    () => getSearchableMultiSelectState({ items, query, selectedIds, emptyMessage }),
    [emptyMessage, items, query, selectedIds],
  );

  const overlay =
    open && menuStyle
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[200] rounded-3xl border border-white/10 bg-[#0c0c0c] p-3 shadow-2xl shadow-black/50"
            style={{
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
            }}
            role="dialog"
            aria-modal="false"
            aria-label={label}
          >
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <Search size={14} className="text-white/35" />
              <input
                ref={inputRef}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                type="text"
                aria-label={searchLabel}
              />
            </label>

            <div
              className="mt-3 max-h-64 overflow-y-auto pr-1"
              role="listbox"
              id={listboxId}
              aria-label={label}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    return (
                      <button
                        key={item.id}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                        type="button"
                        disabled={disabled}
                        onClick={() => onToggle(item.id)}
                        role="option"
                        aria-selected={false}
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

                        <span className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/45 sm:col-span-2">
                    {emptyStateMessage}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition hover:border-white/20 hover:bg-white/[0.05]"
        type="button"
        disabled={disabled}
        onClick={() => {
          if (open) {
            closeMenu();
            return;
          }

          hasMovedFocusRef.current = false;
          setOpen(true);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={listboxId}
        aria-label={label}
      >
        <span className="min-w-0 flex-1 truncate text-white/70">{summary}</span>
        <ChevronDown
          size={16}
          className={open ? "rotate-180 text-white transition" : "text-white/45 transition"}
        />
      </button>
      {overlay}
    </div>
  );
}
