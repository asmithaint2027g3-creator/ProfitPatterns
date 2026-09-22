import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { MegaMenuIcon } from "@/components/layout/MegaMenuIcons";
import { MegaMenuPanel } from "@/components/layout/MegaMenuPanel";
import { Button } from "@/components/ui/button";
import { megaMenuData } from "@/config/megaMenuData";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface MenuItemConfig {
  key: string;
  label: string;
  to: string;
  hasMegaMenu: boolean;
}

const navItems: MenuItemConfig[] = [
  { key: "home", label: "Home", to: "/", hasMegaMenu: false },
  { key: "about", label: "About", to: "/about", hasMegaMenu: true },
  { key: "solutions", label: "Solutions", to: "/solutions", hasMegaMenu: true },
  { key: "industries", label: "Industries", to: "/industries", hasMegaMenu: true },
  { key: "icp", label: "ICP", to: "/icp", hasMegaMenu: false },
  { key: "resources", label: "Resources", to: "/resources", hasMegaMenu: true },
  { key: "contact", label: "Contact", to: "/contact", hasMegaMenu: true },
];

export function Header() {
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedKeys, setMobileExpandedKeys] = useState<Record<string, boolean>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll listener for compact sticky transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear pending close timers
  const clearTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Debounced close to allow smooth mouse movement between header link & mega panel
  const handleMouseLeave = () => {
    clearTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveMenuKey(null);
    }, 220);
  };

  const handleMouseEnter = (key: string) => {
    clearTimer();
    const item = navItems.find((n) => n.key === key);
    if (item && item.hasMegaMenu) {
      setActiveMenuKey(key);
    } else {
      setActiveMenuKey(null);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        headerContainerRef.current &&
        !headerContainerRef.current.contains(e.target as Node)
      ) {
        setActiveMenuKey(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setActiveMenuKey(null);
    setMobileOpen(false);
  }, [pathname]);

  // Mobile accordion toggle
  const toggleMobileAccordion = (key: string) => {
    setMobileExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeSection = activeMenuKey ? megaMenuData[activeMenuKey] : null;

  return (
    <header
      ref={headerContainerRef}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300 ease-out",
        isScrolled
          ? "border-border bg-[#FAFAF8]/98 shadow-sm shadow-black/5 backdrop-blur-md"
          : "border-border/70 bg-[#FAFAF8]/90 backdrop-blur-sm",
      )}
    >
      {/* Main Bar with balanced padding, smooth compact height transition */}
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-out",
          isScrolled ? "h-16" : "h-20",
        )}
      >
        {/* Brand Logo with explicit right margin to prevent any collision */}
        <Link
          to="/"
          className="group flex items-center gap-3 shrink-0 mr-6 lg:mr-8 xl:mr-12"
          aria-label="ProfitPatterns Home"
        >
          <span className="grid size-8 place-items-center rounded border border-primary/50 bg-[#1A1A1A] font-display text-xs font-bold text-[#C4B296] tracking-wider transition-transform group-hover:scale-105">
            PP
          </span>
          <span className="font-display text-[22px] font-bold tracking-tight text-foreground whitespace-nowrap">
            Profit<span className="text-primary font-normal">Patterns</span>
          </span>
        </Link>

        {/* Desktop Navigation with distinct button padding and proportional gaps */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-1 xl:gap-2 2xl:gap-3 lg:flex flex-nowrap"
        >
          {navItems.map((item) => {
            const isMenuOpen = activeMenuKey === item.key;
            const isActiveRoute =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

            if (!item.hasMegaMenu) {
              return (
                <Link
                  key={item.key}
                  to={item.to as "/"}
                  onClick={(e) => {
                    if (item.key === "icp" && pathname === "/") {
                      e.preventDefault();
                      document.getElementById("icp")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  onMouseEnter={() => handleMouseEnter(item.key)}
                  className={cn(
                    "group relative inline-flex items-center px-3 py-2 xl:px-3.5 2xl:px-4 rounded font-display text-[17px] xl:text-[18px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap",
                    isActiveRoute
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-[#F2EFE9]",
                  )}
                >
                  <span>{item.label}</span>
                  {/* Subtle animated underline indicator */}
                  <span
                    className={cn(
                      "absolute bottom-1 left-3 right-3 xl:left-3.5 xl:right-3.5 2xl:left-4 2xl:right-4 h-[2px] bg-primary transition-transform duration-200 origin-left",
                      isActiveRoute ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            }

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.key)}
              >
                <button
                  type="button"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  onClick={() =>
                    setActiveMenuKey((prev) => (prev === item.key ? null : item.key))
                  }
                  className={cn(
                    "group relative inline-flex items-center gap-1.5 px-3 py-2 xl:px-3.5 2xl:px-4 rounded font-display text-[17px] xl:text-[18px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap",
                    isActiveRoute || isMenuOpen
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-[#F2EFE9]",
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-250 ease-out",
                      isMenuOpen
                        ? "rotate-180 text-primary"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                    aria-hidden="true"
                  />
                  {/* Subtle animated underline indicator */}
                  <span
                    className={cn(
                      "absolute bottom-1 left-3 right-3 xl:left-3.5 xl:right-3.5 2xl:left-4 2xl:right-4 h-[2px] bg-primary transition-transform duration-200 origin-left",
                      isActiveRoute || isMenuOpen
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </nav>

        {/* Right Action Buttons with matching heights, balanced padding, and clear separation */}
        <div className="hidden items-center gap-3 shrink-0 ml-4 lg:ml-6 xl:ml-8 lg:flex">
          <WhatsAppCTA
            location="header"
            size="md"
            showIcon={false}
            className="h-10 px-4 py-2 text-[14px] font-semibold border-border bg-card text-foreground hover:bg-[#F2EFE9] hover:border-primary/50 transition-all rounded shadow-none whitespace-nowrap"
          />
          <Button
            asChild
            size="md"
            variant="primary"
            className="h-10 px-5 py-2 text-[14px] font-semibold tracking-wide bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D] hover:-translate-y-0.5 transition-all rounded shadow-sm whitespace-nowrap"
          >
            <Link
              to="/contact"
              onClick={() => track("cta_click", { location: "header", cta: "talk_to_an_expert" })}
            >
              Talk to an Expert
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <WhatsAppCTA location="header_mobile" size="sm" showIcon={false} className="hidden sm:inline-flex" />
          <button
            type="button"
            className="rounded border border-border bg-card p-2.5 text-foreground hover:border-primary/50 cursor-pointer transition-colors"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* DESKTOP MEGA MENU DROPDOWN PANEL */}
      {activeSection && (
        <div
          onMouseEnter={clearTimer}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block"
        >
          <MegaMenuPanel
            section={activeSection}
            onClose={() => setActiveMenuKey(null)}
          />
        </div>
      )}

      {/* MOBILE ACCORDION DRAWER */}
      {mobileOpen ? (
        <div className="border-t border-border bg-card shadow-2xl lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav aria-label="Mobile Navigation" className="mx-auto max-w-7xl px-5 py-5">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isExpanded = !!mobileExpandedKeys[item.key];
                const section = megaMenuData[item.key];

                if (!item.hasMegaMenu || !section) {
                  return (
                    <li key={item.key}>
                      <Link
                        to={item.to as "/"}
                        onClick={(e) => {
                          setMobileOpen(false);
                          if (item.key === "icp" && pathname === "/") {
                            e.preventDefault();
                            document.getElementById("icp")?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="block rounded px-4 py-3 font-display text-[19px] font-bold text-foreground transition-colors hover:bg-secondary hover:text-primary"
                        activeProps={{ className: "bg-secondary text-primary font-bold" }}
                        activeOptions={{ exact: item.to === "/" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.key} className="rounded border border-border/60 bg-[#FAFAF8] overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleMobileAccordion(item.key)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left font-display text-[19px] font-bold text-foreground transition-colors hover:text-primary cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-5 text-muted-foreground transition-transform duration-250",
                          isExpanded && "rotate-180 text-primary",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border/80 bg-card px-4 py-3 space-y-2 animate-rise">
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                          {section.leftCategoryLabel}
                        </p>

                        <div className="grid gap-2 pt-1">
                          {section.items.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.to as "/"}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-start gap-3 rounded border border-border/60 bg-secondary/50 p-2.5 transition-colors hover:bg-secondary"
                            >
                              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded border border-border bg-card text-primary">
                                <MegaMenuIcon name={subItem.iconName} className="size-3.5" />
                              </span>
                              <div>
                                <p className="font-display text-[16px] font-semibold text-foreground">
                                  {subItem.title}
                                </p>
                                <p className="text-[13px] text-muted-foreground line-clamp-1">
                                  {subItem.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Direct explore all button */}
                        <div className="pt-2">
                          <Link
                            to={section.to as "/"}
                            onClick={() => setMobileOpen(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                          >
                            Explore all {section.label} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Mobile CTAs */}
            <div className="mt-6 grid gap-2.5 border-t border-border pt-5">
              <Button asChild variant="primary" size="lg" className="w-full text-[16px]">
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  Talk to an Expert
                </Link>
              </Button>
              <WhatsAppCTA
                location="mobile_menu"
                variant="outline"
                size="lg"
                className="w-full text-[15px]"
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
