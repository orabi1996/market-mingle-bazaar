import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Product, type Order } from "@/lib/store";
import { useState } from "react";
import {
  Store,
  PlusCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Trash2,
  Edit3,
  Truck,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Landmark,
  AlertTriangle,
  Upload,
  FileCheck,
} from "lucide-react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "مركز البائعين | Souqly Seller Central" },
      { name: "description", content: "افتح متجرك وأدر مبيعاتك ومنتجاتك وطلباتك على منصة سوقلي." },
      { property: "og:title", content: "مركز بائعي سوقلي | Souqly Seller Central" },
      { property: "og:description", content: "لوحة تحكم البائع وإدارة المنتجات والطلبات على سوقلي." },
    ],
  }),
  component: SellerCenter,
});

const DEFAULT_PRESET_IMAGES = [
  { label: "سماعات / أجهزة", src: p1 },
  { label: "عطور وفاخرات", src: p2 },
  { label: "ساعات ذكية", src: p3 },
  { label: "حقائب وجلديات", src: p4 },
  { label: "مكائن قهوة والمنزل", src: p5 },
  { label: "أحذية ورياضة", src: p6 },
];

function SellerCenter() {
  const {
    lang,
    t,
    user,
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    orders,
    updateOrderStatus,
    price,
    registerSeller,
    switchRole,
    sellerPayouts,
    requestSellerPayout,
    approveReturn,
    submitMerchantKyc,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"inventory" | "newProduct" | "orders" | "returns" | "payouts">("inventory");

  // Payout Form States
  const [payoutAmount, setPayoutAmount] = useState(2500);
  const [payoutMethod, setPayoutMethod] = useState<"instapay" | "vodafone_cash" | "bank_iban">("instapay");
  const [payoutDest, setPayoutDest] = useState("cairo.tech@instapay");
  const [payoutSuccessToast, setPayoutSuccessToast] = useState(false);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutDest.trim()) return;
    requestSellerPayout(Number(payoutAmount), payoutMethod, payoutDest);
    setPayoutSuccessToast(true);
    setTimeout(() => setPayoutSuccessToast(false), 3000);
  };

  // Registration Form States for new sellers
  const [storeNameInput, setStoreNameInput] = useState("");
  const [sellerNameInput, setSellerNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  // New Product Form States
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryAr, setCategoryAr] = useState("إلكترونيات");
  const [categoryEn, setCategoryEn] = useState("Electronics");
  const [productPrice, setProductPrice] = useState(299);
  const [oldPrice, setOldPrice] = useState<number | undefined>(399);
  const [stock, setStock] = useState(50);
  const [selectedImage, setSelectedImage] = useState(p1);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  
  // KYC Modal States
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [crInput, setCrInput] = useState(user?.commercialRegNumber || "");
  const [taxIdInput, setTaxIdInput] = useState(user?.taxIdNumber || "");
  const [nationalIdInput, setNationalIdInput] = useState("28901230104921");
  const [govInput, setGovInput] = useState("القاهرة (التجمع الخامس)");
  const [docFileName, setDocFileName] = useState<string | null>(null);

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crInput || !taxIdInput) return;
    submitMerchantKyc(user?.id || "seller", {
      commercialRegNumber: crInput,
      taxIdNumber: taxIdInput,
      nationalIdNumber: nationalIdInput,
      governorate: govInput,
      documentUrl: docFileName || "commercial-registration-scan.pdf",
    });
    setIsKycModalOpen(false);
  };

  // Real Image Upload States
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const res = ev.target.result as string;
          setUploadedImages((prev) => [res, ...prev]);
          setSelectedImage(res);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const isSeller = user?.role === "seller";

  const handleRegisterSeller = (e: React.FormEvent) => {
    e.preventDefault();
    registerSeller(
      storeNameInput || (lang === "ar" ? "متجر سوقلي الرسمي" : "Souqly Official Store"),
      sellerNameInput || (lang === "ar" ? "تاجر سوقلي" : "Souqly Seller"),
      phoneInput || "+966500000000"
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    addProduct({
      name: {
        ar: nameAr,
        en: nameEn || nameAr,
      },
      category: {
        ar: categoryAr,
        en: categoryEn,
      },
      price: Number(productPrice),
      ...(oldPrice ? { oldPrice: Number(oldPrice) } : {}),
      rating: 5.0,
      reviews: 1,
      image: customImageUrl.trim() ? customImageUrl.trim() : selectedImage,
      seller: user?.storeName || (lang === "ar" ? "متجر معتمد" : "Verified Store"),
      ...(user?.id ? { sellerId: user.id } : {}),
      stock: Number(stock),
      desc: {
        ar: descAr || nameAr,
        en: descEn || nameEn || nameAr,
      },
    });

    // Reset Form
    setNameAr("");
    setNameEn("");
    setDescAr("");
    setDescEn("");
    setCustomImageUrl("");
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setActiveTab("inventory");
    }, 1500);
  };

  // Metrics calculations
  const sellerProducts = products;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "pending" ? o.total : 0), 0) + 14250;
  const totalOrdersCount = orders.length + 28;

  if (!isSeller) {
    // Non-seller view: Landing Page to Join as Seller
    return (
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="rounded-3xl bg-linear-to-r from-primary to-primary/90 p-8 md:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold mb-4">
              <ShieldCheck className="h-4 w-4" />
              {lang === "ar" ? "برنامج تجار سوقلي المعتمدين" : "Souqly Verified Sellers Program"}
            </div>
            <h1 className="text-3xl font-black md:text-5xl leading-tight">
              {lang === "ar"
                ? "ابدأ البيع على سوقلي، ووصّل منتجاتك لملايين العملاء في الخليج"
                : "Sell on Souqly and Reach Millions of Shoppers Across the Gulf"}
            </h1>
            <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed">
              {lang === "ar"
                ? "منصة متطورة تجمع بين قوة أمازون وسهولة الاستخدام. عمولات منخفضة، لوحة تحكم فورية لإدارة المخزون، وربط مباشر مع شبكات الشحن والتحصيل."
                : "Advanced multi-vendor marketplace infrastructure. Low commission, real-time inventory management, and integrated payments."}
            </p>
          </div>
        </div>

        {/* Quick Registration Form */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-gold" />
            {lang === "ar" ? "سجّل متجرك التجاري الآن في دقيقة" : "Register Your Store in One Minute"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar"
              ? "أدخل بيانات نشاطك لفتح لوحة تحكم التاجر والبدء في رفع منتجاتك للبيع فوراً."
              : "Enter your store details to unlock your Seller Dashboard and start listing products immediately."}
          </p>

          <form onSubmit={handleRegisterSeller} className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "اسم المتجر / البراند" : "Store / Brand Name"}
              </label>
              <input
                type="text"
                required
                value={storeNameInput}
                onChange={(e) => setStoreNameInput(e.target.value)}
                placeholder={lang === "ar" ? "مثال: متجر النخبة للإلكترونيات" : "e.g. Apex Electronics"}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "اسم مالك المتجر / المسؤول" : "Owner / Manager Name"}
              </label>
              <input
                type="text"
                required
                value={sellerNameInput}
                onChange={(e) => setSellerNameInput(e.target.value)}
                placeholder={lang === "ar" ? "مثال: عبدالله العرابي" : "e.g. Abdullah Orabi"}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "رقم الجوال أو الواتساب التجاري" : "Business Phone / WhatsApp"}
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+966 50 123 4567"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full md:w-auto rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Store className="h-4 w-4 text-gold" />
                {lang === "ar" ? "افتتاح المتجر والدخول للوحة التحكم" : "Launch Store & Open Dashboard"}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <DollarSign className="h-8 w-8 text-gold" />
            <h3 className="mt-3 font-bold">{lang === "ar" ? "عمولة تنافسية" : "Low Commissions"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "ar" ? "تحصيل يومي وأسبوعي مباشر لأرباحك في حسابك البنكي." : "Direct regular payouts to your bank."}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Truck className="h-8 w-8 text-gold" />
            <h3 className="mt-3 font-bold">{lang === "ar" ? "شحن لوجستي موحد" : "Fulfillment by Souqly"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "ar" ? "اشحن بنفسك أو دع أسطول سوقلي يتولى التوصيل لباب العميل." : "Ship yourself or let our Gulf network deliver."}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <TrendingUp className="h-8 w-8 text-gold" />
            <h3 className="mt-3 font-bold">{lang === "ar" ? "لوحة تحكم ذكية" : "Smart Dashboard"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "ar" ? "إحصائيات المبيعات، ومراقبة المخزون، وتحليلات الزوار." : "Real-time sales, inventory, and order analytics."}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="h-8 w-8 text-gold" />
            <h3 className="mt-3 font-bold">{lang === "ar" ? "حماية وشفافية" : "Seller Protection"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "ar" ? "حماية كاملة من الاحتيال وسياسة إرجاع عادلة ومدروسة." : "Fraud protection & clear dispute resolution."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Active Seller Dashboard
  return (
    <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Top Banner: Store Status & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-card border border-border p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{user?.storeName || (lang === "ar" ? "متجر سوقلي" : "Souqly Store")}</h1>
              {user?.kycStatus === "pending" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600 animate-pulse">
                  <Clock className="h-3.5 w-3.5" />
                  {lang === "ar" ? "التوثيق قيد المراجعة" : "KYC Pending"}
                </span>
              ) : user?.commercialRegNumber || user?.kycStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {lang === "ar" ? "بائع موثق رسمياً (سجل وضريبة)" : "Verified Merchant"}
                </span>
              ) : (
                <button
                  onClick={() => setIsKycModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-gold/20 hover:bg-gold/30 px-2.5 py-0.5 text-xs font-bold text-gold-foreground dark:text-gold border border-gold/40 cursor-pointer transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{lang === "ar" ? "توثيق المتجر بالسجل والبطاقة الضريبية ⚡" : "Verify Store KYC ⚡"}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar" ? "التاجر:" : "Owner:"} <span className="font-semibold text-foreground">{user?.name}</span> • {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole("buyer")}
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            {lang === "ar" ? "معاينة كمتسوق (مشتري)" : "Switch to Buyer View"}
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {lang === "ar" ? "زيارة المتجر الرئيسي" : "Visit Marketplace"}
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards (Amazon Seller Central style) */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "إجمالي المبيعات" : "Total Revenue"}</span>
            <DollarSign className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 text-2xl font-black">{price(totalRevenue)}</div>
          <span className="text-[11px] font-semibold text-emerald-600">↑ +18.4% {lang === "ar" ? "هذا الشهر" : "this month"}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "عدد الطلبات" : "Total Orders"}</span>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-black">{totalOrdersCount}</div>
          <span className="text-[11px] font-semibold text-emerald-600">↑ 4 {lang === "ar" ? "طلبات جديدة اليوم" : "new today"}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "المنتجات المعروضة" : "Active Products"}</span>
            <Package className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black">{sellerProducts.length}</div>
          <span className="text-[11px] font-medium text-muted-foreground">{lang === "ar" ? "جميعها جاهزة للبيع" : "Live in store"}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "تقييم المتجر" : "Store Rating"}</span>
            <span className="text-gold font-bold">★ 4.9</span>
          </div>
          <div className="mt-2 text-2xl font-black">4.9 / 5.0</div>
          <span className="text-[11px] font-medium text-muted-foreground">{lang === "ar" ? "بناءً على 1,280 تقييم" : "from 1,280 reviews"}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-8 flex border-b border-border">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "inventory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          {lang === "ar" ? "إدارة المنتجات والمخزون" : "Products & Inventory"} ({sellerProducts.length})
        </button>

        <button
          onClick={() => setActiveTab("newProduct")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "newProduct"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <PlusCircle className="h-4 w-4 text-gold" />
          {lang === "ar" ? "إضافة منتج جديد" : "Add New Product"}
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "orders"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {lang === "ar" ? "الطلبات الواردة" : "Incoming Orders"} ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("returns")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "returns"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCcw className="h-4 w-4 text-amber-500" />
          {lang === "ar" ? "المرتجعات والشكاوى" : "Returns & Claims"} ({orders.filter((o) => o.status === "return_requested" || o.status === "returned").length})
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "payouts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="h-4 w-4 text-gold" />
          {lang === "ar" ? "المالية وسحب الأرباح" : "Financials & Payouts"}
        </button>
      </div>

      {/* Tab 1: Products and Inventory */}
      {activeTab === "inventory" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{lang === "ar" ? "قائمة المنتجات النشطة بالمتجر" : "Live Product Listings"}</h2>
            <button
              onClick={() => setActiveTab("newProduct")}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-1.5 text-xs font-bold text-gold-foreground hover:opacity-90"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {lang === "ar" ? "إضافة منتج الآن" : "Add Product Now"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-start text-sm">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3 text-start">{lang === "ar" ? "المنتج" : "Product"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "القسم" : "Category"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "السعر" : "Price"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "المخزون" : "Stock"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "التقييم" : "Rating"}</th>
                  <th className="p-3 text-end">{lang === "ar" ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sellerProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name[lang]} className="h-12 w-12 rounded-lg object-cover bg-secondary shrink-0" />
                        <div>
                          <Link to="/product/$id" params={{ id: p.id }} className="font-semibold hover:text-primary line-clamp-1">
                            {p.name[lang]}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">{lang === "ar" ? "البائع:" : "By:"} {p.seller}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground font-medium">{p.category[lang]}</td>
                    <td className="p-3 font-bold text-foreground">
                      {price(p.price)}
                      {p.oldPrice && (
                        <span className="ms-1.5 text-xs text-muted-foreground line-through">{price(p.oldPrice)}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                        {p.stock ?? 30} {lang === "ar" ? "قطعة" : "pcs"}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-bold text-gold">★ {p.rating} ({p.reviews})</td>
                    <td className="p-3 text-end">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newPrice = prompt(lang === "ar" ? "أدخل السعر الجديد (ر.س):" : "Enter new price (SAR):", String(p.price));
                            if (newPrice && !isNaN(Number(newPrice))) {
                              updateProduct(p.id, { price: Number(newPrice) });
                            }
                          }}
                          className="rounded-md border border-input p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title={lang === "ar" ? "تعديل السعر" : "Edit Price"}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا المنتج؟" : "Delete this product?")) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="rounded-md border border-destructive/20 p-1.5 text-destructive hover:bg-destructive/10"
                          title={lang === "ar" ? "حذف المنتج" : "Delete"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Add New Product Form */}
      {activeTab === "newProduct" && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-gold" />
            {lang === "ar" ? "إضافة منتج جديد ونشره فوراً في المتجر" : "List New Product on Souqly"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "سيظهر المنتج فور إضافته لجميع المتسوقين ويمكن إضافته للسلة والشراء مباشرة."
              : "Product will go live immediately on the store for shoppers to browse and order."}
          </p>

          {successToast && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 p-3 text-sm font-bold text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              {lang === "ar" ? "تم نشر المنتج بنجاح في متجر سوقلي!" : "Product published successfully to Souqly!"}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "اسم المنتج بالعربية *" : "Product Name (Arabic) *"}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: هاتف ذكي برو ماكس 256 جيجا" : "Arabic title"}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "اسم المنتج بالإنجليزية" : "Product Name (English)"}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Pro Max Smartphone 256GB"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "القسم / التصنيف" : "Category"}
                </label>
                <select
                  value={categoryAr}
                  onChange={(e) => {
                    setCategoryAr(e.target.value);
                    const map: Record<string, string> = {
                      إلكترونيات: "Electronics",
                      عطور: "Perfumes",
                      أزياء: "Fashion",
                      المنزل: "Home",
                      رياضة: "Sports",
                    };
                    setCategoryEn(map[e.target.value] || "General");
                  }}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="إلكترونيات">{lang === "ar" ? "إلكترونيات" : "Electronics"}</option>
                  <option value="عطور">{lang === "ar" ? "عطور وجمال" : "Perfumes"}</option>
                  <option value="أزياء">{lang === "ar" ? "أزياء وموضة" : "Fashion"}</option>
                  <option value="المنزل">{lang === "ar" ? "المنزل والمطبخ" : "Home"}</option>
                  <option value="رياضة">{lang === "ar" ? "رياضة ولياقة" : "Sports"}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "سعر البيع (ر.س) *" : "Price (SAR) *"}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "السعر قبل الخصم (اختياري)" : "Original Price (Optional)"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={oldPrice || ""}
                  onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="399"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "الكمية في المخزون" : "Stock Quantity"}
                </label>
                <input
                  type="number"
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {lang === "ar" ? "رابط صورة خارجية مخصصة (اختياري)" : "Custom Image URL (Optional)"}
                </label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quick Preset Image Picker */}
            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "أو اختر صورة جاهزة للمنتج من المعرض:" : "Or select a preset product image:"}
              </label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {DEFAULT_PRESET_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.src);
                      setCustomImageUrl("");
                    }}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === img.src && !customImageUrl ? "border-primary ring-2 ring-primary" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "وصف ومميزات المنتج بالعربية" : "Product Description"}
              </label>
              <textarea
                rows={3}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder={lang === "ar" ? "اذكر مميزات المنتج، الضمان، وطريقة الاستخدام..." : "Description..."}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4 text-gold" />
              {t.saveProduct}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Incoming Orders */}
      {activeTab === "orders" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "سجل طلبات العملاء" : "Customer Orders"}</h2>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {lang === "ar" ? "لا توجد طلبات جديدة حالياً." : "No customer orders yet."}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-primary">{o.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          o.status === "delivered"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : o.status === "shipped"
                            ? "bg-blue-500/15 text-blue-600"
                            : o.status === "processing"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {o.status === "delivered"
                          ? lang === "ar" ? "تم التوصيل" : "Delivered"
                          : o.status === "shipped"
                          ? lang === "ar" ? "تم الشحن" : "Shipped"
                          : o.status === "processing"
                          ? lang === "ar" ? "قيد التجهيز" : "Processing"
                          : lang === "ar" ? "جديد" : "Pending"}
                      </span>

                      {/* Status changer buttons */}
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none cursor-pointer"
                      >
                        <option value="pending">{lang === "ar" ? "جديد" : "Pending"}</option>
                        <option value="processing">{lang === "ar" ? "قيد التجهيز" : "Processing"}</option>
                        <option value="shipped">{lang === "ar" ? "تم الشحن" : "Shipped"}</option>
                        <option value="delivered">{lang === "ar" ? "تم التسليم" : "Delivered"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "بيانات المشتري والشحن:" : "Customer & Address:"}</span>
                      <p className="font-semibold text-sm mt-0.5">{o.customerName} ({o.customerPhone})</p>
                      <p className="text-xs text-muted-foreground">{o.customerAddress} - {o.city}، {o.country}</p>
                      <p className="text-xs text-muted-foreground mt-1">💳 {o.paymentMethod}</p>
                      
                      {/* Courier & AWB Information */}
                      <div className="mt-2.5 rounded-lg border border-border bg-secondary/40 p-2 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground flex items-center gap-1">
                            <Truck className="h-3 w-3 text-gold" />
                            {o.courier || "بوسطة Bosta Express"}
                          </span>
                          <span className="text-muted-foreground font-mono">{o.estimatedDeliveryDate || "24-48 ساعة"}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-border/50">
                          <span className="font-mono text-muted-foreground">AWB: <b className="text-foreground">{o.trackingNumber || `BST-EG-${o.id.replace('ORD-', '')}89`}</b></span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="text-primary hover:underline font-bold text-[10px] cursor-pointer"
                          >
                            طباعة البوليصة 🖨️
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">{lang === "ar" ? "المنتجات المطلوبة:" : "Items Ordered:"}</span>
                      <div className="mt-1 space-y-1">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-foreground line-clamp-1">{item.name[lang] || item.name.ar} × {item.quantity}</span>
                            <span className="font-bold">{price(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 border-t border-border pt-1.5 flex justify-between font-bold text-sm">
                        <span>{t.total}:</span>
                        <span className="text-primary">{price(o.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {payoutSuccessToast && (
        <div className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{lang === "ar" ? "تم إرسال طلب التحويل المالي وسحب الأرباح بنجاح!" : "Payout request processed!"}</span>
        </div>
      )}

      {/* Tab 4: Returns & Customer Claims */}
      {activeTab === "returns" && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold">{lang === "ar" ? "إدارة طلبات الإرجاع والاستبدال" : "Returns & Customer Claims"}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar"
                ? "متابعة طلبات الإرجاع المقدمة من العملاء وفقاً لضمان سوقلي الذهبي وقانون حماية المستهلك المصري والخليجي."
                : "Manage buyer return requests under Souqly Buyer Protection and local consumer laws."}
            </p>
          </div>

          {orders.filter((o) => o.status === "return_requested" || o.status === "returned").length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-xs text-muted-foreground">
              <RotateCcw className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              {lang === "ar" ? "لا توجد طلبات إرجاع حالية لمتجرك. مؤشرات رضا العملاء ممتازة!" : "No return requests found."}
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .filter((o) => o.status === "return_requested" || o.status === "returned")
                .map((o) => (
                  <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-foreground">#{o.id}</span>
                        {o.returnTrackingNumber && (
                          <span className="font-mono bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-xs font-bold">
                            بوليصة: {o.returnTrackingNumber}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            o.status === "returned"
                              ? "bg-purple-500/15 text-purple-600"
                              : "bg-amber-500/15 text-amber-600"
                          }`}
                        >
                          {o.status === "returned"
                            ? lang === "ar" ? "تم الإرجاع والاسترداد" : "Returned & Refunded"
                            : lang === "ar" ? "طلب إرجاع قيد المراجعة" : "Return Requested"}
                        </span>
                      </div>

                      <div className="text-end">
                        <span className="font-bold text-sm text-primary">{price(o.total)}</span>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-4 md:grid-cols-2 text-xs">
                      <div>
                        <span className="font-bold text-foreground block mb-1">
                          {lang === "ar" ? "سبب طلب الإرجاع من العميل:" : "Return Reason:"}
                        </span>
                        <p className="text-amber-700 dark:text-amber-400 font-semibold">{o.returnReason || "غير محدد"}</p>
                        {o.returnNotes && <p className="text-muted-foreground mt-1">{o.returnNotes}</p>}
                        <p className="text-muted-foreground mt-2">
                          {lang === "ar" ? "العميل:" : "Buyer:"} {o.customerName} ({o.customerPhone}) - {o.city}، {o.country}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-foreground block mb-1">
                          {lang === "ar" ? "المنتجات المطلوب إرجاعها:" : "Returned Items:"}
                        </span>
                        <div className="space-y-1">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-muted-foreground">
                              <span>{item.name[lang] || item.name.ar} × {item.quantity}</span>
                              <span className="font-semibold text-foreground">{price(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {o.status === "return_requested" && (
                          <div className="mt-4 pt-3 border-t border-border flex justify-end">
                            <button
                              onClick={() => approveReturn(o.id)}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 cursor-pointer"
                            >
                              {lang === "ar" ? "الموافقة على الإرجاع وصرف المستحقات للعميل" : "Approve Return & Issue Refund"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Financials & Payouts */}
      {activeTab === "payouts" && (
        <div className="mt-6 space-y-6">
          {/* Financial summary banner with Escrow Breakdown */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">{lang === "ar" ? "إجمالي مبيعات المتجر (Gross)" : "Gross Store Sales"}</span>
              <div className="mt-2 text-2xl font-black text-foreground font-display">{price(totalRevenue)}</div>
              <span className="text-[10px] text-muted-foreground block mt-1">
                {lang === "ar" ? "قبل خصم العمولات والضرائب" : "Before platform fees"}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">{lang === "ar" ? "الرصيد المتاح للسحب الفوري" : "Available for Instant Payout"}</span>
              <div className="mt-2 text-2xl font-black text-emerald-600 font-display">{price(totalRevenue * 0.65)}</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                {lang === "ar" ? "جاهز للتحويل الفوري عبر إنستاباي" : "Ready for instant transfer"}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">{lang === "ar" ? "رصيد الأمان المعلق (Escrow Hold)" : "14-Day Escrow Hold"}</span>
              <div className="mt-2 text-2xl font-black text-amber-600 font-display">{price(totalRevenue * 0.25)}</div>
              <span className="text-[10px] text-muted-foreground block mt-1">
                {lang === "ar" ? "فترة حماية المستهلك القانونية (14 يوماً)" : "Consumer Protection 14-day hold"}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">{lang === "ar" ? "عمولة منصة سوقلي (10%)" : "Souqly Commission (10%)"}</span>
              <div className="mt-2 text-2xl font-black text-primary font-display">{price(totalRevenue * 0.1)}</div>
              <span className="text-[10px] text-muted-foreground block mt-1">
                {lang === "ar" ? "شاملة رسوم بوابات الدفع الإلكتروني" : "Includes gateway processing"}
              </span>
            </div>
          </div>

          {/* Request Payout Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-1">
              <Landmark className="h-5 w-5 text-gold" />
              {lang === "ar" ? "طلب سحب أرباح جديدة لحسابك" : "Request Payout"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {lang === "ar"
                ? "اختر وسيلة التحويل المفضلة في جمهورية مصر العربية أو دول الخليج لإيداع أرباحك فوراً."
                : "Select your preferred payment channel across Egypt or the GCC."}
            </p>

            <form onSubmit={handleRequestPayout} className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "المبلغ المراد سحبه:" : "Amount to Withdraw:"}
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "قناة التحويل:" : "Payout Method:"}
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => {
                    const m = e.target.value;
                    setPayoutMethod(m as "instapay" | "vodafone_cash" | "bank_iban");
                    if (m === "instapay") setPayoutDest("cairo.tech@instapay");
                    else if (m === "vodafone_cash") setPayoutDest("01012345678");
                    else setPayoutDest("EG380002000100000012345678901");
                  }}
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs outline-none cursor-pointer"
                >
                  <option value="instapay">إنستاباي مصر (InstaPay IPA)</option>
                  <option value="vodafone_cash">فودافون كاش / المحافظ الإلكترونية</option>
                  <option value="bank_iban">تحويل بنكي مباشر (IBAN مصر والخليج)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "معرف الحساب / رقم المحفظة / IBAN:" : "Destination Account / Handle:"}
                </label>
                <input
                  type="text"
                  required
                  value={payoutDest}
                  onChange={(e) => setPayoutDest(e.target.value)}
                  placeholder="مثال: name@instapay"
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-3 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-gold px-6 py-2.5 text-xs font-black text-gold-foreground shadow hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{lang === "ar" ? "تأكيد طلب سحب الأرباح" : "Process Payout"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Payout History Ledger */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">
                {lang === "ar" ? "سجل التحويلات السابقة" : "Payout History"}
              </h3>
              <span className="text-xs text-muted-foreground">{sellerPayouts.length} {lang === "ar" ? "عمليات" : "records"}</span>
            </div>

            <div className="divide-y divide-border">
              {sellerPayouts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold font-mono text-foreground block">{p.id}</span>
                      <span className="text-muted-foreground text-[11px]">
                        {p.method === "instapay"
                          ? "إنستاباي (InstaPay)"
                          : p.method === "vodafone_cash"
                          ? "فودافون كاش"
                          : "تحويل بنكي IBAN"} • {p.destination}
                      </span>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="font-bold text-sm text-foreground block">{price(p.amount)}</span>
                    <span className="text-[10px] text-muted-foreground">{p.date} • {lang === "ar" ? "تم التحويل" : "Completed"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Merchant KYC Submission Modal */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-foreground">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>{lang === "ar" ? "توثيق المتجر بالسجل التجاري والبطاقة الضريبية" : "Store Verification & Tax KYC"}</span>
              </div>
              <button
                onClick={() => setIsKycModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-bold block mb-1">
                {lang === "ar" ? "✓ مميزات التاجر الموثق على منصة سوقلي:" : "Verified Merchant Perks:"}
              </span>
              <p className="text-[11px] leading-relaxed">
                {lang === "ar"
                  ? "الحصول على الشارة الذهبية، تصدر نتائج البحث، وزيادة ثقة المشترين في مصر والخليج وسحب الأرباح الفوري يومياً."
                  : "Golden verified badge, search priority and daily instant settlements."}
              </p>
            </div>

            <form onSubmit={handleKycSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">
                  {lang === "ar" ? "رقم السجل التجاري (Commercial Registration) *" : "Commercial Registration (CR) *"}
                </label>
                <input
                  type="text"
                  required
                  value={crInput}
                  onChange={(e) => setCrInput(e.target.value)}
                  placeholder="مثال: CR-104928-CAIRO"
                  className="w-full rounded-lg border border-input bg-background p-2 font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  {lang === "ar" ? "رقم التسجيل الضريبي الموحد (Tax ID - 9 أرقام) *" : "Tax ID Number *"}
                </label>
                <input
                  type="text"
                  required
                  value={taxIdInput}
                  onChange={(e) => setTaxIdInput(e.target.value)}
                  placeholder="مثال: 482-901-342"
                  className="w-full rounded-lg border border-input bg-background p-2 font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  {lang === "ar" ? "الرقم القومي / الهوية الوطنية للمفوض (14 رقماً) *" : "National ID / Representative ID *"}
                </label>
                <input
                  type="text"
                  required
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value)}
                  placeholder="28901230104921"
                  className="w-full rounded-lg border border-input bg-background p-2 font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  {lang === "ar" ? "المحافظة والمقر الرئيسي للمتجر / المستودع *" : "Governorate & Headquarters *"}
                </label>
                <select
                  value={govInput}
                  onChange={(e) => setGovInput(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-2 outline-none cursor-pointer"
                >
                  <option value="القاهرة (مدينة نصر والتجمع)">القاهرة (مدينة نصر والتجمع)</option>
                  <option value="الجيزة (مدينة 6 أكتوبر والشيخ زايد)">الجيزة (مدينة 6 أكتوبر والشيخ زايد)</option>
                  <option value="الإسكندرية (سموحة والمنطقة الحرة)">الإسكندرية (سموحة والمنطقة الحرة)</option>
                  <option value="الدقهلية (المنصورة)">الدقهلية (المنصورة)</option>
                  <option value="الغربية (طنطا والمحلة الكبرى)">الغربية (طنطا والمحلة الكبرى)</option>
                  <option value="بورسعيد (المنطقة الحرة)">بورسعيد (المنطقة الحرة)</option>
                  <option value="المملكة العربية السعودية (الرياض)">المملكة العربية السعودية (الرياض)</option>
                  <option value="الإمارات العربية المتحدة (دبي)">الإمارات العربية المتحدة (دبي)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  {lang === "ar" ? "صورة السجل التجاري أو البطاقة الضريبية (ملف PDF / صورة):" : "Document Scan (PDF/Image):"}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDocFileName(e.target.files[0].name);
                    }
                  }}
                  className="w-full rounded-lg border border-input bg-background p-1.5 outline-none cursor-pointer"
                />
                {docFileName && (
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">✓ تم اختيار الملف: {docFileName}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsKycModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-bold hover:bg-muted cursor-pointer"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 cursor-pointer"
                >
                  {lang === "ar" ? "إرسال مستندات التوثيق للمراجعة" : "Submit KYC"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
