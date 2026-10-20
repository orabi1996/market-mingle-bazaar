import { useState } from "react";
import { useStore, type UserRole } from "@/lib/store";
import { X, Store, ShoppingBag, ShieldCheck, LogIn, UserCheck } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, logout, switchRole, lang } = useStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("seller");
  const [storeName, setStoreName] = useState("");

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: "usr_" + Date.now(),
      name: name || (lang === "ar" ? "مستخدم جديد" : "New User"),
      email: email || "user@bax.market",
      role,
      storeName: role === "seller" ? storeName || (lang === "ar" ? "متجر باكس" : "BAX Store") : undefined,
    });
    setIsAuthModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: "usr_" + Date.now(),
      name: name || (lang === "ar" ? "عبدالله العرابي" : "Orabi User"),
      email: email || "orabi@bax.market",
      role: role || "seller",
      storeName: (role === "seller" ? storeName : undefined) || (lang === "ar" ? "متجر باكس للتكنولوجيا" : "BAX Tech Store"),
    });
    setIsAuthModalOpen(false);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === "seller") {
      login({
        id: "demo_seller",
        name: "عبدالله العرابي (تاجر)",
        email: "orabi.seller@bax.market",
        role: "seller",
        storeName: "متجر باكس للتكنولوجيا الفاخرة",
        phone: "+966501234567",
      });
    } else if (demoRole === "admin") {
      login({
        id: "demo_admin",
        name: "عبدالله العرابي (مشرف المنصة)",
        email: "admin@bax.market",
        role: "admin",
        phone: "+966500000000",
      });
    } else {
      login({
        id: "demo_buyer",
        name: "محمد الأحمد (مشتري)",
        email: "mohammed@bax.market",
        role: "buyer",
        phone: "+966559876543",
      });
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-border">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 start-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {user ? (
          /* Profile / Current User View */
          <div className="text-center pt-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              {user.role === "seller" ? <Store className="h-7 w-7" /> : <ShoppingBag className="h-7 w-7" />}
            </div>
            <h3 className="mt-3 text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.storeName && (
              <p className="mt-1 text-xs font-semibold text-gold">🏪 {user.storeName}</p>
            )}

            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-start">
              <span className="text-xs font-medium text-muted-foreground">
                {lang === "ar" ? "نوع الحساب والصلاحية:" : "Account Role & Access:"}
              </span>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => switchRole("buyer")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                    user.role === "buyer"
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-background text-foreground border border-input"
                  }`}
                >
                  {lang === "ar" ? "حساب مشتري" : "Buyer Account"}
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("seller")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                    user.role === "seller"
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-background text-foreground border border-input"
                  }`}
                >
                  {lang === "ar" ? "حساب تاجر" : "Seller Account"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={logout}
                className="flex-1 rounded-lg border border-destructive/40 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
              >
                {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
              </button>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {lang === "ar" ? "متابعة" : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          /* Login & Registration Form */
          <div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl">
                BAX
              </div>
              <h2 className="mt-2 text-xl font-bold">
                {tab === "login"
                  ? lang === "ar"
                    ? "تسجيل الدخول إلى باكس"
                    : "Sign in to BAX"
                  : lang === "ar"
                  ? "إنشاء حساب جديد على باكس"
                  : "Create BAX Account"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar"
                  ? "سوقك الخليجي الشامل للمشتري والتاجر"
                  : "Gulf's comprehensive marketplace for buyers & sellers"}
              </p>
            </div>

            {/* Quick Demo Buttons for fast review */}
            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <p className="text-xs font-semibold text-muted-foreground text-center mb-2">
                ⚡ {lang === "ar" ? "تجربة سريعة بدون إدخال بيانات:" : "Quick Demo Mode:"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("seller")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gold py-1.5 text-xs font-bold text-gold-foreground hover:opacity-90"
                >
                  <Store className="h-3.5 w-3.5" />
                  {lang === "ar" ? "تاجر" : "Seller"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("buyer")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {lang === "ar" ? "مشتري" : "Buyer"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary border border-border py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  {lang === "ar" ? "مدير" : "Admin"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex border-b border-border">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 pb-2 text-sm font-bold transition border-b-2 ${
                  tab === "login"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`flex-1 pb-2 text-sm font-bold transition border-b-2 ${
                  tab === "register"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "ar" ? "إنشاء حساب" : "Register"}
              </button>
            </div>

            <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="mt-4 space-y-3">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-medium text-foreground">
                    {lang === "ar" ? "الاسم بالكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: عبدالله العرابي" : "e.g. John Doe"}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-foreground">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orabi@example.com"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">
                  {lang === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  defaultValue="••••••••"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {tab === "register" && (
                <div>
                  <label className="text-xs font-medium text-foreground">
                    {lang === "ar" ? "نوع الحساب" : "Account Type"}
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("buyer")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition ${
                        role === "buyer"
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-input bg-background hover:bg-muted"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {lang === "ar" ? "مشتري (تسوق)" : "Buyer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("seller")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition ${
                        role === "seller"
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-input bg-background hover:bg-muted"
                      }`}
                    >
                      <Store className="h-4 w-4" />
                      {lang === "ar" ? "تاجر (بيع منتجاتك)" : "Seller"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "register" && role === "seller" && (
                <div>
                  <label className="text-xs font-medium text-foreground">
                    {lang === "ar" ? "اسم المتجر التجاري" : "Store Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder={lang === "ar" ? "مثال: متجر النخبة للتجارة" : "e.g. Elite Bazaar"}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90"
              >
                {tab === "login"
                  ? lang === "ar"
                    ? "دخول"
                    : "Sign In"
                  : lang === "ar"
                  ? "إنشاء الحساب والبدء"
                  : "Create Account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
