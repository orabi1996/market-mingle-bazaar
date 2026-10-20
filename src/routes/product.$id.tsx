import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProductById, useStore } from "@/lib/store";
import { useState } from "react";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Store,
  Share2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProductById(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name.ar} | باكس BAX` : "باكس BAX" },
      { name: "description", content: loaderData?.desc.ar ?? "منتج على باكس" },
      { property: "og:title", content: loaderData?.name.ar ?? "باكس BAX" },
      { property: "og:description", content: loaderData?.desc.ar ?? "منتج على باكس" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const initial = Route.useLoaderData();
  const { lang, t, price, add, products } = useStore();
  const [qty, setQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Fallback to reactive store product if updated
  const p = products.find((x) => x.id === initial?.id) || initial;

  const handleAddToCart = () => {
    add(p.id, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
        <span>/</span>
        <span>{p.category[lang]}</span>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{p.name[lang]}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Media */}
        <div className="overflow-hidden rounded-3xl bg-card border border-border p-4 shadow-xs">
          <img
            src={p.image}
            alt={p.name[lang]}
            width={816}
            height={816}
            className="aspect-square w-full rounded-2xl object-cover bg-secondary"
          />
        </div>

        {/* Product Details & Purchase Box */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              {p.category[lang]}
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-black text-foreground leading-snug">
              {p.name[lang]}
            </h1>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 font-bold text-gold">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span>{p.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({p.reviews} {t.reviews})
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-emerald-600">
              {t.inStock} ({p.stock ?? 30} {lang === "ar" ? "قطعة متبقية" : "available"})
            </span>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3 rounded-2xl bg-secondary/40 p-4">
            <span className="text-3xl font-black text-foreground">
              {price(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {price(p.oldPrice)}
              </span>
            )}
            {p.oldPrice && (
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                {lang === "ar" ? "وفر" : "Save"} {price(p.oldPrice - p.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>{p.desc[lang]}</p>
          </div>

          {/* Sold by Merchant */}
          <div className="rounded-xl border border-border p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-gold" />
              <span>
                {t.by}: <b className="text-foreground">{p.seller}</b>
              </span>
            </div>
            <span className="font-bold text-emerald-600">{lang === "ar" ? "تاجر موثق 🛡️" : "Verified Seller"}</span>
          </div>

          {/* Quantity and Add to cart */}
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex h-12 w-full sm:w-auto items-center justify-between rounded-xl border border-input bg-card px-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 text-muted-foreground hover:bg-muted rounded"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 font-bold text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-1 text-muted-foreground hover:bg-muted rounded"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex h-12 flex-1 w-full items-center justify-center gap-2 rounded-xl bg-gold font-bold text-gold-foreground shadow-md hover:opacity-90 transition text-sm"
            >
              {t.add}
            </button>
          </div>

          {addedToast && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 p-3 text-xs font-bold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              {t.addedToCart}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              <span>{lang === "ar" ? "شحن خليجي سريع" : "Express Gulf Delivery"}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <span>{lang === "ar" ? "أصلي ومضمون" : "Authentic Guarantee"}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>{lang === "ar" ? "إرجاع سهل خلال 14 يوماً" : "14-Day Free Returns"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
