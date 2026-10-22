import { Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";
import { Heart, ShoppingCart, Star, Check, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ProductCard({ p }: { p: Product }) {
  const { lang, t, price, add, wishlist, toggleWishlist } = useStore();
  const isFav = wishlist.includes(p.id);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = p.oldPrice && p.oldPrice > p.price
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;

  const isEgyptianProduct =
    p.seller.includes("Cairo") ||
    p.seller.includes("Nile") ||
    p.name.ar.includes("قطن") ||
    p.name.ar.includes("مصري") ||
    p.sellerId?.includes("cairo") ||
    p.sellerId?.includes("nile");

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(p.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-shadow duration-300 hover:border-gold/50 hover:shadow-lg"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-2.5 start-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-lg bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white shadow-xs"
          >
            -{discountPercent}%
          </motion.span>
        )}
        {isEgyptianProduct && (
          <span className="rounded-lg bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            🇪🇬 صُنع في مصر
          </span>
        )}
      </div>

      {/* Wishlist toggle button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.75 }}
        whileHover={{ scale: 1.1 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(p.id);
        }}
        className="absolute top-2.5 end-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-xs shadow-xs transition cursor-pointer"
        title={isFav ? t.inWishlist : t.addToWishlist}
      >
        <Heart
          className={`h-4 w-4 transition ${
            isFav ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
          }`}
        />
      </motion.button>

      {/* Image Container with HD zoom on hover */}
      <Link to="/product/$id" params={{ id: p.id }} className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={p.image}
          alt={p.name[lang] || p.name.ar}
          loading="lazy"
          width={816}
          height={816}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
      </Link>

      {/* Content & Pricing */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        {/* Category & Seller */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground gap-1">
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground">
            {p.category[lang] || p.category.ar}
          </span>
          <Link
            to="/store/$id"
            params={{ id: p.sellerId || "seller_techhub" }}
            className="hover:text-gold transition truncate max-w-[120px] font-semibold text-foreground/80"
            title={p.seller}
          >
            {p.seller}
          </Link>
        </div>

        {/* Title */}
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="font-display line-clamp-2 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition leading-snug"
        >
          {p.name[lang] || p.name.ar}
        </Link>

        {/* Rating and Express Tag */}
        <div className="flex items-center justify-between text-xs mt-0.5">
          <div className="flex items-center gap-1 font-bold text-gold">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span>{p.rating}</span>
            <span className="text-[10px] text-muted-foreground font-normal">({p.reviews})</span>
          </div>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
            {lang === "ar" ? "توصيل سريع" : "Express"}
          </span>
        </div>

        {/* Price & Installments */}
        <div className="mt-auto pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-foreground">
              {price(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {price(p.oldPrice)}
              </span>
            )}
          </div>

          <div className="text-[10px] text-muted-foreground mt-0.5">
            {lang === "ar"
              ? `أو 4 دفعات بقيمة ${price(Math.round(p.price / 4))}`
              : `or 4 payments of ${price(Math.round(p.price / 4))}`}
          </div>
        </div>

        {/* Quick Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className={`mt-2.5 w-full rounded-xl py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
            justAdded
              ? "bg-emerald-600 text-white"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{lang === "ar" ? "تمت الإضافة ✓" : "Added ✓"}</span>
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>{t.add}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
