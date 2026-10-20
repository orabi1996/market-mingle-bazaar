import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
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
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "باكس | BAX - سوق التجارة الإلكترونية الشامل في الخليج" },
      { name: "description", content: "تسوق ملايين المنتجات من آلاف التجار المعتمدين في الخليج بتوصيل سريع وضمان ذهبي." },
      { property: "og:title", content: "باكس | BAX Marketplace" },
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
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  // Filter products by Search Query & Category
  const filteredProducts = products.filter((p) => {
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

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-sand">
        <img
          src={hero}
          alt="BAX Gulf Shopping"
          width={1600}
          height={800}
          className="absolute inset-0 h-full w-full object-cover ltr:scale-x-[-1] opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-28">
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
              <a
                href="#products"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90"
              >
                {t.shop}
              </a>
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
        <div className="mx-auto max-w-7xl px-4">
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

      {/* Main Products Grid */}
      <section id="products" className="mx-auto max-w-7xl px-4 py-12">
        {/* Filter bar info */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              {selectedCategory === "all" ? t.deals : `${t.categories}: ${selectedCategory}`}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar"
                ? `عرض ${filteredProducts.length} منتج متاح للتوصيل الفوري`
                : `Showing ${filteredProducts.length} items ready for instant delivery`}
            </p>
          </div>

          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              {lang === "ar" ? "مسح التصفية والبحث" : "Clear Filters"}
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-lg font-semibold">{lang === "ar" ? "لم نجد نتائج مطابقة لبحثك" : "No products matched your search"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "ar" ? "جرب البحث بكلمات أخرى أو اختر قسماً آخر." : "Try different keywords or explore other categories."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              {lang === "ar" ? "عرض جميع المنتجات" : "View All Products"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* Seller Invitation Banner (Amazon Marketplace style) */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
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
                ? "انضم لآلاف التجار في الخليج وافتح متجرك مجاناً في باكس. استفد من شبكة عملائنا الواسعة وأدوات إدارة المنتجات والمخزون."
                : "Join thousands of Gulf merchants on BAX. Leverage our expansive customer base and powerful merchant tooling."}
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
