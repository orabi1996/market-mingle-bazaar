import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import {
  Store,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Package,
  MessageSquare,
  Share2,
  Heart,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Truck,
  RotateCcw,
  Shield,
  CheckCircle2,
  X,
  Send,
  Building2,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/store/$id")({
  component: StoreView,
});

function StoreView() {
  const { id } = Route.useParams();
  const { stores, products, lang, price, addNotification } = useStore();

  // Find store by ID or name
  const store =
    stores.find(
      (s) =>
        s.id.toLowerCase() === id.toLowerCase() ||
        s.name.toLowerCase() === id.toLowerCase() ||
        s.name.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase()
    ) || stores[0];

  // Store products
  const storeProducts = products.filter(
    (p) =>
      p.sellerId?.toLowerCase() === store.id.toLowerCase() ||
      p.seller.toLowerCase() === store.name.toLowerCase()
  );

  // Filter & Sort State
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "priceAsc" | "priceDesc" | "rating">("featured");

  // Follow Store State
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`bax-follow-${store.id}`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    localStorage.setItem(`bax-follow-${store.id}`, JSON.stringify(next));
  };

  // Share Toast
  const [showShareToast, setShowShareToast] = useState(false);
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  // Message Vendor Modal
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgContact, setMsgContact] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;

    addNotification({
      title: {
        ar: `رسالة جديدة إلى ${store.name}`,
        en: `Inquiry sent to ${store.name}`,
      },
      message: {
        ar: `تم إرسال استفسارك بخصوص "${msgSubject || "استفسار عن المنتجات"}" بنجاح، وسيتواصل معك التاجر خلال ساعتين.`,
        en: `Your message to ${store.name} was sent successfully. The seller will reply shortly.`,
      },
      type: "seller",
      link: `/store/${store.id}`,
    });

    setMsgSentSuccess(true);
    setTimeout(() => {
      setMsgSentSuccess(false);
      setIsMsgModalOpen(false);
      setMsgSubject("");
      setMsgBody("");
    }, 2000);
  };

  // Unique categories within this store
  const storeCategories = Array.from(new Set(storeProducts.map((p) => p.category[lang])));

  // Filtering products
  let filtered = storeProducts.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.ar.toLowerCase().includes(search.toLowerCase()) ||
      p.name.en.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.ar.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.en.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCat === "all" || p.category[lang] === selectedCat;

    return matchesSearch && matchesCat;
  });

  // Sorting
  if (sortBy === "priceAsc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceDesc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  // Get Store Initials
  const initials = store.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen pb-16">
      {/* Toast */}
      {showShareToast && (
        <div className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{lang === "ar" ? "تم نسخ رابط المتجر إلى الحافظة!" : "Store URL copied to clipboard!"}</span>
        </div>
      )}

      {/* Store Hero Banner */}
      <div className="relative border-b border-border bg-gradient-to-r from-primary via-slate-900 to-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-white/70">
            <Link to="/" className="hover:text-gold">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
            <span>/</span>
            <span className="text-white/50">{lang === "ar" ? "المتاجر المعتمدة" : "Partner Stores"}</span>
            <span>/</span>
            <span className="text-white font-medium">{store.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Store Avatar & Identity */}
            <div className="flex items-start md:items-center gap-4">
              <div className="relative flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-amber-500 font-display text-2xl md:text-3xl font-black text-slate-950 shadow-lg ring-4 ring-white/10">
                {initials}
                {store.isVerified && (
                  <span className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-slate-950" title="Verified Store">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{store.name}</h1>
                  {store.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/40">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {lang === "ar" ? "متجر معتمد وموثق 🛡️" : "Verified Partner"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      {lang === "ar" ? "قيد التدقيق" : "Under Review"}
                    </span>
                  )}
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/80">
                    {store.category}
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-xs md:text-sm text-white/80 leading-relaxed">
                  {store.bio ? store.bio[lang] : (lang === "ar" ? "أحد شركاء سوقلي المعتمدين في الخليج العربي." : "Verified Gulf marketplace partner.")}
                </p>

                {/* Badges / Location */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/70">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <span>{store.city || "الرياض"}، {store.country || "المملكة العربية السعودية"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gold" />
                    <span>{lang === "ar" ? "عضو منذ" : "Member since"} {store.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-gold">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span>{store.rating || 4.9}</span>
                    <span className="text-white/60 font-normal">({lang === "ar" ? "تقييم المشترين" : "Customer score"})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsMsgModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:opacity-90 transition cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{lang === "ar" ? "مراسلة المتجر" : "Message Store"}</span>
              </button>

              <button
                onClick={toggleFollow}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer border ${
                  isFollowing
                    ? "bg-red-500/20 border-red-500/40 text-red-300"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart className={`h-4 w-4 ${isFollowing ? "fill-red-400 text-red-400" : ""}`} />
                <span>{isFollowing ? (lang === "ar" ? "مُتابع ✓" : "Following") : (lang === "ar" ? "متابعة المتجر" : "Follow Store")}</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 p-2.5 text-white hover:bg-white/20 transition cursor-pointer"
                title="مشاركة المتجر"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[11px] text-white/60">{lang === "ar" ? "المنتجات المتاحة" : "Available Products"}</span>
              <p className="text-lg font-bold text-white mt-0.5">{storeProducts.length}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[11px] text-white/60">{lang === "ar" ? "إجمالي الطلبات والمبيعات" : "Total Volume"}</span>
              <p className="text-lg font-bold text-gold mt-0.5">{price(store.totalSales)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[11px] text-white/60">{lang === "ar" ? "نسبة الالتزام بالشحن" : "Shipping On-Time"}</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">99.4%</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[11px] text-white/60">{lang === "ar" ? "ضمان سوقلي للتجارة" : "Buyer Guarantee"}</span>
              <p className="text-lg font-bold text-white mt-0.5">{lang === "ar" ? "حماية كاملة 🛡️" : "Full Escrow"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Guarantees Strip */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-around gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{lang === "ar" ? "شحن خليجي سريع 24-48 ساعة" : "Express 24-48h Delivery"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" />
            <span className="font-semibold text-foreground">{lang === "ar" ? "منتجات أصلية 100% ومضمونة" : "100% Genuine Guaranteed"}</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-foreground">{lang === "ar" ? "إرجاع واستبدال مجاني خلال 14 يوماً" : "14-Day Free Returns"}</span>
          </div>
        </div>
      </div>

      {/* Catalog Search & Filter Controls */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-gold" />
              <span>{lang === "ar" ? "منتجات وعروض المتجر" : "Store Catalog"}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar"
                ? `عرض ${filtered.length} منتج مسجل لدى ${store.name}`
                : `Showing ${filtered.length} products from ${store.name}`}
            </p>
          </div>

          {/* Search bar inside store */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? `بحث داخل منتجات ${store.name}...` : `Search ${store.name} products...`}
              className="w-full rounded-xl border border-input bg-card ps-9 pe-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute end-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: Category pills and sort */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCat("all")}
              className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
                selectedCat === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {lang === "ar" ? "الكل" : "All"} ({storeProducts.length})
            </button>
            {storeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
                  selectedCat === cat
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 ms-auto">
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{lang === "ar" ? "الترتيب:" : "Sort:"}</span>
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

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
            <Store className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-base font-bold text-foreground">
              {lang === "ar" ? "لم نجد منتجات مطابقة في هذا المتجر" : "No products matched your search"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "جرب البحث بكلمة مختلفة أو مسح تصنيف التصفية." : "Try adjusting your search terms or clearing filters."}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCat("all");
              }}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              {lang === "ar" ? "عرض جميع منتجات المتجر" : "View All Products"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>

      {/* Message Store Dialog Modal */}
      {isMsgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-gold" />
                <h3 className="font-bold text-base text-foreground">
                  {lang === "ar" ? `مراسلة متجر ${store.name}` : `Message ${store.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsMsgModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {msgSentSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2 animate-bounce" />
                <h4 className="font-bold text-base text-foreground">
                  {lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "ar"
                    ? "سيتلقى مسؤول المتجر إشعاراً فورياً للرد عليك في أقرب وقت."
                    : "The store manager has received your inquiry and will reply shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    {lang === "ar" ? "اسمك الكريم" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: عبدالملك الزهراني" : "Your Name"}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    {lang === "ar" ? "رقم الجوال أو البريد الإلكتروني" : "Phone or Email"}
                  </label>
                  <input
                    type="text"
                    required
                    value={msgContact}
                    onChange={(e) => setMsgContact(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    {lang === "ar" ? "موضوع الاستفسار" : "Subject"}
                  </label>
                  <input
                    type="text"
                    required
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    placeholder={lang === "ar" ? "استفسار عن الشحن / توفر كمية..." : "Inquiry regarding product / shipping..."}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    {lang === "ar" ? "نص الرسالة" : "Your Message"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب تفاصيل استفسارك أو طلبك الخاص هنا..." : "Type your question or request..."}
                    className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMsgModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2 text-xs font-bold text-slate-950 shadow-md hover:opacity-90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{lang === "ar" ? "إرسال الاستفسار للتاجر" : "Send Inquiry"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}