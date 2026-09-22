import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

import { MegaMenuIcon } from "@/components/layout/MegaMenuIcons";
import { Button } from "@/components/ui/button";
import { type MegaMenuSection, type SubmenuItem } from "@/config/megaMenuData";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface MegaMenuPanelProps {
  section: MegaMenuSection;
  onClose: () => void;
}

export function MegaMenuPanel({ section, onClose }: MegaMenuPanelProps) {
  // Currently active category in the left column
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    section.categories[0]?.id || ""
  );

  // Optional hovered item in middle column to dynamically update the preview
  const [hoveredItem, setHoveredItem] = useState<SubmenuItem | null>(null);

  const activeCategory =
    section.categories.find((c) => c.id === activeCategoryId) || section.categories[0];

  // If user is hovering an item, show that item's preview; otherwise show category preview
  const currentPreview =
    hoveredItem?.preview || activeCategory?.defaultPreview;

  return (
    <div
      role="region"
      aria-label={`${section.label} Mega Menu`}
      className="absolute left-0 right-0 top-full z-50 mt-1 mx-auto max-w-7xl px-5 lg:px-8 pointer-events-auto"
    >
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/10 animate-mega-menu">
        {/* 3-Column Body */}
        <div className="grid grid-cols-12 min-h-[380px]">
          {/* LEFT COLUMN: Visually distinct dark advisory section */}
          <div className="col-span-3 bg-[#1A1A1A] p-6 lg:p-7 text-[#FAFAF8] flex flex-col justify-between border-r border-[#2C2C2C]">
            <div>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B296]">
                {section.leftCategoryLabel}
              </p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#A8A29E]">
                {section.leftDescription}
              </p>

              {/* Category Links List */}
              <div className="mt-6 space-y-1.5" role="tablist">
                {section.categories.map((cat) => {
                  const isSelected = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        setHoveredItem(null);
                      }}
                      onMouseEnter={() => {
                        setActiveCategoryId(cat.id);
                        setHoveredItem(null);
                      }}
                      className={cn(
                        "group w-full flex items-center justify-between rounded px-3 py-2.5 text-left text-[15px] font-medium transition-all duration-150 cursor-pointer",
                        isSelected
                          ? "bg-[#8B7355]/25 border-l-2 border-[#8B7355] text-[#FAFAF8] font-semibold"
                          : "text-[#D4CEBF] hover:bg-[#262626] hover:text-[#FAFAF8]",
                      )}
                    >
                      <span className="truncate">{cat.label}</span>
                      <ChevronRight
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-150",
                          isSelected
                            ? "text-[#C4B296] translate-x-0.5"
                            : "text-[#78716C] group-hover:text-[#D4CEBF]",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Section Root Link */}
            <div className="mt-6 pt-5 border-t border-[#333333]">
              <Link
                to={section.to as "/"}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#C4B296] hover:text-[#EAE5DC] transition-colors"
              >
                View all {section.label.toLowerCase()}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* MIDDLE COLUMN: Submenu items grid */}
          <div className="col-span-5 lg:col-span-6 bg-card p-6 lg:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                <span className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                  {activeCategory ? activeCategory.label : "Featured Practices"}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {section.items.length} items
                </span>
              </div>

              {/* Items List with staggered animation */}
              <div className={cn("grid gap-2", section.items.length > 5 ? "grid-cols-2" : "grid-cols-1")}>
                {section.items.map((item, idx) => {
                  const isItemHovered = hoveredItem?.id === item.id;
                  const isItemActiveCategory = item.categoryRef === activeCategoryId;

                  return (
                    <Link
                      key={item.id}
                      to={item.to as "/"}
                      style={{ animationDelay: `${idx * 35}ms` }}
                      onClick={() => {
                        track("nav_click", { menu: section.label, item: item.title });
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "group flex items-start gap-3.5 rounded p-2.5 transition-all duration-200 cursor-pointer animate-rise",
                        isItemHovered
                          ? "bg-secondary translate-x-1 shadow-xs"
                          : isItemActiveCategory
                            ? "hover:bg-secondary"
                            : "hover:bg-secondary/70 opacity-90 hover:opacity-100",
                      )}
                    >
                      {/* Icon with micro-movement */}
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded border transition-all duration-200",
                          isItemHovered
                            ? "border-primary bg-primary text-white scale-105"
                            : "border-border bg-secondary text-primary group-hover:border-primary/50 group-hover:scale-105",
                        )}
                      >
                        <MegaMenuIcon name={item.iconName} className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "font-display text-[16px] font-semibold tracking-tight text-foreground transition-colors duration-150",
                            isItemHovered && "text-primary",
                          )}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA: Dynamic context & preview card */}
          <div className="col-span-4 lg:col-span-3 bg-[#FBF9F5] border-l border-border p-6 lg:p-7 flex flex-col justify-between">
            {currentPreview ? (
              <div className="animate-rise">
                <span className="inline-block rounded border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Context Brief
                </span>

                <h4 className="mt-3 font-display text-[18px] font-bold tracking-tight text-foreground leading-snug">
                  {currentPreview.title}
                </h4>

                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {currentPreview.description}
                </p>

                {/* Highlights */}
                {currentPreview.highlights && currentPreview.highlights.length > 0 && (
                  <div className="mt-4 border-t border-border/80 pt-3">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Key Highlights:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {currentPreview.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/85">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {/* Right Card CTA */}
            {currentPreview && (
              <div className="mt-6 border-t border-border pt-4">
                <Link
                  to={(currentPreview.ctaTo || section.to) as "/"}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-primary hover:text-foreground transition-colors group"
                >
                  {currentPreview.ctaText || "Explore Details"}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM STRIP: Full-width CTA strip */}
        <div className="border-t border-border bg-[#F5F2EB] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-[15px] font-medium text-foreground text-center sm:text-left">
            {section.bottomCta.text}
          </p>

          <Button
            asChild
            size="sm"
            variant="accent"
            className="hover:-translate-y-0.5 shadow-sm transition-transform text-[14px]"
          >
            <Link
              to={section.bottomCta.to as "/"}
              onClick={() => {
                track("mega_menu_cta_click", { menu: section.label, action: section.bottomCta.actionLabel });
                onClose();
              }}
            >
              {section.bottomCta.actionLabel} →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
