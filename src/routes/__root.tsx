import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { AppShell } from "@/components/layout/AppShell";

import appCss from "../styles.css?url";

import { reportLovableError } from "../lib/lovable-error-reporting";

import {
  initAnalytics,
  trackEvent,
  trackPageView,
} from "../utils/analytics";


// --------------------------------------------------
// 1. 404 NOT FOUND COMPONENT
// --------------------------------------------------

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">

        <h1 className="text-7xl font-bold text-foreground">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>

      </div>
    </div>
  );
}


// --------------------------------------------------
// 2. ERROR COMPONENT
// --------------------------------------------------

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">

        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">

          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>

        </div>
      </div>
    </div>
  );
}


// --------------------------------------------------
// 3. ROOT ROUTE
// --------------------------------------------------

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({

    head: () => ({
      meta: [
        { charSet: "utf-8" },

        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },

        {
          title: "ProfitPatterns — AI Profit Strategy Consulting",
        },

        {
          name: "description",
          content:
            "ProfitPatterns helps businesses turn AI, automation and data into measurable profit through strategy-first consulting.",
        },

        {
          property: "og:site_name",
          content: "ProfitPatterns",
        },

        {
          property: "og:type",
          content: "website",
        },

        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],

      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },

        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg?v=2",
        },

        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png?v=2",
        },

        {
          rel: "icon",
          href: "/favicon.ico?v=2",
          sizes: "any",
        },

        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png?v=2",
        },

        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },

        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },

        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
        },
      ],
    }),

    shellComponent: RootShell,

    component: RootComponent,

    notFoundComponent: NotFoundComponent,

    errorComponent: ErrorComponent,
  });


// --------------------------------------------------
// 4. ROOT HTML SHELL
// --------------------------------------------------

function RootShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">

      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>

    </html>
  );
}


// --------------------------------------------------
// 5. ROOT COMPONENT + ANALYTICS INTEGRATION
// --------------------------------------------------

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Get the current route path
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // Prevent duplicate initial page-view tracking
  const initialPath = useRef(pathname);


  // ----------------------------------------------
  // Initialize analytics once when app loads
  // ----------------------------------------------

  useEffect(() => {
    initAnalytics();
  }, []);


  // ----------------------------------------------
  // Track page views when route changes
  // ----------------------------------------------

  useEffect(() => {
    // Initial page view is already tracked by initAnalytics()
    if (initialPath.current === pathname) {
      return;
    }

    initialPath.current = pathname;

    trackPageView();

  }, [pathname]);


  // ----------------------------------------------
  // Render existing application
  // ----------------------------------------------

  return (
    <QueryClientProvider client={queryClient}>

      <AppShell>
        <Outlet />
      </AppShell>

    </QueryClientProvider>
  );
}