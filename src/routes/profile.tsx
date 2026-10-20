import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const GULF_COUNTRIES = [
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
    setUser,
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
  } = useStore();

  const [activeTab, setActiveTab] = useState<"addresses" | "info" | "activity">("addresses");

  // Profile Edit State
  const [name, setName] = useState(user?.name || "سعد بن محمد القحطاني");
  const [email, setEmail] = useState(user?.email || "saad.alqahtani@example.com");
  const [phone, setPhone] = useState(user?.phone || "+966 50 123 4567");
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({ name, email, phone });
    } else {
      setUser({
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

  // New Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrTitle, setAddrTitle] = useState("المنزل");
  const [addrRecipient, setAddrRecipient] = useState(user?.name || "");
  const [addrPhone, setAddrPhone] = useState(user?.phone || "");
  const [addrCountry, setAddrCountry] = useState(GULF_COUNTRIES[0].nameAr);
  const [addrCity, setAddrCity] = useState(GULF_COUNTRIES[0].cities[0]);
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
      city: addrCity,
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
    <main className="mx-auto max-w-6xl px-4 py-8">
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
        <span className="text-foreground font-medium">{lang === "ar" ? "حسابي وعناويني" : "My Account"}</span>
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
                className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground shadow-xs hover:opacity-90"
              >
                {lang === "ar" ? "تسجيل الدخول / إنشاء حساب" : "Sign In / Register"}
              </button>
            ) : (
              <button
                onClick={() => setUser(null)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{lang === "ar" ? "تسجيل الخروج" : "Log Out"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border">
          <Link to="/orders" className="rounded-2xl border border-border bg-card p-3.5 hover:border-gold/50 transition">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{lang === "ar" ? "طلباتي النشطة" : "My Orders"}</span>
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

          <div className="rounded-2xl border border-border bg-card p-3.5">
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
            <p className="mt-1 text-xs font-bold text-gold">{lang === "ar" ? "إدارة متاجري ↗" : "Sell on BAX ↗"}</p>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border text-xs font-bold">
        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition ${
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
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition ${
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
          className={`flex items-center gap-1.5 pb-3 px-4 border-b-2 transition ${
            activeTab === "activity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>{lang === "ar" ? "سجل النشاط والمتابعات" : "Activity & Stores"}</span>
        </button>
      </div>

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
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === "ar" ? "إضافة عنوان شحن جديد" : "Add New Address"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                  addr.isDefault
                    ? "border-primary/40 bg-card shadow-xs ring-1 ring-primary/20"
                    : "border-border bg-card/60 hover:border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {addr.title.includes("عمل") || addr.title.toLowerCase().includes("work") ? (
                          <Briefcase className="h-3.5 w-3.5" />
                        ) : (
                          <Home className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">{addr.title}</h3>
                    </div>

                    {addr.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                        <Check className="h-3 w-3" />
                        {lang === "ar" ? "العنوان الافتراضي" : "Default Address"}
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-primary transition underline"
                      >
                        {lang === "ar" ? "تعيين كافتراضي" : "Make Default"}
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">{addr.recipientName}</p>
                    <p>{addr.street}، {addr.district}</p>
                    <p>{addr.city}، {addr.country} {addr.postalCode ? `(${addr.postalCode})` : ""}</p>
                    <p className="text-foreground/80 font-mono mt-1">{addr.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    {lang === "ar" ? "شحن سريع متاح ⚡" : "Express delivery eligible"}
                  </span>
                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive hover:underline p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{lang === "ar" ? "حذف" : "Delete"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Profile Info & Preferences */}
      {activeTab === "info" && (
        <div className="mt-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "تعديل البيانات الشخصية" : "Edit Personal Details"}</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div>
              <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "رقم الجوال" : "Mobile Phone"}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "العملة المفضلة" : "Preferred Currency"}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                >
                  {Object.keys(RATES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "لغة الواجهة" : "Interface Language"}</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="ar">العربية (Arabic)</option>
                  <option value="en">English (الإنجليزية)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-gold px-6 py-2.5 text-xs font-black text-gold-foreground shadow hover:opacity-90 transition cursor-pointer"
              >
                {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Activity & Quick Navigation */}
      {activeTab === "activity" && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-2">{lang === "ar" ? "مركز النشاط الشخصي" : "Account Shortcuts"}</h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ar" ? "الوصول السريع لجميع خدماتك وعملياتك في منصة باكس." : "Quick access to your BAX marketplace services."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/orders"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "شحناتي وطلباتي" : "My Orders"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "تتبع فواتيرك وشحناتك الحالية" : "Track packages & receipts"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rtl:rotate-180" />
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-gold/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lang === "ar" ? "قائمة الرغبات" : "Saved Items"}</h3>
                  <p className="text-[11px] text-muted-foreground">{lang === "ar" ? "المنتجات المحفوظة لشرائها لاحقاً" : "Items for later"}</p>
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
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
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
                  placeholder="+966 5X XXX XXXX"
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
                      if (c && c.cities.length > 0) setAddrCity(c.cities[0]);
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
                    {selectedCountryObj.cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الحي" : "District"}</label>
                  <input
                    type="text"
                    required
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: حي النرجس / الورود" : "District name"}
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
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
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