import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStore, type ShippingAddress, RATES } from "@/lib/store";
import { useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  Heart,
  Store,
  Globe,
  Coins,
  LogOut,
  ChevronRight,
  Home,
  Briefcase,
  Building,
  Check,
  X,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Zap,
  Landmark,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const GULF_COUNTRIES = [
  {
    code: "EG",
    nameAr: "جمهورية مصر العربية",
    nameEn: "Egypt",
    cities: [
      "القاهرة",
      "الجيزة",
      "الإسكندرية",
      "القاهرة الجديدة (التجمع)",
      "مدينة 6 أكتوبر",
      "الشيخ زايد",
      "المنصورة",
      "طنطا",
      "الزقازيق",
      "بورسعيد",
      "السويس",
      "الإسماعيلية",
      "دمياط",
      "أسيوط",
      "سوهاج",
      "المنيا",
      "بني سويف",
      "قنا",
      "الأقصر",
      "أسوان",
      "الغردقة",
      "شرم الشيخ",
    ],
  },
  { code: "SA", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", cities: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "أبها", "تبوك"] },
  { code: "AE", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", cities: ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة"] },
  { code: "KW", nameAr: "دولة الكويت", nameEn: "Kuwait", cities: ["مدينة الكويت", "حولي", "السالمية", "الأحمدي", "الفروانية"] },
  { code: "QA", nameAr: "دولة قطر", nameEn: "Qatar", cities: ["الدوحة", "الريان", "الوكرة", "الخور"] },
  { code: "BH", nameAr: "مملكة البحرين", nameEn: "Bahrain", cities: ["المنامة", "المحرق", "الرفاع"] },
  { code: "OM", nameAr: "سلطنة عمان", nameEn: "Oman", cities: ["مسقط", "صلالة", "صحار", "نزوى"] },
];

function ProfilePage() {
  const {
    user,
    login,
    logout,
    setIsAuthModalOpen,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    updateUser,
    orders,
    wishlist,
    lang,
    setLang,
    currency,
    setCurrency,
    addNotification,
    walletBalance,
    walletTransactions,
    topUpWallet,
    price,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"wallet" | "addresses" | "info" | "activity">("wallet");

  // Profile Edit State
  const [name, setName] = useState(user?.name || "سعد بن محمد القحطاني");
  const [email, setEmail] = useState(user?.email || "saad.alqahtani@example.com");
  const [phone, setPhone] = useState(user?.phone || "+966 50 123 4567");
  const [saveToast, setSaveToast] = useState(false);

  // Top Up Wallet Modal State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(200);
  const [topUpMethod, setTopUpMethod] = useState("فودافون كاش / إنستاباي (Vodafone Cash / InstaPay)");

  // Withdraw Request Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [withdrawDestination, setWithdrawDestination] = useState("حساب بنكي / InstaPay");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({ name, email, phone });
    } else {
      login({
        id: "usr_guest",
        name,
        email,
        phone,
        role: "buyer",
      });
    }
    setSaveToast(true);
    addNotification({
      title: { ar: "تم تحديث الملف الشخصي", en: "Profile Updated" },
      message: { ar: "تم حفظ بياناتك وعنوانك بنجاح.", en: "Your personal details have been saved." },
      type: "system",
    });
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleConfirmTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) return;
    topUpWallet(Number(topUpAmount), topUpMethod);
    setIsTopUpOpen(false);
  };

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > walletBalance) {
      toast.error(lang === "ar" ? "رصيد المحفظة غير كافٍ لإتمام السحب" : "Insufficient balance");
      return;
    }
    toast(
      lang === "ar"
        ? `تم استلام طلب سحب ${price(withdrawAmount)} بنجاح، وسيتم التحويل إلى (${withdrawDestination}) خلال 24 ساعة.`
        : `Withdrawal request for ${price(withdrawAmount)} submitted.`
    );
    setIsWithdrawOpen(false);
  };

  // New Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrTitle, setAddrTitle] = useState("المنزل");
  const [addrRecipient, setAddrRecipient] = useState(user?.name || "");
  const [addrPhone, setAddrPhone] = useState(user?.phone || "");
  const [addrCountry, setAddrCountry] = useState(GULF_COUNTRIES[0]?.nameAr || "جمهورية مصر العربية");
  const [addrCity, setAddrCity] = useState(GULF_COUNTRIES[0]?.cities[0] || "القاهرة");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrPostal, setAddrPostal] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrRecipient || !addrPhone || !addrDistrict || !addrStreet) return;

    addAddress({
      title: addrTitle,
      recipientName: addrRecipient,
      phone: addrPhone,
      country: addrCountry,
      city: addrCity || "القاهرة",
      district: addrDistrict,
      street: addrStreet,
      postalCode: addrPostal,
      isDefault: addrIsDefault || addresses.length === 0,
    });

    setIsAddressModalOpen(false);
    setAddrDistrict("");
    setAddrStreet("");
    setAddrPostal("");
    addNotification({
      title: { ar: "عنوان شحن جديد", en: "New Address Added" },
      message: { ar: `تمت إضافة عنوان "${addrTitle}" إلى قائمة الشحن السريع بنجاح.`, en: `Address "${addrTitle}" was saved.` },
      type: "system",
    });
  };

  const selectedCountryObj = GULF_COUNTRIES.find((c) => c.nameAr === addrCountry) || GULF_COUNTRIES[0];

  return (
    <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-6 start-6 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{lang === "ar" ? "تم حفظ التعديلات بنجاح!" : "Changes saved successfully!"}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{lang === "ar" ? "حسابي والمحفظة" : "My Account & Wallet"}</span>
      </div>

      {/* User Hero Banner */}
      <div className="mb-8 rounded-3xl border border-border bg-gradient-to-r from-card via-secondary/30 to-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/20 font-display text-2xl font-black text-gold border border-gold/30">
              {user ? user.name.slice(0, 1).toUpperCase() : "س"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-foreground">
                  {user ? user.name : "سعد بن محمد القحطاني"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user?.role === "seller" ? (lang === "ar" ? "تاجر معتمد" : "Verified Merchant") : (lang === "ar" ? "عميل معتمد" : "Verified Buyer")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user ? user.email : "saad.alqahtani@example.com"} • {user?.phone || "+966 50 123 4567"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!user ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
              >
                {lang === "ar" ? "تسجيل الدخول / إنشاء حساب" : "Sign In"}
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{lang === "ar" ? "تسجيل الخروج" : "Log Out"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-border">
          <div
            onClick={() => setActiveTab("wallet")}
            className="rounded-2xl border border-gold/40 bg-gold/5 p-3.5 hover:border-gold transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold text-gold-foreground dark:text-gold">{lang === "ar" ? "محفظة سوقلي" : "Souqly Wallet"}</span>
              <Wallet className="h-4 w-4 text-gold" />
            </div>
            <p className="mt-1 text-lg font-black text-primary">{price(walletBalance)}</p>
          </div>

          <Link to="/orders" className="rounded-2xl border border-border bg-card p-3.5 hover:border-gold/50 transition">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{lang === "ar" ? "طلباتي والمرتجعات" : "Orders & Returns"}</span>
              <Package className="h-4 w-4 text-gold" />
            </div>
            <p className="mt-1 text-xl font-black text-foreground">{orders.length}</p>
          </Link>

          <Link to="/wishlist" className="rounded-2xl border border-border bg-card p-3.5 hover:border-gold/50 transition">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{lang === "ar" ? "قائمة الرغبات" : "Saved Wishlist"}</span>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-1 text-xl font-black text-foreground">{wishlist.length}</p>
          </Link>

          <div
            onClick={() => setActiveTab("addresses")}
            className="rounded-2xl border border-border bg-card p-3.5 hover:border-gold/50 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{lang === "ar" ? "العناوين المسجلة" : "Saved Addresses"}</span>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-xl font-black text-foreground">{addresses.length}</p>
          </div>

          <Link to="/sell" className="rounded-2xl border border-border bg-card p-3.5 hover:border-gold/50 transition">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{lang === "ar" ? "بوابة التجارة" : "Seller Central"}</span>
              <Store className="h-4 w-4 text-gold" />
            </div>
            <p className="mt-1 text-xs font-bold text-gold">{lang === "ar" ? "إدارة متاجري ↗" : "Sell on Souqly ↗"}</p>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "wallet"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>{lang === "ar" ? "محفظة سوقلي الرقمية واسترداد الأموال" : "Souqly Digital Wallet"}</span>
          <span className="rounded-full bg-gold/20 text-gold-foreground dark:text-gold px-2 py-0.5 text-[10px] font-bold">
            {price(walletBalance)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "addresses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>{lang === "ar" ? "دفتر عناوين الشحن والتوصيل" : "Shipping Addresses"}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{addresses.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "info"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          <span>{lang === "ar" ? "البيانات الشخصية والإعدادات" : "Profile & Preferences"}</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "activity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>{lang === "ar" ? "سجل النشاط والمتابعات" : "Activity & Stores"}</span>
        </button>
      </div>

      {/* Tab: Souqly Digital Wallet */}
      {activeTab === "wallet" && (
        <div className="mt-6 space-y-6">
          {/* Main Balance Banner */}
          <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-gold/10 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  {lang === "ar" ? "الرصيد المتاح في المحفظة" : "Available Wallet Balance"}
                </span>
                <div className="mt-2 flex items-baseline gap-3">
                  <h2 className="text-3xl md:text-5xl font-black text-primary font-display">{price(walletBalance)}</h2>
                  <span className="text-xs text-muted-foreground">
                    {lang === "ar" ? "(صالح للاستخدام الفوري لجميع المشتريات)" : "(Ready for immediate checkout)"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground max-w-lg leading-relaxed">
                  {lang === "ar"
                    ? "تُودع استردادات المرتجعات والطلبات الملغية في محفظتك فوراً. يمكنك استخدام الرصيد للشراء بضغطة واحدة دون بطاقات، أو تحويله لحسابك البنكي / محفظتك الإلكترونية."
                    : "Refunds and cashbacks are deposited instantly into your Souqly Wallet. Use it for 1-click checkout or withdraw to your bank."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-gold-foreground shadow-sm hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{lang === "ar" ? "شحن رصيد المحفظة" : "Top Up Balance"}</span>
                </button>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span>{lang === "ar" ? "طلب سحب للحساب" : "Withdraw Funds"}</span>
                </button>
              </div>
            </div>

            {/* Local payment badges */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground text-[11px]">{lang === "ar" ? "طرق الشحن المدعومة:" : "Recharge via:"}</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-foreground text-[11px]">فودافون كاش</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-foreground text-[11px]">إنستاباي InstaPay</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-foreground text-[11px]">ميزة Fawry / Meeza</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-foreground text-[11px]">مدى Mada</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-bold text-foreground text-[11px]">Apple Pay / Visa</span>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-gold" />
                {lang === "ar" ? "سجل الحركات المالية والمحفظة" : "Transaction History"}
              </h3>
              <span className="text-xs text-muted-foreground">{walletTransactions.length} {lang === "ar" ? "معاملة" : "transactions"}</span>
            </div>

            {walletTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                {lang === "ar" ? "لا توجد معاملات سابقة في محفظتك حتى الآن." : "No transactions recorded yet."}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {walletTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          tx.type === "credit"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-rose-500/15 text-rose-600"
                        }`}
                      >
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{tx.title[lang] || tx.title.ar}</p>
                        <span className="text-[10px] text-muted-foreground">{tx.date}</span>
                        {tx.orderId && (
                          <Link to="/orders" className="ms-2 font-mono text-primary text-[10px] hover:underline">
                            #{tx.orderId}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="text-end">
                      <span
                        className={`font-black text-sm block ${
                          tx.type === "credit" ? "text-emerald-600" : "text-foreground"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"} {price(tx.amount)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{lang === "ar" ? "ناجحة" : "Completed"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-foreground">
                <Wallet className="h-5 w-5 text-gold" />
                <span>{lang === "ar" ? "شحن رصيد محفظة سوقلي" : "Top Up Souqly Wallet"}</span>
              </div>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTopUp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "اختر أو أدخل المبلغ المراد شحنه:" : "Recharge Amount:"}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`rounded-lg py-1.5 text-xs font-bold border transition cursor-pointer ${
                        topUpAmount === amt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {price(amt)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="20"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background p-2 text-sm font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "طريقة الدفع للشحن:" : "Payment Method:"}
                </label>
                <select
                  value={topUpMethod}
                  onChange={(e) => setTopUpMethod(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none cursor-pointer"
                >
                  <option value="فودافون كاش / إنستاباي (Vodafone Cash / InstaPay)">فودافون كاش / إنستاباي (مصر)</option>
                  <option value="فوري / بطاقة ميزة (Fawry / Meeza)">فوري وميزة (Fawry / Meeza)</option>
                  <option value="بطاقة مدى البنكية (Mada)">مدى (Mada)</option>
                  <option value="فيزا / ماستركارد">فيزا / ماستركارد</option>
                  <option value="Apple Pay">Apple Pay</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-bold hover:bg-muted cursor-pointer"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-5 py-2 text-xs font-black text-gold-foreground shadow hover:opacity-90 cursor-pointer"
                >
                  {lang === "ar" ? `شحن ${price(topUpAmount)} الآن` : "Recharge Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-foreground">
                <Landmark className="h-5 w-5 text-primary" />
                <span>{lang === "ar" ? "طلب سحب رصيد المحفظة" : "Withdraw Wallet Balance"}</span>
              </div>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmWithdraw} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? `المبلغ المطلوب سحبه (المتاح: ${price(walletBalance)}):` : "Withdraw Amount:"}
                </label>
                <input
                  type="number"
                  min="50"
                  max={walletBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background p-2 text-sm font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "بيانات التحويل (رقم المحفظة / InstaPay IPA / IBAN):" : "Account / IBAN / InstaPay:"}
                </label>
                <input
                  type="text"
                  required
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  placeholder="مثال: name@instapay أو 01012345678 أو رقم الآيبان"
                  className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <p className="text-[10px] text-muted-foreground">
                {lang === "ar"
                  ? "يتم التحويل خلال 24 ساعة دون أي رسوم إضافية لحسابات البنوك المصرية والخليجية."
                  : "Transfers are processed within 24 hours at zero fees."}
              </p>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-bold hover:bg-muted cursor-pointer"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90 cursor-pointer"
                >
                  {lang === "ar" ? "تأكيد طلب السحب" : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 1: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold">{lang === "ar" ? "عناوين التوصيل المسجلة" : "Delivery Addresses"}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar"
                  ? "تُستخدم هذه العناوين للشحن السريع بضغطة زر واحدة أثناء الدفع وإنهاء الطلب."
                  : "These addresses will be available for 1-click checkout in your cart."}
              </p>
            </div>

            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === "ar" ? "إضافة عنوان شحن جديد" : "Add New Address"}</span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl border p-5 transition ${
                  a.isDefault
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{a.title}</span>
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Check className="h-3 w-3" />
                        {lang === "ar" ? "افتراضي" : "Default"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {!a.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(a.id)}
                        className="rounded-lg p-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        title={lang === "ar" ? "تعيين كافتراضي" : "Set default"}
                      >
                        {lang === "ar" ? "تعيين افتراضي" : "Set default"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(a.id)}
                      className="rounded-lg p-1.5 text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                      title={lang === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">{a.recipientName}</p>
                  <p>{a.street}، {a.district}</p>
                  <p>{a.city}، {a.country} {a.postalCode ? `(${a.postalCode})` : ""}</p>
                  <p className="pt-1 text-[11px] font-mono text-foreground">{a.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Profile Info & Preferences */}
      {activeTab === "info" && (
        <div className="mt-6 max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-lg font-bold mb-1">{lang === "ar" ? "البيانات الأساسية وتفضيلات الحساب" : "Personal Information"}</h2>
            <p className="text-xs text-muted-foreground mb-6">
              {lang === "ar" ? "قم بتحديث بياناتك وطرق التواصل المفضلة لديك." : "Update your profile and shopping preferences."}
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "الاسم بالكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  {lang === "ar" ? "رقم الجوال للتوصيل والإشعارات" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    {lang === "ar" ? "لغة الواجهة" : "Interface Language"}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English (الإنجليزية)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    {lang === "ar" ? "العملة المفضلة" : "Default Currency"}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="EGP">EGP (الجنيه المصري 🇪🇬)</option>
                    <option value="SAR">SAR (الريال السعودي 🇸🇦)</option>
                    <option value="AED">AED (الدرهم الإماراتي 🇦🇪)</option>
                    <option value="KWD">KWD (الدينار الكويتي 🇰🇼)</option>
                    <option value="QAR">QAR (الريال القطري 🇶🇦)</option>
                    <option value="BHD">BHD (الدينار البحريني 🇧🇭)</option>
                    <option value="OMR">OMR (الريال العماني 🇴🇲)</option>
                    <option value="USD">USD (الدولار الأمريكي 🇺🇸)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 cursor-pointer"
                >
                  {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Activity & Shortcuts */}
      {activeTab === "activity" && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/orders"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "سجل الطلبات والشحنات" : "Order History"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "متابعة وإلغاء وطلب إرجاع للمشتريات" : "Track, cancel and return items"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rtl:rotate-180" />
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "قائمة الأمنيات والمفضلة" : "Wishlist"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "المنتجات المحفوظة للشراء لاحقاً" : "Saved products for later"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rtl:rotate-180" />
            </Link>

            <Link
              to="/help"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "مركز المساعدة وحماية المشتري" : "Help & Protection"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "الدعم الفني، الشكاوى والضمان الذهبي" : "Customer care & Escrow guarantees"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rtl:rotate-180" />
            </Link>

            <Link
              to="/sell"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "مركز البائعين" : "Seller Central"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "إدارة المنتجات والمبيعات والمخزون" : "Manage inventory & sales"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rtl:rotate-180" />
            </Link>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">
                  {lang === "ar" ? "إضافة عنوان شحن وتوصيل جديد" : "Add Shipping Address"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "تسمية العنوان" : "Address Title"}</label>
                  <input
                    type="text"
                    required
                    value={addrTitle}
                    onChange={(e) => setAddrTitle(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: المنزل، المكتب، الشاليه" : "Home, Work, etc."}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "اسم المستلم" : "Recipient Name"}</label>
                  <input
                    type="text"
                    required
                    value={addrRecipient}
                    onChange={(e) => setAddrRecipient(e.target.value)}
                    placeholder={lang === "ar" ? "الاسم الكامل للمستلم" : "Recipient Full Name"}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "رقم هاتف المستلم" : "Recipient Phone"}</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  placeholder="+20 1X XXX XXXX / +966 5X XXX XXXX"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الدولة" : "Country"}</label>
                  <select
                    value={addrCountry}
                    onChange={(e) => {
                      setAddrCountry(e.target.value);
                      const c = GULF_COUNTRIES.find((x) => x.nameAr === e.target.value);
                      if (c && c.cities.length > 0 && c.cities[0]) setAddrCity(c.cities[0]);
                    }}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    {GULF_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.nameAr}>{c.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "المدينة" : "City"}</label>
                  <select
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    {selectedCountryObj?.cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الحي / المنطقة" : "District"}</label>
                  <input
                    type="text"
                    required
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: التجمع الخامس / حي النرجس" : "District name"}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الرمز البريدي (اختياري)" : "Postal Code"}</label>
                  <input
                    type="text"
                    value={addrPostal}
                    onChange={(e) => setAddrPostal(e.target.value)}
                    placeholder="12345"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الشارع والوصف التفصيلي" : "Street & Building"}</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder={lang === "ar" ? "اسم الشارع، رقم المبنى أو الفيلا" : "Street name, building/villa #"}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="h-4 w-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="defaultCheck" className="text-xs text-foreground font-semibold cursor-pointer">
                  {lang === "ar" ? "تعيين كعنوان شحن افتراضي لطلباتي" : "Set as default shipping address"}
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90 cursor-pointer"
                >
                  {lang === "ar" ? "حفظ العنوان" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
