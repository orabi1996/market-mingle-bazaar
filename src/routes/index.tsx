import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  Store,
  ArrowRight,
  Filter,
  X,
  SlidersHorizontal,
  ArrowDownUp,
  Flame,
  CheckCircle2,
  Star,
  MapPin,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سوقلي | Souqly - سوق التجارة الإلكترونية الشامل في الخليج" },
      { name: "description", content: "تسوق ملايين المنتجات من آلاف التجار المعتمدين في الخليج بتوصيل سريع وضمان ذهبي." },
      { property: "og:title", content: "سوقلي | Souqly Marketplace" },
      { property: "og:description", content: "سوق التجارة الإلكترونية الشامل في الخليج العربي." },
    ],
  }),
  component: Index,
});

function Index() {
  const {
    t,
    lang,
    products,
    stores,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    price,
  } = useStore();

  const [sortBy, setSortBy] = useState<"featured" | "priceAsc" | "priceDesc" | "rating">("featured");
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Filter products by Search Query, Category, Deals & Price
  let filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.ar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      p.category.ar.includes(selectedCategory) ||
      p.category.en.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesDeals = !onlyDeals || (p.oldPrice && p.oldPrice > p.price);
    const matchesPrice = p.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesDeals && matchesPrice;
  });

  // Sorting logic
  if (sortBy === "priceAsc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceDesc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || onlyDeals || maxPrice < 2000 || sortBy !== "featured";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOnlyDeals(false);
    setMaxPrice(2000);
    setSortBy("featured");
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-sand">
        <img
          src={hero}
          alt="Souqly Gulf Shopping"
          width={1600}
          height={800}
          className="absolute inset-0 h-full w-full object-cover ltr:scale-x-[-1] opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-transparent"></div>
        <div className="relative mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4 py-16 md:py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/25 px-3 py-1 text-xs font-bold text-foreground mb-4">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>{t.brandTag}</span>
            </div>
            <h1 className="text-3xl font-black leading-tight md:text-5xl text-foreground">
              {t.heroTitle}
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {t.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/deals"
                className="rounded-xl bg-gold px-6 py-3 text-sm font-black text-gold-foreground shadow-md transition hover:opacity-90 flex items-center gap-1.5"
              >
                <Flame className="h-4 w-4 fill-gold-foreground" />
                <span>{lang === "ar" ? "عروض اليوم والصفقات الكبرى 🔥" : "Today's Flash Deals 🔥"}</span>
              </Link>
              <Link
                to="/sell"
                className="rounded-xl border border-input bg-card/90 backdrop-blur-xs px-6 py-3 text-sm font-bold text-foreground shadow-xs transition hover:bg-muted"
              >
                {t.sellCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Badges Bar */}
      <section className="border-y border-border bg-card py-6">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{t.features.fastDelivery}</h4>
                <p className="text-[11px] text-muted-foreground">{t.features.fastDeliveryDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{t.features.genuine}</h4>
                <p className="text-[11px] text-muted-foreground">{t.features.genuineDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{t.features.securePay}</h4>
                <p className="text-[11px] text-muted-foreground">{t.features.securePayDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">{t.features.support}</h4>
                <p className="text-[11px] text-muted-foreground">{t.features.supportDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals Spotlight on Home */}
      <section className="bg-sand/30 border-b border-border py-8">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <Flame className="h-5 w-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-foreground">
                    {lang === "ar" ? "عروض اليوم والصفقات الخاطفة" : "Today's Flash Deals"}
                  </h3>
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                    خصم حتى 50%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar"
                    ? "أفضل الصفقات اليومية المحدثة في مصر والخليج العربي مع شحن سريع مجاني."
                    : "Top deals updated daily with free express shipping."}
                </p>
              </div>
            </div>

            <Link
              to="/deals"
              className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted hover:border-gold/50 transition w-fit"
            >
              <span>{lang === "ar" ? "تصفح جميع العروض (صفحة الصفقات)" : "View All Deals"}</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products
              .filter((p) => p.oldPrice && p.oldPrice > p.price)
              .slice(0, 4)
              .map((deal) => {
                const discount = deal.oldPrice ? Math.round(((deal.oldPrice - deal.price) / deal.oldPrice) * 100) : 0;
                return (
                  <Link
                    key={deal.id}
                    to="/product/$id"
                    params={{ id: deal.id }}
                    className="group rounded-2xl border border-border bg-card p-3 shadow-2xs hover:shadow-md hover:border-gold/50 transition flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary mb-2.5">
                      <img
                        src={deal.image}
                        alt=""
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 start-2 rounded-md bg-rose-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                        -{discount}%
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{deal.seller}</span>
                    <h4 className="font-bold text-xs text-foreground line-clamp-1 group-hover:text-primary mt-0.5">
                      {deal.name[lang] || deal.name.ar}
                    </h4>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-black text-sm text-primary">{price(deal.price)}</span>
                      {deal.oldPrice && (
                        <span className="text-[11px] text-muted-foreground line-through">{price(deal.oldPrice)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* Main Products Grid with Advanced Filter Bar */}
      <section id="products" className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4 py-12">
        {/* Section Heading & Result Summary */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              {selectedCategory === "all" ? t.deals : `${t.categories}: ${selectedCategory}`}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar"
                ? `عرض ${filteredProducts.length} من أصل ${products.length} منتج متاح`
                : `Showing ${filteredProducts.length} of ${products.length} products`}
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              {lang === "ar" ? "إعادة ضبط التصفية" : "Reset Filters"}
            </button>
          )}
        </div>

        {/* Filter and Sort Toolbar (Amazon style) */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Deals Only Toggle */}
            <button
              onClick={() => setOnlyDeals(!onlyDeals)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                onlyDeals
                  ? "bg-red-500 text-white shadow-xs"
                  : "border border-input bg-background text-foreground hover:bg-muted"
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-amber-300" />
              <span>{lang === "ar" ? "عروض وتخفيضات فقط" : "Deals Only"}</span>
            </button>

            {/* Price Filter Slider Indicator */}
            <div className="hidden sm:flex items-center gap-2 border border-input rounded-lg px-3 py-1 bg-background">
              <span className="text-muted-foreground">{lang === "ar" ? "أقصى سعر:" : "Max Price:"}</span>
              <span className="font-bold text-foreground">{price(maxPrice)}</span>
              <input
                type="range"
                min={300}
                max={2000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 ms-auto">
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{lang === "ar" ? "الترتيب حسب:" : "Sort by:"}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="featured">{lang === "ar" ? "الأكثر تميزاً" : "Featured"}</option>
              <option value="priceAsc">{lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="priceDesc">{lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating">{lang === "ar" ? "الأعلى تقييماً" : "Highest Rated"}</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-lg font-semibold">{lang === "ar" ? "لم نجد نتائج مطابقة لتصفيتك" : "No products matched your filters"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "ar" ? "جرب تخفيف شروط التصفية أو اختر قسماً آخر." : "Try adjusting your price range or keyword search."}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              {lang === "ar" ? "عرض جميع المنتجات" : "View All Products"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Verified Stores Showcase */}
      <section className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Store className="h-5 w-5 text-gold" />
              <span>{lang === "ar" ? "المتاجر المعتمدة في سوقلي" : "Featured Partner Stores"}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar"
                ? "تسوّق مباشرة من كبرى المتاجر الرسمية والتجار المعتمدين في مصر والخليج بضمان كامل"
                : "Shop directly from verified brand boutiques across Egypt & the Gulf"}
            </p>
          </div>

          <Link
            to="/sell"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-gold transition"
          >
            <span>{lang === "ar" ? "انضم كتاجر معتمد" : "Become a Partner"}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {stores.map((s) => {
            const storeProductCount = products.filter(
              (p) => p.sellerId === s.id || p.seller.toLowerCase() === s.name.toLowerCase()
            ).length;
            const initials = s.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Link
                key={s.id}
                to="/store/$id"
                params={{ id: s.id }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-gold/50 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-primary/10 font-bold text-primary text-sm group-hover:scale-105 transition">
                      {initials}
                    </div>
                    {s.isVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        <BadgeCheck className="h-3 w-3" />
                        {lang === "ar" ? "موثق" : "Verified"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground group-hover:text-gold transition line-clamp-1">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {s.category} • {s.city || "الرياض"}
                  </p>

                  <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                    {s.bio ? s.bio[lang] : s.owner}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gold font-bold">
                    <Star className="h-3 w-3 fill-gold" />
                    <span>{s.rating || 4.9}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-primary group-hover:underline">
                    {storeProductCount} {lang === "ar" ? "منتج ↗" : "items ↗"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Seller Invitation Banner (Amazon Marketplace style) */}
      <section className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 px-4 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-linear-to-r from-primary to-primary/95 p-8 text-primary-foreground shadow-lg">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold mb-2">
              <Store className="h-3.5 w-3.5" />
              {t.sell}
            </div>
            <h3 className="text-2xl font-bold md:text-3xl">
              {lang === "ar" ? "هل تمتلك متجراً أو منتجات وتريد بيعها؟" : "Are you a seller or brand owner?"}
            </h3>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              {lang === "ar"
                ? "انضم لآلاف التجار في مصر والخليج وافتح متجرك مجاناً في سوقلي. استفد من شبكة عملائنا الواسعة وأدوات إدارة المنتجات والمخزون."
                : "Join thousands of merchants across Egypt & the Gulf on Souqly. Leverage our expansive customer base and powerful merchant tooling."}
            </p>
          </div>
          <Link
            to="/sell"
            className="whitespace-nowrap rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-gold-foreground shadow hover:opacity-90 transition"
          >
            {t.sellCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
