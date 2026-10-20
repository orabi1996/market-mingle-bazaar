import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type Lang = "ar" | "en";
export type Currency = "SAR" | "AED" | "KWD" | "QAR" | "BHD" | "OMR";

// Approximate rates from SAR (demo only)
export const RATES: Record<Currency, number> = {
  SAR: 1, AED: 0.98, KWD: 0.082, QAR: 0.97, BHD: 0.1, OMR: 0.103,
};

export type Product = {
  id: string; name: { ar: string; en: string }; category: { ar: string; en: string };
  price: number; oldPrice?: number; rating: number; reviews: number; image: string;
  seller: string; desc: { ar: string; en: string };
};

export const PRODUCTS: Product[] = [
  { id: "1", name: { ar: "سماعة لاسلكية بعزل ضوضاء", en: "Noise-cancelling wireless headphones" }, category: { ar: "إلكترونيات", en: "Electronics" }, price: 899, oldPrice: 1199, rating: 4.7, reviews: 1284, image: p1, seller: "TechHub", desc: { ar: "صوت نقي وبطارية تدوم 40 ساعة.", en: "Crystal sound with 40-hour battery." } },
  { id: "2", name: { ar: "عطر عود فاخر 100 مل", en: "Luxury oud perfume 100ml" }, category: { ar: "عطور", en: "Perfumes" }, price: 450, rating: 4.9, reviews: 860, image: p2, seller: "Oud House", desc: { ar: "عود طبيعي بثبات عالٍ.", en: "Natural oud, long-lasting." } },
  { id: "3", name: { ar: "ساعة ذكية رياضية", en: "Sport smartwatch" }, category: { ar: "إلكترونيات", en: "Electronics" }, price: 699, oldPrice: 849, rating: 4.5, reviews: 532, image: p3, seller: "TechHub", desc: { ar: "تتبع النبض والنوم والخطوات.", en: "Tracks heart rate, sleep and steps." } },
  { id: "4", name: { ar: "حقيبة جلد طبيعي", en: "Genuine leather handbag" }, category: { ar: "أزياء", en: "Fashion" }, price: 520, rating: 4.6, reviews: 214, image: p4, seller: "Leather Co", desc: { ar: "جلد إيطالي مصنوع يدويًا.", en: "Handmade Italian leather." } },
  { id: "5", name: { ar: "ماكينة إسبريسو", en: "Espresso machine" }, category: { ar: "المنزل", en: "Home" }, price: 1350, oldPrice: 1600, rating: 4.8, reviews: 391, image: p5, seller: "Home Plus", desc: { ar: "ضغط 20 بار وبخار للحليب.", en: "20-bar pressure with milk steamer." } },
  { id: "6", name: { ar: "حذاء جري خفيف", en: "Lightweight running shoes" }, category: { ar: "رياضة", en: "Sports" }, price: 380, rating: 4.4, reviews: 978, image: p6, seller: "Run Pro", desc: { ar: "نعل مريح للمسافات الطويلة.", en: "Comfortable sole for long runs." } },
];

const T = {
  ar: { search: "ابحث في سوقلي...", cart: "السلة", sell: "بِع على سوقلي", heroTitle: "كل اللي تحتاجه، في سوق واحد", heroSub: "آلاف المنتجات من تجار موثوقين في الخليج، بتوصيل سريع.", shop: "تسوق الآن", deals: "عروض اليوم", add: "أضف للسلة", by: "البائع", empty: "سلتك فاضية", total: "الإجمالي", checkout: "إتمام الشراء", reviews: "تقييم", back: "رجوع للمتجر", remove: "حذف" },
  en: { search: "Search Souqly...", cart: "Cart", sell: "Sell on Souqly", heroTitle: "Everything you need, in one souq", heroSub: "Thousands of products from trusted Gulf sellers, delivered fast.", shop: "Shop now", deals: "Today's deals", add: "Add to cart", by: "Sold by", empty: "Your cart is empty", total: "Total", checkout: "Checkout", reviews: "reviews", back: "Back to store", remove: "Remove" },
};

type Ctx = {
  lang: Lang; setLang: (l: Lang) => void; currency: Currency; setCurrency: (c: Currency) => void;
  t: typeof T.ar; cart: Record<string, number>; add: (id: string) => void; remove: (id: string) => void;
  price: (sar: number) => string;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [currency, setCurrency] = useState<Currency>("SAR");
  const [cart, setCart] = useState<Record<string, number>>({});
  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("souqly-cart") || "{}")); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const save = (c: Record<string, number>) => { setCart(c); localStorage.setItem("souqly-cart", JSON.stringify(c)); };
  const add = (id: string) => save({ ...cart, [id]: (cart[id] || 0) + 1 });
  const remove = (id: string) => { const c = { ...cart }; delete c[id]; save(c); };
  const price = (sar: number) => {
    const v = sar * RATES[currency];
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", { style: "currency", currency, maximumFractionDigits: currency === "KWD" || currency === "BHD" || currency === "OMR" ? 3 : 0 }).format(v);
  };
  return <StoreCtx.Provider value={{ lang, setLang, currency, setCurrency, t: T[lang], cart, add, remove, price }}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};
