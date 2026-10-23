import { useState } from "react";
import { useStore, type UserRole, type User } from "@/lib/store";
import { X, Store, ShoppingBag, ShieldCheck, LogIn, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, logout, switchRole, lang } = useStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("seller");
  const [storeName, setStoreName] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: "usr_" + Date.now(),
      name: name || (lang === "ar" ? "مستخدم جديد" : "New User"),
      email: email || "user@souqly.market",
      role,
      ...(role === "seller" ? { storeName: storeName || (lang === "ar" ? "متجر سوقلي" : "Souqly Store") } : {}),
    };
    login(newUser);
    setIsAuthModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: User = {
      id: "usr_" + Date.now(),
      name: name || (lang === "ar" ? "عبدالله العرابي" : "Orabi User"),
      email: email || "orabi@souqly.market",
      role: role || "seller",
      ...((role === "seller" || storeName) ? { storeName: storeName || (lang === "ar" ? "متجر سوقلي للتكنولوجيا" : "Souqly Tech Store") } : {}),
    };
    login(loggedUser);
    setIsAuthModalOpen(false);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === "seller") {
      login({
        id: "demo_seller",
        name: "عبدالله العرابي (تاجر)",
        email: "orabi.seller@souqly.market",
        role: "seller",
        storeName: "متجر سوقلي للتكنولوجيا الفاخرة",
        phone: "+966501234567",
      });
    } else if (demoRole === "admin") {
      login({
        id: "demo_admin",
        name: "عبدالله العرابي (مشرف المنصة)",
        email: "admin@souqly.market",
        role: "admin",
        phone: "+966500000000",
      });
    } else {
      login({
        id: "demo_buyer",
        name: "محمد الأحمد (مشتري)",
        email: "mohammed@souqly.market",
        role: "buyer",
        phone: "+966559876543",
      });
    }
    setIsAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-border"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 start-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {user ? (
              /* Profile / Current User View */
              <div className="text-center pt-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {user.role === "seller" ? <Store className="h-7 w-7" /> : <ShoppingBag className="h-7 w-7" />}
                </div>
                <h3 className="font-display mt-3 text-xl font-bold">{user.name}</h3>
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
                      className={`flex-1 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
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
                      className={`flex-1 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
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
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={logout}
                    className="flex-1 rounded-lg border border-destructive/40 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 cursor-pointer transition"
                  >
                    {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 cursor-pointer transition font-display"
                  >
                    {lang === "ar" ? "متابعة" : "Continue"}
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Login & Registration Form */
              <div>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-slate-950 font-black text-xl font-display shadow-sm">
                    S
                  </div>
                  <h2 className="font-display mt-2 text-xl font-black">
                    {tab === "login"
                      ? lang === "ar"
                        ? "تسجيل الدخول إلى سوقلي"
                        : "Sign in to Souqly"
                      : lang === "ar"
                      ? "إنشاء حساب جديد على سوقلي"
                      : "Create Souqly Account"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "ar"
                      ? "سوق مصر والخليج الشامل للمشتري والتاجر"
                      : "Egypt & Gulf's comprehensive marketplace"}
                  </p>
                </div>

                {/* Quick Demo Buttons for fast review */}
                <div className="mt-4 rounded-xl bg-secondary/50 p-3">
                  <p className="text-xs font-semibold text-muted-foreground text-center mb-2">
                    ⚡ {lang === "ar" ? "تجربة سريعة بدون إدخال بيانات:" : "Quick Demo Mode:"}
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleQuickDemo("seller")}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gold py-1.5 text-xs font-bold text-slate-950 hover:opacity-90 cursor-pointer shadow-xs font-display"
                    >
                      <Store className="h-3.5 w-3.5" />
                      {lang === "ar" ? "تاجر" : "Seller"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleQuickDemo("buyer")}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer shadow-xs font-display"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {lang === "ar" ? "مشتري" : "Buyer"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => handleQuickDemo("admin")}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary border border-border py-1.5 text-xs font-bold text-foreground hover:bg-muted cursor-pointer shadow-xs font-display"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                      {lang === "ar" ? "مدير" : "Admin"}
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex border-b border-border">
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className={`flex-1 pb-2 text-sm font-bold transition border-b-2 cursor-pointer font-display ${
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
                    className={`flex-1 pb-2 text-sm font-bold transition border-b-2 cursor-pointer font-display ${
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
                          className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition cursor-pointer ${
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
                          className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition cursor-pointer ${
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

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow hover:opacity-90 cursor-pointer font-display"
                  >
                    {tab === "login"
                      ? lang === "ar"
                        ? "دخول"
                        : "Sign In"
                      : lang === "ar"
                      ? "إنشاء الحساب والبدء"
                      : "Create Account"}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
