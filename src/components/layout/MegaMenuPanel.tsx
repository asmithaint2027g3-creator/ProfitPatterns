import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

import { MegaMenuIcon } from "@/components/layout/MegaMenuIcons";
import { Button } from "@/components/ui/button";
import { type MegaMenuSection, type SubmenuItem } from "@/config/megaMenuData";
import { whoWeServeSegments } from "@/content/whoWeServe";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface MegaMenuPanelProps {
  section: MegaMenuSection;
  onClose: () => void;
}

export function MegaMenuPanel({ section, onClose }: MegaMenuPanelProps) {
  // If Who We Serve, render the specialized 2-panel executive layout requested in specification
  if (section.menuKey === "who-we-serve") {
    return (
      <div
        role="region"
        aria-label="Who We Serve Mega Menu"
        className="absolute left-0 right-0 top-full z-50 mt-1 mx-auto max-w-7xl px-5 lg:px-8 pointer-events-auto"
      >
        <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/10 animate-mega-menu">
          <div className="grid grid-cols-12">
            {/* Left Panel — Clean Title & Direct Link */}
            <div className="col-span-3 bg-[#1A1A1A] p-6 lg:p-7 text-[#FAFAF8] flex flex-col justify-between border-r border-[#2C2C2C]">
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B296]">
                  STRATEGIC SEGMENTS
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                  Who We Serve
                </h3>
                <p className="mt-1.5 text-xs text-[#A8A29E] font-medium">
                  Executive Profiles & Governance
                </p>
              </div>

              <div className="pt-4 border-t border-[#333333]">
                <Link
                  to="/who-we-serve"
                  onClick={() => {
                    track("nav_click", { menu: "Who We Serve", item: "View All Segments" });
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C4B296] hover:text-[#EAE5DC] transition-colors"
                >
                  All Segments
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Panel — 4 Strategic Segments: Title & Subtitle only */}
            <div className="col-span-9 bg-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-4">
                  <span className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                    Ideal Customer Profiles
                  </span>
                  <span className="text-[12px] text-muted-foreground font-medium">
                    4 Profiles
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {whoWeServeSegments.map((segment) => (
                    <a
                      key={segment.id}
                      href={`/who-we-serve#${segment.anchor}`}
                      onClick={() => {
                        track("nav_click", { menu: "Who We Serve", item: segment.title });
                        onClose();
                      }}
                      className="group flex items-center justify-between rounded-lg border border-border bg-[#FBF9F5]/70 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-xs cursor-pointer"
                    >
                      <div className="min-w-0 pr-3">
                        <h4 className="font-display text-[15px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {segment.title}
                        </h4>
                        <p className="mt-0.5 font-display text-[11px] font-medium uppercase tracking-wider text-primary/80">
                          {segment.positioning}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Governance & Decision Frameworks</span>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="font-semibold text-primary hover:underline"
                >
                  Schedule Strategic Diagnostic →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
        {/* 2-Column Body: Clean Navigation with Titles & Subtitles Only */}
        <div className="grid grid-cols-12 min-h-[300px]">
          {/* LEFT COLUMN: Visually distinct dark category selector */}
          <div className="col-span-3 bg-[#1A1A1A] p-6 text-[#FAFAF8] flex flex-col justify-between border-r border-[#2C2C2C]">
            <div>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C4B296]">
                {section.leftCategoryLabel}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-white">
                {section.label}
              </h3>

              {/* Category Links List */}
              <div className="mt-5 space-y-1" role="tablist">
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
                        "group w-full flex items-center justify-between rounded px-3 py-2 text-left text-[14px] font-medium transition-all duration-150 cursor-pointer",
                        isSelected
                          ? "bg-[#8B7355]/25 border-l-2 border-[#8B7355] text-[#FAFAF8] font-semibold"
                          : "text-[#D4CEBF] hover:bg-[#262626] hover:text-[#FAFAF8]",
                      )}
                    >
                      <span className="truncate">{cat.label}</span>
                      <ChevronRight
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-150",
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
            <div className="mt-5 pt-4 border-t border-[#333333]">
              <Link
                to={section.to as "/"}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C4B296] hover:text-[#EAE5DC] transition-colors"
              >
                View all {section.label.toLowerCase()}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Submenu items grid (Title & Subtitle Only) */}
          <div className="col-span-9 bg-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-4">
                <span className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                  {activeCategory ? activeCategory.label : section.label}
                </span>
                <span className="text-[12px] text-muted-foreground font-medium">
                  {section.items.length} items
                </span>
              </div>

              {/* Items List with Title and Subtitle Only */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {section.items.map((item, idx) => {
                  const isItemHovered = hoveredItem?.id === item.id;
                  const isItemActiveCategory = item.categoryRef === activeCategoryId;

                  return (
                    <Link
                      key={item.id}
                      to={item.to as "/"}
                      style={{ animationDelay: `${idx * 25}ms` }}
                      onClick={() => {
                        track("nav_click", { menu: section.label, item: item.title });
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-all duration-200 cursor-pointer animate-rise",
                        isItemHovered
                          ? "border-primary bg-secondary shadow-xs translate-x-0.5"
                          : isItemActiveCategory
                            ? "border-primary/40 bg-card hover:bg-secondary"
                            : "bg-[#FBF9F5]/70 hover:bg-secondary hover:border-primary/40",
                      )}
                    >
                      {/* Icon */}
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                          isItemHovered
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-card text-primary group-hover:border-primary/50",
                        )}
                      >
                        <MegaMenuIcon name={item.iconName} className="size-4" />
                      </span>

                      {/* Title & Subtitle Only */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "font-display text-[14px] font-semibold tracking-tight text-foreground transition-colors duration-150 truncate",
                            isItemHovered && "text-primary",
                          )}
                        >
                          {item.title}
                        </p>
                        <p className="font-display text-[11px] font-medium uppercase tracking-wider text-muted-foreground group-hover:text-primary/70 transition-colors">
                          {item.categoryRef ? item.categoryRef.replace(/-/g, " ") : "Practice"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info & Quick Action */}
            <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Direct practice access</span>
              <Link
                to={section.to as "/"}
                onClick={onClose}
                className="font-semibold text-primary hover:underline"
              >
                Browse all {section.label} →
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP: Full-width CTA strip */}
        <div className="border-t border-border bg-[#F5F2EB] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-[14px] font-medium text-foreground text-center sm:text-left">
            {section.bottomCta.text}
          </p>

          <Button
            asChild
            size="sm"
            variant="accent"
            className="hover:-translate-y-0.5 shadow-sm transition-transform text-[13px]"
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
