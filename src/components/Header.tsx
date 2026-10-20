import { Link, useNavigate } from "@tanstack/react-router";
import { useStore, RATES, type Currency } from "@/lib/store";
import {
  Search,
  ShoppingCart,
  User,
  Store,
  Menu,
  ChevronDown,
  Globe,
  Sparkles,
  MapPin,
  Package,
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const {
    t,
    lang,
    setLang,
    currency,
    setCurrency,
    cart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    user,
    setIsAuthModalOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const categories = [
    { id: "all", label: { ar: "جميع الأقسام", en: "All Departments" } },
    { id: "إلكترونيات", label: { ar: "إلكترونيات", en: "Electronics" } },
    { id: "عطور", label: { ar: "عطور وجمال", en: "Perfumes" } },
    { id: "أزياء", label: { ar: "أزياء وموضة", en: "Fashion" } },
    { id: "المنزل", label: { ar: "المنزل والمطبخ", en: "Home" } },
    { id: "رياضة", label: { ar: "رياضة ولياقة", en: "Sports" } },
  ];

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-1.5 hover:bg-white/10 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-primary font-black text-xl tracking-tight shadow">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black tracking-tight leading-none text-white">
              BAX<span className="text-gold text-sm font-normal ms-1">.market</span>
            </span>
            <span className="text-[10px] text-white/70 tracking-widest hidden sm:inline">
              {lang === "ar" ? "سوق الخليج الشامل" : "GULF MARKETPLACE"}
            </span>
          </div>
        </Link>

        {/* Gulf Delivery Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-white/80 border-s border-white/15 ps-4">
          <MapPin className="h-4 w-4 text-gold shrink-0" />
          <div className="leading-tight">
            <div className="text-[10px] text-white/60">{lang === "ar" ? "التوصيل إلى" : "Deliver to"}</div>
            <div className="font-bold text-white">{lang === "ar" ? "المملكة والخليج" : "Saudi & Gulf"}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center max-w-2xl mx-auto">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-lg bg-background py-2 ps-4 pe-10 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-gold transition focus:ring-2"
            />
            <div className="absolute end-1 flex items-center">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-gold-foreground hover:opacity-90"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Menus */}
        <div className="flex items-center gap-2 sm:gap-4 text-sm shrink-0">
          {/* Currency Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 text-xs">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Currency"
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            >
              {Object.keys(RATES).map((c) => (
                <option key={c} value={c} className="text-foreground bg-background">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1 rounded-lg border border-white/20 px-2 py-1 text-xs font-semibold hover:bg-white/10"
          >
            <Globe className="h-3.5 w-3.5 text-gold" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* User Account / Auth */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-white/10 text-start"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
              {user?.role === "seller" ? <Store className="h-4 w-4 text-gold" /> : <User className="h-4 w-4" />}
            </div>
            <div className="hidden md:flex flex-col text-xs leading-tight">
              <span className="text-[10px] text-white/70">
                {user ? `${t.hello}، ${user.name.split(" ")[0]}` : t.login}
              </span>
              <span className="font-bold text-white flex items-center gap-0.5">
                {user ? (user.role === "seller" ? t.seller : t.buyer) : t.account}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </span>
            </div>
          </button>

          {/* Seller Central Link */}
          <Link
            to="/sell"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold text-gold hover:bg-gold/25"
          >
            <Store className="h-3.5 w-3.5" />
            <span>{t.sell}</span>
          </Link>

          {/* Admin Link */}
          <Link
            to="/admin"
            className="hidden lg:flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90 hover:bg-white/20"
          >
            <span>{t.admin}</span>
          </Link>

          {/* Orders Link */}
          <Link
            to="/orders"
            className="hidden sm:flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Package className="h-3.5 w-3.5 text-gold" />
            <span>{t.orders}</span>
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-lg bg-gold px-3 py-1.5 font-bold text-gold-foreground shadow-sm hover:opacity-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">{t.cart}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-black text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary Bar: Categories Navigation (Amazon-style) */}
      <div className="border-t border-white/15 bg-primary/95 text-xs">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-md px-3 py-1 transition font-medium ${
                  isActive
                    ? "bg-gold text-gold-foreground font-bold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label[lang]}
              </button>
            );
          })}

          <div className="ms-auto flex items-center gap-4 text-gold shrink-0">
            <span className="flex items-center gap-1 font-semibold text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {t.freeShipping}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/20 bg-primary p-4 md:hidden text-sm space-y-3">
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 font-bold text-gold border-b border-white/10"
          >
            <Store className="h-4 w-4" />
            <span>{t.sell} ({t.sellerDashboard})</span>
          </Link>
          <div className="py-2 text-xs font-semibold text-white/60">{t.categories}</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-lg p-2 text-start text-xs ${
                  selectedCategory === cat.id ? "bg-gold text-gold-foreground font-bold" : "bg-white/10 text-white"
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
