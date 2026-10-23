import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { LiveChatWidget } from "@/components/LiveChatWidget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة المطلوبة غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حدث خطأ أثناء تحميل الصفحة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          نعتذر عن ذلك، يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "سوقلي | Souqly - سوق مصر والخليج العربي الشامل" },
      { name: "description", content: "منصة سوقلي (Souqly) للتجارة الإلكترونية متعددة التجار في مصر والخليج. منتجات أصلية، دفع عبر إنستاباي وفودافون كاش ومحفظة سوقلي، وشحن فوري وضمان ذهبي." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "سوقلي Souqly" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <MotionConfig reducedMotion="user">
        <Header />
        <Outlet />
        <AuthModal />
        <LiveChatWidget />
        <Toaster position="bottom-left" dir="rtl" richColors closeButton />
        <footer className="mt-20 border-t border-border bg-primary text-primary-foreground py-12">
          <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 grid gap-8 md:grid-cols-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold text-primary font-black text-sm">S</span>
                <span className="font-display text-lg font-black tracking-tight text-white">Souqly<span className="text-gold">.market</span></span>
              </div>
              <p className="text-white/70 leading-relaxed">
                سوق التجارة الإلكترونية الشامل لجمهورية مصر العربية ودول الخليج. يجمع بين كبرى المتاجر والتجار المعتمدين والمشترين في بيئة آمنة وتوصيل فائق السرعة.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">تسوق مع سوقلي</h4>
              <ul className="space-y-2 text-white/75">
                <li><Link to="/" className="hover:text-gold transition">جميع الأقسام والتصنيفات</Link></li>
                <li><Link to="/" className="hover:text-gold transition">عروض وصفقات اليوم</Link></li>
                <li><Link to="/cart" className="hover:text-gold transition">عربة التسوق والطلبات</Link></li>
                <li><Link to="/orders" className="hover:text-gold transition">تتبع الشحنات والطلبات</Link></li>
                <li><Link to="/wishlist" className="hover:text-gold transition">قائمة الأمنيات والمحفوظات</Link></li>
                <li><Link to="/help" className="hover:text-gold transition">مركز المساعدة والدعم الفني</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">خدمات التجار والأعمال</h4>
              <ul className="space-y-2 text-white/75">
                <li><Link to="/sell" className="hover:text-gold transition">مركز بائعي سوقلي (Seller Central)</Link></li>
                <li><Link to="/sell" className="hover:text-gold transition">لوحة تحكم المخزون والمنتجات</Link></li>
                <li><Link to="/admin" className="hover:text-gold transition">بوابة الإدارة المركزية والرقابة</Link></li>
                <li><Link to="/sell" className="hover:text-gold transition">الشحن اللوجستي والتحصيل</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">الضمان وحماية المشتري</h4>
              <p className="text-white/70 leading-relaxed mb-3">
                جميع المنتجات معتمدة وتخضع لفحص الجودة، مع ضمان استرجاع الأموال خلال 14 يوماً ودعم فني على مدار الساعة.
              </p>
              <Link to="/help" className="inline-block mb-3 rounded-lg border border-gold/40 bg-gold/15 px-3 py-1 text-xs text-gold font-bold hover:bg-gold/25 transition">
                مركز الضمان والاسترجاع ↗
              </Link>
              <div className="font-mono text-gold font-bold">Egypt & Gulf Express • 2026</div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-white/60 text-[11px]">
            جميع الحقوق محفوظة © 2026 سوقلي Souqly Marketplace
          </div>
        </footer>
        </MotionConfig>
      </StoreProvider>
    </QueryClientProvider>
  );
}
