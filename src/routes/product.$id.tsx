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
  Plus,
  Minus,
  MessageSquare,
  ThumbsUp,
  UserCheck,
  Send,
  Heart,
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
  const { lang, t, price, add, products, reviews, addReview, user, wishlist, toggleWishlist } = useStore();
  const isFav = wishlist.includes(initial?.id || "");
  const [qty, setQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(user?.name || "");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewToast, setReviewToast] = useState(false);

  // Fallback to reactive store product if updated
  const p = products.find((x) => x.id === initial?.id) || initial;
  const productReviews = reviews.filter((r) => r.productId === p.id);

  const handleAddToCart = () => {
    add(p.id, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      productId: p.id,
      author: reviewerName.trim() || user?.name || (lang === "ar" ? "عميل معتمد" : "Verified Customer"),
      rating: newRating,
      comment: reviewComment.trim(),
      isVerifiedBuyer: true,
    });

    setReviewComment("");
    setReviewToast(true);
    setTimeout(() => setReviewToast(false), 2500);
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
            <a href="#reviews" className="text-muted-foreground hover:underline">
              ({productReviews.length} {t.reviews})
            </a>
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

            <button
              type="button"
              onClick={() => toggleWishlist(p.id)}
              className={`flex h-12 items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-bold transition ${
                isFav
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-input bg-card text-foreground hover:bg-muted"
              }`}
              title={isFav ? t.inWishlist : t.addToWishlist}
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              <span className="hidden sm:inline">{isFav ? t.inWishlist : t.addToWishlist}</span>
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

      {/* Customer Reviews & Ratings Section (Amazon style) */}
      <section id="reviews" className="mt-16 border-t border-border pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-gold" />
              {lang === "ar" ? "تقييمات ومراجعات العملاء" : "Customer Reviews & Ratings"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar"
                ? `متوسط التقييم العام ${p.rating} من 5 بناءً على ${productReviews.length} مراجعة حقيقية`
                : `Average customer rating ${p.rating} out of 5 based on ${productReviews.length} verified reviews`}
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Rating Breakdown & Add Review Form */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-foreground">{p.rating}</span>
                <span className="text-xs text-muted-foreground">{lang === "ar" ? "من 5 نجوم" : "out of 5"}</span>
              </div>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(p.rating)
                        ? "fill-gold text-gold"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? "96% من المتسوقين ينصحون بهذا المنتج لجودته العالية."
                  : "96% of buyers recommend this product."}
              </p>
            </div>

            {/* Add Review Box */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Star className="h-4 w-4 text-gold" />
                {lang === "ar" ? "شارك برأيك وقيم هذا المنتج" : "Write a Customer Review"}
              </h3>

              {reviewToast && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/15 p-2.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {lang === "ar" ? "شكراً لك! تم نشر تقييمك بنجاح." : "Thank you! Review published successfully."}
                </div>
              )}

              <form onSubmit={handleAddReview} className="mt-4 space-y-3">
                {/* Star Rating Picker */}
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    {lang === "ar" ? "تقييمك بالنجوم:" : "Your Rating:"}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newRating
                              ? "fill-gold text-gold"
                              : "text-border hover:text-gold"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ms-2 text-xs font-bold text-foreground">
                      {newRating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    {lang === "ar" ? "اسمك / الاسم المستعار:" : "Your Name:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: عبدالمحسن التميمي" : "e.g. Alex M."}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    {lang === "ar" ? "رأيك وتجربتك مع المنتج:" : "Your Review:"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب تجربتك الصادقة لمساعدة المشترين الآخرين..." : "Write your review..."}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {lang === "ar" ? "نشر التقييم الآن" : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* List of Verified Reviews */}
          <div className="lg:col-span-2 space-y-4">
            {productReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
                {lang === "ar" ? "كن أول من يكتب تقييماً لهذا المنتج الرائع!" : "Be the first to review this product!"}
              </div>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                              <UserCheck className="h-3 w-3" />
                              {lang === "ar" ? "مشترٍ موثق" : "Verified Purchase"}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= rev.rating
                              ? "fill-gold text-gold"
                              : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
