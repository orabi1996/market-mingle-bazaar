import { Link } from "@tanstack/react-router";
import { useStore, RATES, type Currency } from "@/lib/store";

export function Header() {
  const { t, lang, setLang, currency, setCurrency, cart } = useStore();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <header className="sticky top-0 z-30 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Souq<span className="text-gold">ly</span>
        </Link>
        <input
          placeholder={t.search}
          className="hidden flex-1 rounded-lg bg-background px-4 py-2 text-sm text-foreground outline-none ring-gold focus:ring-2 md:block"
        />
        <div className="ms-auto flex items-center gap-3 text-sm">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="rounded-md bg-primary px-1 py-1 text-primary-foreground outline-none"
          >
            {Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="rounded-md border border-primary-foreground/30 px-2 py-1">
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <Link to="/sell" className="hidden sm:inline hover:text-gold">{t.sell}</Link>
          <Link to="/cart" className="rounded-lg bg-gold px-3 py-1.5 font-semibold text-gold-foreground">
            {t.cart} ({count})
          </Link>
        </div>
      </div>
    </header>
  );
}
