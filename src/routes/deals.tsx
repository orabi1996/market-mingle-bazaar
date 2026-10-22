import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Flame,
  Clock,
  Tag,
  CheckCircle2,
  ShoppingCart,
  Percent,
  ShieldCheck,
  Star,
  Copy,
  Check,
  ArrowRight,
  Truck,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "عروض اليوم والصفقات الخاطفة | Souqly Flash Deals" },
      { name: "description", content: "أقوى خصومات وعروض اليوم في جمهورية مصر العربية ودول الخليج على الإلكترونيات، الأزياء، والعطور." },
      { property: "og:title", content: "صفقات اليوم الكبرى | Souqly Deals" },
      { property: "og:description", content: "خصومات تصل إلى 50% مع شحن مجاني وضمان 14 يوم إرجاع." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const {
    lang,
    t,
    products,
    price,
    add,
    toggleWishlist,
    isInWishlist,
    applyCoupon,
    appliedCoupon,
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<"all" | "egypt" | "gulf" | "bigDiscount">("all");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Live countdown timer state (hours, minutes, seconds until midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 34, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code, 500);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleAddToCart = (product: Product) => {
    add(product.id, 1);
    setAddedToast(product.name[lang] || product.name.ar);
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filter products that have discounts or oldPrice
  const dealsProducts = products.filter((p) => {
    const hasDiscount = p.oldPrice && p.oldPrice > p.price;
    if (!hasDiscount) return false;

    if (activeFilter === "egypt") {
      return (
        p.seller.includes("Cairo") ||
        p.seller.includes("Nile") ||
        p.name.ar.includes("مصري") ||
        p.sellerId?.includes("cairo") ||
        p.sellerId?.includes("nile")
      );
    }
    if (activeFilter === "gulf") {
      return (
        !p.seller.includes("Cairo") &&
        !p.seller.includes("Nile") &&
        !p.name.ar.includes("مصري")
      );
    }
    if (activeFilter === "bigDiscount") {
      const discountPercent = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
      return discountPercent >= 20;
    }
    return true;
  });

  return (
    <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{lang === "ar" ? `تمت إضافة "${addedToast}" إلى سلتك!` : `Added "${addedToast}" to cart!`}</span>
          <Link to="/cart" className="ms-2 underline text-gold">
            {lang === "ar" ? "عرض السلة" : "View Cart"}
          </Link>
        </div>
      )}

      {/* Hero Deals Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-600 via-amber-600 to-primary p-6 md:p-10 text-white shadow-xl mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-bold mb-4">
            <Flame className="h-4 w-4 text-gold fill-gold" />
            <span>{lang === "ar" ? "عروض حصرية لفترة محدودة" : "Limited Time Flash Offers"}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {lang === "ar"
              ? "صفقات اليوم الكبرى في مصر والخليج"
              : "Today's Premier Deals in Egypt & Gulf"}
          </h1>

          <p className="mt-3 text-sm md:text-base text-white/90 leading-relaxed">
            {lang === "ar"
              ? "وفر حتى 50% على أشهر الأجهزة الأصلية، القطن المصري الفاخر، العطور الملكية والمستلزمات العصرية مع شحن مجاني وضمان 14 يوماً."
              : "Save up to 50% on authentic electronics, luxury Egyptian cotton, and perfumes."}
          </p>

          {/* Flash Deal Live Countdown Timer */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
              <Clock className="h-5 w-5 text-gold animate-pulse" />
              <span className="text-xs font-bold text-white/80">
                {lang === "ar" ? "ينتهي العرض الخاطف خلال:" : "Ends in:"}
              </span>
              <div className="flex items-center gap-1 font-mono text-sm font-black text-white">
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-gold">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="rounded-xl bg-gold px-5 py-2.5 text-xs font-black text-gold-foreground shadow hover:opacity-90 transition"
            >
              {lang === "ar" ? "الذهاب إلى سلة الشراء" : "Go to Cart"}
            </Link>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute -bottom-6 -end-6 hidden md:flex h-44 w-44 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-center p-4">
          <div className="font-display font-black text-2xl text-gold leading-tight">
            خصم حتى
            <br />
            <span className="text-4xl text-white">50%</span>
          </div>
        </div>
      </div>

      {/* Promo Coupons Showcase */}
      <div className="mb-10">
        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-gold" />
          <span>{lang === "ar" ? "كوبونات الخصم الإضافية الفعالة اليوم" : "Today's Active Promo Coupons"}</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                <span>MASR10</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px]">خصم 10%</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === "ar" ? "كوبون ترحيبي خاص بمتسوقي مصر" : "10% off for Egypt orders"}
              </p>
            </div>
            <button
              onClick={() => handleCopyCoupon("MASR10")}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              {copiedCoupon === "MASR10" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCoupon === "MASR10" ? "تم التطبيق" : "تطبيق"}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-amber-700 dark:text-amber-400">
                <span>CAIRO50</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px]">خصم 50 ر.س / 650 ج.م</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === "ar" ? "للطلبات فوق 250 ر.س أو ما يعادلها" : "On orders above 250"}
              </p>
            </div>
            <button
              onClick={() => handleCopyCoupon("CAIRO50")}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 flex items-center gap-1 cursor-pointer"
            >
              {copiedCoupon === "CAIRO50" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCoupon === "CAIRO50" ? "تم التطبيق" : "تطبيق"}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-primary">
                <span>SOUQLY10</span>
                <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px]">خصم 10%</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === "ar" ? "على كافة الإلكترونيات والمنزل" : "All electronics & home"}
              </p>
            </div>
            <button
              onClick={() => handleCopyCoupon("SOUQLY10")}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 flex items-center gap-1 cursor-pointer"
            >
              {copiedCoupon === "SOUQLY10" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCoupon === "SOUQLY10" ? "تم التطبيق" : "تطبيق"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "جميع العروض والصفقات" : "All Deals"}
        </button>

        <button
          onClick={() => setActiveFilter("egypt")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeFilter === "egypt"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "عروض السوق المصري الكبرى 🇪🇬" : "Egypt Deals 🇪🇬"}
        </button>

        <button
          onClick={() => setActiveFilter("gulf")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeFilter === "gulf"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "عروض الخليج المميزة 🇸🇦 🇦🇪" : "Gulf Deals 🇸🇦 🇦🇪"}
        </button>

        <button
          onClick={() => setActiveFilter("bigDiscount")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeFilter === "bigDiscount"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "خصومات 20% فأكثر" : "20%+ Discounts"}
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {dealsProducts.map((p) => {
          const discountPercent = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
          const claimedPercent = Math.min(92, 55 + (Number(p.id) * 7) % 35);
          const inWish = isInWishlist(p.id);

          return (
            <div
              key={p.id}
              className="group flex flex-col rounded-2xl border border-border bg-card shadow-xs transition hover:shadow-md hover:border-gold/50 overflow-hidden relative"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 start-3 z-10 flex flex-col gap-1">
                <span className="rounded-lg bg-rose-600 px-2 py-0.5 text-xs font-black text-white shadow-xs">
                  خصم {discountPercent}%
                </span>
                {p.seller.includes("Cairo") || p.seller.includes("Nile") || p.name.ar.includes("مصري") ? (
                  <span className="rounded-md bg-foreground/80 px-1.5 py-0.5 text-[10px] font-bold text-background backdrop-blur-xs">
                    مصر 🇪🇬
                  </span>
                ) : null}
              </div>

              {/* Wishlist toggle button */}
              <button
                type="button"
                onClick={() => toggleWishlist(p.id)}
                className={`absolute top-3 end-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition cursor-pointer ${
                  inWish
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-background/80 text-foreground hover:bg-background"
                }`}
              >
                <Heart className={`h-4 w-4 ${inWish ? "fill-white" : ""}`} />
              </button>

              {/* Image & Link */}
              <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.name[lang] || p.name.ar}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] text-muted-foreground">{p.category[lang] || p.category.ar}</span>
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="mt-1 font-bold text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                >
                  {p.name[lang] || p.name.ar}
                </Link>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span className="ms-1 font-bold text-foreground">{p.rating}</span>
                  </div>
                  <span>•</span>
                  <span>({p.reviews} {t.reviews})</span>
                </div>

                {/* Pricing */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-black text-primary font-display">{price(p.price)}</span>
                  {p.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">{price(p.oldPrice)}</span>
                  )}
                </div>

                {/* Deal Progress Claim Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{lang === "ar" ? `تم حجز ${claimedPercent}% من المعروض` : `${claimedPercent}% claimed`}</span>
                    <span className="text-rose-600 font-bold">{lang === "ar" ? "ينتهي قريباً" : "Almost gone"}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-rose-600 rounded-full"
                      style={{ width: `${claimedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Add To Cart Button */}
                <div className="mt-4 pt-3 border-t border-border mt-auto">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="w-full rounded-xl bg-gold py-2 text-xs font-black text-gold-foreground shadow-xs hover:opacity-90 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{t.add}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Guarantee Section */}
      <div className="mt-16 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-3 text-center md:text-start">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{lang === "ar" ? "ضمان أصالة المنتجات 100%" : "100% Genuine Guarantee"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar" ? "جميع المنتجات المعروضة في الصفقات تخضع لفحص جودة صارم." : "All items pass rigorous inspection."}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{lang === "ar" ? "شحن فوري لباب البيت" : "Express Doorstep Delivery"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar" ? "توصيل خلال 24 - 48 ساعة لكافة محافظات مصر ومدن الخليج." : "24-48h delivery to all governorates & GCC."}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{lang === "ar" ? "إرجاع مجاني خلال 14 يوماً" : "14-Day Free Returns"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar" ? "استرجاع واستبدال مجاني واسترداد فوري إلى محفظتك الإلكترونية." : "Free returns and instant wallet refunds."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
