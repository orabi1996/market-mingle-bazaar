import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "قائمة المفضلة والرغبات | Souqly Wishlist" },
      { name: "description", content: "منتجاتك المفضلة المحفوظة للشراء لاحقاً على سوقلي." },
      { property: "og:title", content: "قائمة المفضلة | Souqly" },
      { property: "og:description", content: "منتجاتك المفضلة المحفوظة للشراء لاحقاً على سوقلي." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { lang, t, products, wishlist, toggleWishlist, add, price } = useStore();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-black flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
            {lang === "ar" ? "قائمة المنتجات المفضلة" : "My Saved Wishlist"} ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "منتجاتك المحفوظة للرجوع إليها وشرائها في أي وقت مع تنبيهات عند نزول الأسعار."
              : "Items you saved to buy later on Souqly."}
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 w-fit"
        >
          <ShoppingBag className="h-4 w-4" />
          {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
        </Link>
      </motion.div>

      {favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card p-14 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="font-display mt-4 text-lg font-bold">{t.emptyWishlist}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {lang === "ar"
              ? "اضغط على أيقونة القلب على أي منتج يعجبك لحفظه هنا والرجوع إليه متى أردت."
              : "Tap the heart icon on any product to save it here for later."}
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-gold px-6 py-2.5 text-xs font-bold text-gold-foreground hover:opacity-90"
          >
            {t.startShopping}
          </Link>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          <AnimatePresence mode="popLayout">
            {favoriteProducts.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.04 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name[lang]}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                      toggleWishlist(p.id);
                      toast(lang === "ar" ? "تمت الإزالة من المفضلة" : "Removed from wishlist");
                    }}
                    className="absolute top-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-red-500 shadow-xs hover:bg-background cursor-pointer"
                    title={lang === "ar" ? "إزالة من المفضلة" : "Remove"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] text-muted-foreground">{p.category[lang]}</span>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="font-display font-bold text-sm text-foreground hover:text-primary line-clamp-2 mt-0.5"
                  >
                    {p.name[lang]}
                  </Link>

                  <div className="mt-auto pt-3 flex items-baseline gap-2">
                    <span className="text-base font-black text-foreground">{price(p.price)}</span>
                    {p.oldPrice && (
                      <span className="text-xs text-muted-foreground line-through">{price(p.oldPrice)}</span>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      add(p.id);
                      toast.success(lang === "ar" ? "تمت إضافة المنتج إلى سلة التسوق!" : "Added to cart!");
                    }}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gold py-2 text-xs font-bold text-gold-foreground shadow-xs hover:opacity-90 transition cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{t.add}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}
