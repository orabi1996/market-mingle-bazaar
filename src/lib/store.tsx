import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type Lang = "ar" | "en";
export type Currency = "EGP" | "SAR" | "AED" | "KWD" | "QAR" | "BHD" | "OMR" | "USD";
export type UserRole = "buyer" | "seller" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  walletBalance?: number;
};

export type ShippingAddress = {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  street: string;
  postalCode?: string;
  isDefault: boolean;
};

export type StoreInfo = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  isVerified: boolean;
  status: "active" | "suspended";
  productsCount: number;
  totalSales: number;
  createdAt: string;
  bio?: { ar: string; en: string };
  city?: string;
  country?: string;
  rating?: number;
};

// Approximate rates from SAR (base)
export const RATES: Record<Currency, number> = {
  EGP: 13.2,
  SAR: 1,
  AED: 0.98,
  KWD: 0.082,
  QAR: 0.97,
  BHD: 0.1,
  OMR: 0.103,
  USD: 0.27,
};

export type Product = {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  seller: string;
  sellerId?: string;
  stock?: number;
  desc: { ar: string; en: string };
};

export type OrderItem = {
  productId: string;
  name: { ar: string; en: string };
  quantity: number;
  price: number;
  image: string;
  seller: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  country: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  currency: Currency;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "return_requested" | "returned";
  cancelReason?: string;
  cancelDate?: string;
  returnReason?: string;
  returnNotes?: string;
  returnDate?: string;
  returnTrackingNumber?: string;
  refundMethod?: "wallet" | "original_payment";
  refundAmount?: number;
};

export type WalletTransaction = {
  id: string;
  title: { ar: string; en: string };
  date: string;
  amount: number;
  type: "credit" | "debit";
  orderId?: string;
  note?: string;
};

export type SellerPayout = {
  id: string;
  storeId: string;
  amount: number;
  currency: Currency;
  method: "instapay" | "vodafone_cash" | "bank_iban";
  destination: string;
  status: "completed" | "processing";
  date: string;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
};

export type Coupon = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  description: { ar: string; en: string };
};

export const INITIAL_ADDRESSES: ShippingAddress[] = [
  {
    id: "addr_1",
    title: "المنزل - القاهرة الجديدة",
    recipientName: "أحمد مصطفى العربي",
    phone: "+201012345678",
    country: "جمهورية مصر العربية",
    city: "القاهرة",
    district: "التجمع الخامس",
    street: "شارع التسعين الجنوبي، مجمع الياسمين",
    postalCode: "11835",
    isDefault: true,
  },
  {
    id: "addr_2",
    title: "مكتب الإسكندرية",
    recipientName: "أحمد مصطفى العربي",
    phone: "+201298765432",
    country: "جمهورية مصر العربية",
    city: "الإسكندرية",
    district: "سموحة",
    street: "طريق 14 مايو، برج الصفوة",
    postalCode: "21615",
    isDefault: false,
  },
  {
    id: "addr_3",
    title: "فرع الرياض",
    recipientName: "أحمد مصطفى العربي",
    phone: "+966501234567",
    country: "المملكة العربية السعودية",
    city: "الرياض",
    district: "حي النرجس",
    street: "طريق عثمان بن عفان، فيلا 18",
    postalCode: "13324",
    isDefault: false,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: "MASR10",
    discountType: "percentage",
    discountValue: 10,
    description: { ar: "خصم 10% ترحيبي لعملاء السوق المصري", en: "10% off for Egypt customers" },
  },
  {
    code: "CAIRO50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 250,
    description: { ar: "خصم 50 ر.س / 650 ج.م للطلبات فوق 250", en: "50 discount on orders above 250" },
  },
  {
    code: "SOUQLY10",
    discountType: "percentage",
    discountValue: 10,
    description: { ar: "خصم 10% على إجمالي الطلب", en: "10% off entire order" },
  },
  {
    code: "GULF50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 300,
    description: { ar: "خصم 50 ر.س للطلبات أكثر من 300 ر.س", en: "50 SAR off orders above 300 SAR" },
  },
  {
    code: "WELCOME",
    discountType: "percentage",
    discountValue: 15,
    description: { ar: "خصم 15% ترحيبي لطلبك الأول", en: "15% welcome discount" },
  },
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_1",
    title: { ar: "رصيد ترحيبي بمناسبة تدشين منصة سوقلي مصر والخليج", en: "Welcome Platform Credit" },
    date: "2026-04-01",
    amount: 150,
    type: "credit",
  },
  {
    id: "tx_2",
    title: { ar: "استرداد فوري لإلغاء طلب سابق ORD-9102", en: "Instant refund for cancelled order ORD-9102" },
    date: "2026-04-12",
    amount: 350,
    type: "credit",
    orderId: "ORD-9102",
  },
];

export const INITIAL_SELLER_PAYOUTS: SellerPayout[] = [
  {
    id: "PAY-1042",
    storeId: "seller_cairo_tech",
    amount: 3500,
    currency: "EGP",
    method: "instapay",
    destination: "cairo.tech@instapay",
    status: "completed",
    date: "2026-04-15",
  },
  {
    id: "PAY-1041",
    storeId: "seller_nile_cotton",
    amount: 2200,
    currency: "EGP",
    method: "vodafone_cash",
    destination: "01099887766",
    status: "completed",
    date: "2026-04-10",
  },
];


export type Notification = {
  id: string;
  title: { ar: string; en: string };
  message: { ar: string; en: string };
  time: string;
  read: boolean;
  type: "order" | "deal" | "system" | "seller";
  link?: string;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    title: { ar: "شحنتك في الطريق إليك!", en: "Your shipment is on the way!" },
    message: { ar: "خرجت شحنة الطلب ORD-9421 مع مندوب التوصيل في الرياض.", en: "Order ORD-9421 is out for delivery." },
    time: "منذ 15 دقيقة",
    read: false,
    type: "order",
    link: "/orders",
  },
  {
    id: "notif_2",
    title: { ar: "كوبون خصم حصري لك", en: "Exclusive promo coupon!" },
    message: { ar: "استخدم كود SOUQLY10 واحصل على خصم 10% على جميع الإلكترونيات.", en: "Use code SOUQLY10 for 10% off." },
    time: "منذ ساعتين",
    read: false,
    type: "deal",
    link: "/cart",
  },
  {
    id: "notif_3",
    title: { ar: "تم توثيق متجرك التجاري", en: "Your store is now verified" },
    message: { ar: "حصل متجرك على شارة التوثيق الذهبية في مركز البائعين.", en: "Your store has received verified badge." },
    time: "منذ يوم",
    read: true,
    type: "seller",
    link: "/sell",
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    productId: "1",
    author: "عمر الغامدي",
    rating: 5,
    comment: "سماعة ممتازة جداً، العزل الصوتي خيالي والبطارية تجلس أيام بدون شحن. تستاهل كل ريال!",
    date: "2026-03-28",
    isVerifiedBuyer: true,
  },
  {
    id: "rev_2",
    productId: "1",
    author: "محمد الشمري",
    rating: 5,
    comment: "توصيل سريع خلال 24 ساعة للرياض، وجودة المايك واضحة جداً في الاجتماعات.",
    date: "2026-04-02",
    isVerifiedBuyer: true,
  },
  {
    id: "rev_3",
    productId: "2",
    author: "نورة السبيعي",
    rating: 5,
    comment: "ريحة العود فاخرة وفوحان وثبات يدوم يومين، هدية ممتازة للمناسبات.",
    date: "2026-03-15",
    isVerifiedBuyer: true,
  },
  {
    id: "rev_4",
    productId: "3",
    author: "خالد الكواري",
    rating: 4,
    comment: "ساعة ذكية ممتازة وتطبيقها على الجوال سهل وسريع التزامن وشاشتها واضحة تحت الشمس.",
    date: "2026-04-10",
    isVerifiedBuyer: true,
  },
  {
    id: "rev_5",
    productId: "5",
    author: "ماجد الدوسري",
    rating: 5,
    comment: "ماكينة قهوة احترافية، استخلاص الإسبريسو ممتاز وتبخير الحليب مثل المقاهي تماماً.",
    date: "2026-04-05",
    isVerifiedBuyer: true,
  },
];

export const INITIAL_STORES: StoreInfo[] = [
  {
    id: "seller_cairo_tech",
    name: "Cairo Techno - تكنو القاهرة",
    owner: "محمود الشربيني",
    email: "cairo.tech@souqly.market",
    phone: "+201001234567",
    category: "إلكترونيات",
    isVerified: true,
    status: "active",
    productsCount: 24,
    totalSales: 125000,
    createdAt: "2026-01-10",
    city: "القاهرة",
    country: "جمهورية مصر العربية",
    rating: 4.9,
    bio: {
      ar: "الموزع الأول للأجهزة الذكية والإلكترونيات الأصلية في مصر مع ضمان الوكيل المعتمد وشحن فوري لجميع المحافظات.",
      en: "Premier distributor of authentic smart devices and consumer electronics across Egypt with authorized warranty.",
    },
  },
  {
    id: "seller_nile_cotton",
    name: "Nile Cotton - قطن النيل الفاخر",
    owner: "شريف عبدالسلام",
    email: "cotton@souqly.market",
    phone: "+201209876543",
    category: "أزياء",
    isVerified: true,
    status: "active",
    productsCount: 16,
    totalSales: 78000,
    createdAt: "2026-01-22",
    city: "الإسكندرية",
    country: "جمهورية مصر العربية",
    rating: 4.9,
    bio: {
      ar: "منسوجات وأزياء قطنية مصرية 100% طويلة التيلة فائقة النعومة والجودة المصدرة لأرقى بيوت الأزياء العالمية.",
      en: "100% pure Egyptian extra-long staple cotton textiles, linens, and apparel of world-renowned luxury.",
    },
  },
  {
    id: "seller_techhub",
    name: "TechHub Store",
    owner: "عبدالرحمن الدوسري",
    email: "techhub@souqly.market",
    phone: "+966501112233",
    category: "إلكترونيات",
    isVerified: true,
    status: "active",
    productsCount: 18,
    totalSales: 45200,
    createdAt: "2026-01-15",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    rating: 4.9,
    bio: {
      ar: "متجر متخصص بأحدث الأجهزة الإلكترونية الذكية، ملحقات الهواتف والصوتيات الأصلية بضمان شامل وتوصيل سريع.",
      en: "Specialized in premium electronics, original smart devices and audio equipment with full warranty.",
    },
  },
  {
    id: "seller_oud",
    name: "Oud House",
    owner: "سلطان الهاجري",
    email: "oud@souqly.market",
    phone: "+966504445566",
    category: "عطور",
    isVerified: true,
    status: "active",
    productsCount: 12,
    totalSales: 28900,
    createdAt: "2026-02-01",
    city: "جدة",
    country: "المملكة العربية السعودية",
    rating: 4.9,
    bio: {
      ar: "دار العود الملكي، متخصصون في دهن العود الطبيعي البيور، البخور الفاخر، والمخلطات الشرقية التراثية.",
      en: "Royal Oud House specializing in natural pure oud, luxury frankincense, and heritage oriental perfumes.",
    },
  },
  {
    id: "seller_milano",
    name: "Milano Leather",
    owner: "فيصل الغامدي",
    email: "milano@souqly.market",
    phone: "+966507778899",
    category: "أزياء",
    isVerified: true,
    status: "active",
    productsCount: 10,
    totalSales: 16500,
    createdAt: "2026-02-18",
    city: "دبي",
    country: "الإمارات العربية المتحدة",
    rating: 4.7,
    bio: {
      ar: "أزياء وحقائب وأحذية جلدية مصنعة يدوياً بأعلى معايير الأناقة الإيطالية والخليجية الحديثة.",
      en: "Handcrafted Italian leather fashion, bags and accessories tailored for the contemporary Gulf style.",
    },
  },
  {
    id: "seller_homeplus",
    name: "Home Plus",
    owner: "أحمد المنصور",
    email: "homeplus@souqly.market",
    phone: "+966503332211",
    category: "المنزل",
    isVerified: false,
    status: "active",
    productsCount: 8,
    totalSales: 21400,
    createdAt: "2026-03-05",
    city: "الدمام",
    country: "المملكة العربية السعودية",
    rating: 4.6,
    bio: {
      ar: "أحدث مستلزمات المنزل العصري، مكائن القهوة المختصة، وأجهزة المطبخ الذكية للطهي الاحترافي.",
      en: "Modern home appliances, specialty coffee machines, and smart kitchenware for effortless living.",
    },
  },
  {
    id: "seller_runpro",
    name: "Run Pro Sports",
    owner: "طارق العتيبي",
    email: "runpro@souqly.market",
    phone: "+966508889900",
    category: "رياضة",
    isVerified: true,
    status: "active",
    productsCount: 15,
    totalSales: 19800,
    createdAt: "2026-03-20",
    city: "مدينة الكويت",
    country: "دولة الكويت",
    rating: 4.8,
    bio: {
      ar: "المتجر الأول للمعدات الرياضية، أحذية الجري الاحترافية، ومستلزمات اللياقة البدنية والتمارين المنزلية.",
      en: "Premier destination for athletic gear, running shoes, and home workout equipment.",
    },
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: { ar: "سماعة رأس لاسلكية فائقة العزل الصوتي", en: "Ultra Noise-Cancelling Wireless Headphones" },
    category: { ar: "إلكترونيات", en: "Electronics" },
    price: 899,
    oldPrice: 1199,
    rating: 4.8,
    reviews: 1420,
    image: p1,
    seller: "TechHub Store",
    sellerId: "seller_techhub",
    stock: 45,
    desc: {
      ar: "سماعة لاسلكية بتقنية عزل الضوضاء النشط المتطور، تدوم البطارية حتى 40 ساعة متواصلة مع شحن فائق السرعة وميكروفون نقي للمكالمات.",
      en: "Wireless headphones with advanced active noise cancellation, 40-hour battery life with fast charge and crystal clear microphone.",
    },
  },
  {
    id: "2",
    name: { ar: "عطر مروكي ملكي فاخر 100 مل", en: "Royal Luxury Maroki Oud Perfume 100ml" },
    category: { ar: "عطور", en: "Perfumes" },
    price: 450,
    rating: 4.9,
    reviews: 860,
    image: p2,
    seller: "Oud House",
    sellerId: "seller_oud",
    stock: 28,
    desc: {
      ar: "عطر عود مروكي طبيعي بيور مع لمسات العنبر والمسك، ثبات استثنائي يدوم لأكثر من 48 ساعة للمناسبات الفاخرة.",
      en: "Pure natural Maroki oud perfume with amber and musk notes. Exceptional 48-hour longevity for special occasions.",
    },
  },
  {
    id: "3",
    name: { ar: "ساعة ذكية رياضية بشاشة AMOLED المقاومة للماء", en: "Pro Sports AMOLED Smartwatch Waterproof" },
    category: { ar: "إلكترونيات", en: "Electronics" },
    price: 699,
    oldPrice: 849,
    rating: 4.6,
    reviews: 730,
    image: p3,
    seller: "TechHub Store",
    sellerId: "seller_techhub",
    stock: 35,
    desc: {
      ar: "تتبع دقيق لنبضات القلب، الأكسجين، جودة النوم، وأكثر من 100 وضع رياضي مختلف مع بطارية تدوم أسبوعين.",
      en: "Precision heart rate tracking, SpO2, sleep monitor and 100+ sport modes with 14-day battery life.",
    },
  },
  {
    id: "4",
    name: { ar: "حقيبة كتف جلد طبيعي إيطالي يدوية الصنع", en: "Handmade Italian Genuine Leather Shoulder Bag" },
    category: { ar: "أزياء", en: "Fashion" },
    price: 520,
    rating: 4.7,
    reviews: 312,
    image: p4,
    seller: "Milano Leather",
    sellerId: "seller_milano",
    stock: 15,
    desc: {
      ar: "مصنوعة من جلد البقر الإيطالي الفاخر يدويًا بالكامل، عملية وأنيقة تناسب اللقاءات الرسمية والاستخدام اليومي.",
      en: "Handcrafted from premium Italian full-grain leather, elegant design suitable for business and daily wear.",
    },
  },
  {
    id: "5",
    name: { ar: "ماكينة قهوة إسبريسو احترافية 20 بار", en: "Professional 20-Bar Espresso Machine" },
    category: { ar: "المنزل", en: "Home" },
    price: 1350,
    oldPrice: 1600,
    rating: 4.8,
    reviews: 415,
    image: p5,
    seller: "Home Plus",
    sellerId: "seller_homeplus",
    stock: 12,
    desc: {
      ar: "مضخة إيطالية بقوة 20 بار لاستخلاص مثالي للقهوة، مزودة بعصا تبخير الحليب لصنع الكابتشينو واللاتيه باحترافية تامة.",
      en: "20-bar Italian pump for optimal espresso extraction, equipped with commercial steam wand for rich cappuccino foam.",
    },
  },
  {
    id: "6",
    name: { ar: "حذاء رياضي خفيف ومبطن لسباقات الجري", en: "Ultra-Light Cushioned Running Shoes" },
    category: { ar: "رياضة", en: "Sports" },
    price: 380,
    rating: 4.5,
    reviews: 1040,
    image: p6,
    seller: "Run Pro Sports",
    sellerId: "seller_runpro",
    stock: 60,
    desc: {
      ar: "نعل هوائي مرن يمتص الصدمات مع نسيج شبكي يسمح بمرور الهواء، مريح جداً للجري والتمارين اليومية.",
      en: "Flexible responsive air cushioning sole with breathable mesh upper, engineered for marathon runners and fitness.",
    },
  },
  {
    id: "7",
    name: { ar: "طقم مفروشات سرير قطن مصري 100% طويل التيلة فاخر", en: "Luxury 100% Egyptian Long-Staple Cotton Bedding Set" },
    category: { ar: "أزياء", en: "Fashion" },
    price: 490,
    oldPrice: 650,
    rating: 4.9,
    reviews: 620,
    image: p4,
    seller: "Nile Cotton - قطن النيل الفاخر",
    sellerId: "seller_nile_cotton",
    stock: 40,
    desc: {
      ar: "مفروشات سرير مصنوعة من أجود أنواع القطن المصري الأصيل طويل التيلة بكثافة 600 خيط لنعومة فائقة وبرودة وانتعاش دائم.",
      en: "Luxurious 600-thread count 100% authentic Egyptian long-staple cotton sheets, naturally breathable and extraordinarily soft.",
    },
  },
  {
    id: "8",
    name: { ar: "منصة شحن لاسلكي 3 في 1 السريعة للأجهزة الذكية", en: "3-in-1 Fast Wireless Charging Station" },
    category: { ar: "إلكترونيات", en: "Electronics" },
    price: 340,
    oldPrice: 420,
    rating: 4.7,
    reviews: 480,
    image: p3,
    seller: "Cairo Techno - تكنو القاهرة",
    sellerId: "seller_cairo_tech",
    stock: 55,
    desc: {
      ar: "شاحن مكتبي متعدد لشحن الهواتف الذكية وساعات اليد والسماعات اللاسلكية معاً بسرعة 15 واط مع شريحة حماية حرارية ذكية.",
      en: "Multi-device wireless dock charging phone, smartwatch, and earbuds simultaneously with 15W intelligent safety.",
    },
  },
];

export const PRODUCTS = INITIAL_PRODUCTS;

export function getProductById(id: string): Product | undefined {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("bax-products");
      if (stored) {
        const custom: Product[] = JSON.parse(stored);
        const found = custom.find((p) => p.id === id);
        if (found) return found;
      }
    } catch {}
  }
  return INITIAL_PRODUCTS.find((p) => p.id === id);
}

const T = {
  ar: {
    brandName: "سوقلي",
    brandTag: "سوق مصر والخليج العربي الأول 🇪🇬 🇸🇦",
    search: "ابحث في ملايين المنتجات، الماركات والتجار في مصر والخليج...",
    searchButton: "بحث",
    cart: "عربة التسوق",
    sell: "مركز البائعين",
    sellCta: "بِع على سوقلي",
    admin: "إدارة المنصة",
    heroTitle: "كل ما تحتاجه، من أكبر متاجر مصر والخليج في منصة واحدة",
    heroSub: "سوقك الإلكتروني الشامل في جمهورية مصر العربية ودول الخليج. منتجات أصلية، دفع بالجنيه والريال وكافة الطرق المحلية، شحن فوري وضمان ذهبي.",
    shop: "تسوق العروض المميزة",
    deals: "عروض وصفقات اليوم المختارة",
    add: "أضف للسلة",
    addedToCart: "تمت إضافة المنتج إلى سلتك!",
    by: "البائع",
    empty: "سلة التسوق فارغة حالياً",
    startShopping: "تصفح المنتجات الآن",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    checkout: "متابعة إتمام الطلب",
    reviews: "تقييم",
    back: "العودة للمتجر",
    remove: "حذف",
    quantity: "الكمية",
    inStock: "متوفر بالمخزون",
    outOfStock: "نفذت الكمية",
    freeShipping: "شحن مجاني للطلبات فوق 200 ر.س",
    categories: "الأقسام",
    allCategories: "جميع الأقسام",
    login: "تسجيل الدخول",
    account: "حسابي",
    hello: "مرحباً",
    logout: "تسجيل الخروج",
    sellerDashboard: "لوحة تحكم البائع",
    buyer: "مشتري",
    seller: "تاجر معتمد",
    orders: "طلباتي",
    newOrders: "الطلبات الواردة",
    manageInventory: "المخزون والمنتجات",
    addNewProduct: "إضافة منتج جديد",
    saveProduct: "نشر المنتج فوراً في المتجر",
    wishlist: "المفضلة",
    emptyWishlist: "قائمة أمنياتك فارغة",
    addToWishlist: "أضف للمفضلة",
    inWishlist: "في المفضلة",
    features: {
      fastDelivery: "توصيل سريع وآمن",
      fastDeliveryDesc: "شحن لجميع محافظات مصر والخليج العربي خلال 24 - 48 ساعة",
      genuine: "منتجات أصلية 100%",
      genuineDesc: "ضمان استرداد الأموال وفحص جودة صارم",
      securePay: "دفع إلكتروني موثوق",
      securePayDesc: "فوري، محافظ كاش، ميزة، مدى، فيزا، والدفع عند الاستلام",
      support: "خدمة عملاء على مدار الساعة",
      supportDesc: "فريق دعم مخصص لخدمة المشترين والتجار",
    },
  },
  en: {
    brandName: "Souqly",
    brandTag: "Egypt & Gulf Premier Marketplace 🇪🇬 🇸🇦",
    search: "Search millions of Egyptian & Gulf products, brands and sellers...",
    searchButton: "Search",
    cart: "Cart",
    sell: "Seller Central",
    sellCta: "Sell on Souqly",
    admin: "Admin Console",
    heroTitle: "Everything You Need, From Top Egypt & Gulf Sellers",
    heroSub: "The premier multi-vendor e-commerce platform connecting Egypt and the GCC. 100% authentic items, local payments, rapid delivery & buyer guarantee.",
    shop: "Shop Featured Deals",
    deals: "Today's Top Deals & Offers",
    add: "Add to Cart",
    addedToCart: "Added to your shopping cart!",
    by: "Sold by",
    empty: "Your shopping cart is empty",
    startShopping: "Browse Products Now",
    total: "Total",
    subtotal: "Subtotal",
    checkout: "Proceed to Checkout",
    reviews: "reviews",
    back: "Back to store",
    remove: "Remove",
    quantity: "Qty",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    freeShipping: "Free shipping on orders above 200 SAR",
    categories: "Categories",
    allCategories: "All Departments",
    login: "Sign In",
    account: "My Account",
    hello: "Hello",
    logout: "Sign Out",
    sellerDashboard: "Seller Dashboard",
    buyer: "Buyer",
    seller: "Verified Seller",
    orders: "My Orders",
    newOrders: "Incoming Orders",
    manageInventory: "Products & Stock",
    addNewProduct: "Add New Product",
    saveProduct: "Publish Product to Marketplace",
    wishlist: "Wishlist",
    emptyWishlist: "Your wishlist is empty",
    addToWishlist: "Add to Wishlist",
    inWishlist: "Saved in Wishlist",
    features: {
      fastDelivery: "Fast & Safe Delivery",
      fastDeliveryDesc: "Express shipping across Egyptian governorates and the GCC within 24 - 48 hrs",
      genuine: "100% Authentic Guarantee",
      genuineDesc: "Money-back guarantee & strict quality inspection",
      securePay: "Secure Seamless Payments",
      securePayDesc: "Fawry, Mobile Wallets, Meeza, Mada, Visa, Apple Pay & Cash on Delivery",
      support: "24/7 Dedicated Support",
      supportDesc: "Specialized assistance for both buyers and merchants",
    },
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  t: typeof T.ar;
  cart: Record<string, number>;
  add: (id: string, qty?: number) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  price: (sar: number) => string;
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerSeller: (storeName: string, sellerName: string, phone: string) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  stores: StoreInfo[];
  toggleStoreVerification: (storeId: string) => void;
  toggleStoreStatus: (storeId: string) => void;
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, currentTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (currentTotal: number) => number;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addresses: ShippingAddress[];
  addAddress: (addr: Omit<ShippingAddress, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateUser: (u: Partial<User>) => void;
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  topUpWallet: (amountSar: number, methodTitle: string) => void;
  deductWallet: (amountSar: number, note: string) => boolean;
  cancelOrder: (orderId: string, reason: string, refundToWallet?: boolean) => void;
  requestReturn: (orderId: string, reason: string, notes?: string, refundToWallet?: boolean) => void;
  approveReturn: (orderId: string) => void;
  sellerPayouts: SellerPayout[];
  requestSellerPayout: (amountSar: number, method: "instapay" | "vodafone_cash" | "bank_iban", destination: string) => boolean;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [currency, setCurrency] = useState<Currency>("EGP");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>(INITIAL_STORES);
  const [commissionRate, setCommissionRateState] = useState<number>(10);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(INITIAL_ADDRESSES);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [walletBalance, setWalletBalance] = useState<number>(500);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [sellerPayouts, setSellerPayouts] = useState<SellerPayout[]>(INITIAL_SELLER_PAYOUTS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedWallet = localStorage.getItem("bax-wallet");
      if (storedWallet) setWalletBalance(Number(storedWallet));

      const storedTxs = localStorage.getItem("bax-wallet-tx");
      if (storedTxs) setWalletTransactions(JSON.parse(storedTxs));

      const storedPayouts = localStorage.getItem("bax-seller-payouts");
      if (storedPayouts) setSellerPayouts(JSON.parse(storedPayouts));

      const storedNotifs = localStorage.getItem("bax-notifications");
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      const storedCur = localStorage.getItem("bax-currency");
      if (storedCur) setCurrency(storedCur as Currency);

      const storedAddresses = localStorage.getItem("bax-addresses");
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));

      const storedWishlist = localStorage.getItem("bax-wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedReviews = localStorage.getItem("bax-reviews");
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      }

      const storedCart = localStorage.getItem("bax-cart") || localStorage.getItem("souqly-cart");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedProducts = localStorage.getItem("bax-products");
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      const storedStores = localStorage.getItem("bax-stores");
      if (storedStores) {
        const parsedStores = JSON.parse(storedStores);
        if (Array.isArray(parsedStores) && parsedStores.length > 0) {
          setStores(parsedStores);
        }
      }

      const storedComm = localStorage.getItem("bax-commission");
      if (storedComm) setCommissionRateState(Number(storedComm));

      const storedUser = localStorage.getItem("bax-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const defaultUser: User = {
          id: "demo_seller",
          name: "عبدالله العرابي",
          email: "orabi@souqly.market",
          role: "seller",
          storeName: "متجر سوقلي للتكنولوجيا",
          phone: "+966501234567",
        };
        setUser(defaultUser);
        localStorage.setItem("bax-user", JSON.stringify(defaultUser));
      }

      const storedOrders = localStorage.getItem("bax-orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const sampleOrders: Order[] = [
          {
            id: "ORD-9422",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            customerName: "أحمد مصطفى العربي",
            customerEmail: "ahmed@souqly.market",
            customerPhone: "+201012345678",
            customerAddress: "شارع التسعين الجنوبي، مجمع الياسمين",
            city: "القاهرة",
            country: "جمهورية مصر العربية",
            paymentMethod: "فودافون كاش / إنستاباي",
            items: [
              {
                productId: "7",
                name: { ar: "طقم مفروشات سرير قطن مصري 100% فاخر", en: "Luxury 100% Egyptian Cotton Bedding" },
                quantity: 1,
                price: 490,
                image: p4,
                seller: "Nile Cotton - قطن النيل الفاخر",
              },
            ],
            total: 490,
            currency: "EGP",
            status: "delivered",
          },
          {
            id: "ORD-9421",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            customerName: "سعد الشمري",
            customerEmail: "saad@example.com",
            customerPhone: "+966551239874",
            customerAddress: "حي النرجس، شارع أنس بن مالك",
            city: "الرياض",
            country: "المملكة العربية السعودية",
            paymentMethod: "بطاقة مدى (Mada)",
            items: [
              {
                productId: "1",
                name: { ar: "سماعة رأس لاسلكية فائقة العزل الصوتي", en: "Ultra Noise-Cancelling Headphones" },
                quantity: 1,
                price: 899,
                image: p1,
                seller: "TechHub Store",
              },
            ],
            total: 899,
            currency: "SAR",
            status: "processing",
          },
          {
            id: "ORD-9420",
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            customerName: "فاطمة الكعبي",
            customerEmail: "fatima@example.com",
            customerPhone: "+971509876543",
            customerAddress: "الجميرا، فيلا 24",
            city: "دبي",
            country: "الإمارات العربية المتحدة",
            paymentMethod: "Apple Pay",
            items: [
              {
                productId: "2",
                name: { ar: "عطر مروكي ملكي فاخر 100 مل", en: "Royal Luxury Maroki Oud Perfume" },
                quantity: 2,
                price: 450,
                image: p2,
                seller: "Oud House",
              },
            ],
            total: 900,
            currency: "AED",
            status: "shipped",
          },
        ];
        setOrders(sampleOrders);
        localStorage.setItem("bax-orders", JSON.stringify(sampleOrders));
      }
    } catch (e) {
      console.warn("Storage load warning:", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Cart operations
  const saveCart = (c: Record<string, number>) => {
    setCart(c);
    localStorage.setItem("bax-cart", JSON.stringify(c));
  };

  const add = (id: string, qty = 1) => {
    const next = { ...cart, [id]: (cart[id] || 0) + qty };
    saveCart(next);
  };

  const decrease = (id: string) => {
    if (!cart[id]) return;
    const next = { ...cart };
    if (next[id] <= 1) {
      delete next[id];
    } else {
      next[id] -= 1;
    }
    saveCart(next);
  };

  const remove = (id: string) => {
    const next = { ...cart };
    delete next[id];
    saveCart(next);
  };

  const clearCart = () => {
    saveCart({});
  };

  // Products operations
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("bax-products", JSON.stringify(newProducts));
  };

  const addProduct = (productData: Omit<Product, "id">): Product => {
    const newProduct: Product = {
      ...productData,
      id: "prod_" + Date.now().toString(),
      rating: 5.0,
      reviews: 1,
      stock: productData.stock ?? 25,
    };
    const next = [newProduct, ...products];
    saveProducts(next);
    return newProduct;
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    saveProducts(next);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProducts(next);
  };

  // Store administration operations
  const saveStores = (newStores: StoreInfo[]) => {
    setStores(newStores);
    localStorage.setItem("bax-stores", JSON.stringify(newStores));
  };

  const toggleStoreVerification = (storeId: string) => {
    const next = stores.map((s) => (s.id === storeId ? { ...s, isVerified: !s.isVerified } : s));
    saveStores(next);
  };

  const toggleStoreStatus = (storeId: string) => {
    const next = stores.map((s) =>
      s.id === storeId ? { ...s, status: s.status === "active" ? ("suspended" as const) : ("active" as const) } : s
    );
    saveStores(next);
  };

  const setCommissionRate = (rate: number) => {
    setCommissionRateState(rate);
    localStorage.setItem("bax-commission", String(rate));
  };

  // User & Auth operations
  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("bax-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bax-user");
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated: User = { ...user, role };
    setUser(updated);
    localStorage.setItem("bax-user", JSON.stringify(updated));
  };

  const registerSeller = (storeName: string, sellerName: string, phone: string) => {
    const updated: User = {
      id: user?.id || "seller_" + Date.now(),
      name: sellerName || user?.name || "تاجر سوقلي",
      email: user?.email || "seller@souqly.market",
      role: "seller",
      storeName,
      phone,
    };
    login(updated);
  };

  // Orders operations
  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "status">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const next = [newOrder, ...orders];
    setOrders(next);
    localStorage.setItem("bax-orders", JSON.stringify(next));
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(next);
    localStorage.setItem("bax-orders", JSON.stringify(next));
  };

  const saveReviews = (r: Review[]) => {
    setReviews(r);
    localStorage.setItem("bax-reviews", JSON.stringify(r));
  };

  const addReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: "rev_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
    };
    const nextReviews = [newReview, ...reviews];
    saveReviews(nextReviews);

    // Recalculate average rating for product
    const productReviews = nextReviews.filter((r) => r.productId === reviewData.productId);
    const avgRating = Number(
      (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    );
    updateProduct(reviewData.productId, {
      rating: avgRating,
      reviews: productReviews.length + 15,
    });
  };

  const saveWishlist = (w: string[]) => {
    setWishlist(w);
    localStorage.setItem("bax-wishlist", JSON.stringify(w));
  };

  const toggleWishlist = (productId: string) => {
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    saveWishlist(next);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon operations
  const applyCoupon = (code: string, currentTotal: number): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return {
        success: false,
        message: lang === "ar" ? "رمز الكوبون غير صحيح أو منتهي الصلاحية" : "Invalid coupon code",
      };
    }
    if (found.minOrderAmount && currentTotal < found.minOrderAmount) {
      return {
        success: false,
        message:
          lang === "ar"
            ? `الحد الأدنى لتطبيق هذا الكوبون هو ${price(found.minOrderAmount)}`
            : `Minimum order amount for this coupon is ${price(found.minOrderAmount)}`,
      };
    }
    setAppliedCoupon(found);
    return {
      success: true,
      message:
        lang === "ar"
          ? `تم تطبيق الكوبون (${found.code}): ${found.description.ar}`
          : `Coupon applied (${found.code}): ${found.description.en}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateDiscount = (currentTotal: number): number => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percentage") {
      return Math.round((currentTotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(currentTotal, appliedCoupon.discountValue);
  };

  // Notification operations
  const saveNotifications = (n: Notification[]) => {
    setNotifications(n);
    localStorage.setItem("bax-notifications", JSON.stringify(n));
  };

  const addNotification = (n: Omit<Notification, "id" | "time" | "read">) => {
    const newNotif: Notification = {
      ...n,
      id: `notif_${Date.now()}`,
      time: "الآن",
      read: false,
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  // Address operations
  const saveAddresses = (newAddrs: ShippingAddress[]) => {
    setAddresses(newAddrs);
    localStorage.setItem("bax-addresses", JSON.stringify(newAddrs));
  };

  const addAddress = (addr: Omit<ShippingAddress, "id">) => {
    const newAddr: ShippingAddress = {
      ...addr,
      id: `addr_${Date.now()}`,
    };
    let updated = [newAddr, ...addresses];
    if (newAddr.isDefault) {
      updated = updated.map((a) => (a.id === newAddr.id ? a : { ...a, isDefault: false }));
    }
    saveAddresses(updated);
  };

  const deleteAddress = (id: string) => {
    let updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveAddresses(updated);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("bax-user", JSON.stringify(updated));
  };

  
  // Wallet operations
  const saveWallet = (balance: number, txs: WalletTransaction[]) => {
    setWalletBalance(balance);
    setWalletTransactions(txs);
    localStorage.setItem("bax-wallet", String(balance));
    localStorage.setItem("bax-wallet-tx", JSON.stringify(txs));
  };

  const topUpWallet = (amountSar: number, methodTitle: string) => {
    const newBal = walletBalance + amountSar;
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      title: {
        ar: `شحن رصيد المحفظة عبر ${methodTitle}`,
        en: `Wallet top-up via ${methodTitle}`,
      },
      date: new Date().toISOString().split("T")[0],
      amount: amountSar,
      type: "credit",
      note: methodTitle,
    };
    const nextTxs = [newTx, ...walletTransactions];
    saveWallet(newBal, nextTxs);
    addNotification({
      title: { ar: "تم شحن المحفظة بنجاح", en: "Wallet Recharged" },
      message: {
        ar: `تمت إضافة ${price(amountSar)} إلى محفظتك الإلكترونية بنجاح.`,
        en: `Added ${price(amountSar)} to your digital wallet.`,
      },
      type: "system",
      link: "/profile",
    });
  };

  const deductWallet = (amountSar: number, note: string): boolean => {
    if (walletBalance < amountSar) return false;
    const newBal = walletBalance - amountSar;
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      title: {
        ar: `دفع قيمة طلب من المحفظة`,
        en: `Order payment from wallet`,
      },
      date: new Date().toISOString().split("T")[0],
      amount: amountSar,
      type: "debit",
      note,
    };
    const nextTxs = [newTx, ...walletTransactions];
    saveWallet(newBal, nextTxs);
    return true;
  };

  const cancelOrder = (orderId: string, reason: string, refundToWallet = true) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const nextOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "cancelled" as const,
            cancelReason: reason,
            cancelDate: new Date().toISOString(),
            refundMethod: refundToWallet ? ("wallet" as const) : ("original_payment" as const),
            refundAmount: o.total,
          }
        : o
    );
    setOrders(nextOrders);
    localStorage.setItem("bax-orders", JSON.stringify(nextOrders));

    if (refundToWallet) {
      const newBal = walletBalance + target.total;
      const newTx: WalletTransaction = {
        id: "tx_" + Date.now(),
        title: {
          ar: `استرداد فوري لإلغاء الطلب ${target.id}`,
          en: `Instant refund for cancelled ${target.id}`,
        },
        date: new Date().toISOString().split("T")[0],
        amount: target.total,
        type: "credit",
        orderId: target.id,
        note: reason,
      };
      saveWallet(newBal, [newTx, ...walletTransactions]);
    }

    addNotification({
      title: {
        ar: `تم إلغاء الطلب ${target.id}`,
        en: `Order ${target.id} Cancelled`,
      },
      message: {
        ar: refundToWallet
          ? `تم إلغاء طلبك واسترداد ${price(target.total)} فوراً إلى محفظة سوقلي.`
          : `تم إلغاء طلبك وسيتم إرجاع المبلغ لوسيلة الدفع الأصلية خلال 48 ساعة.`,
        en: `Your order was cancelled and refunded.`,
      },
      type: "order",
      link: "/orders",
    });
  };

  const requestReturn = (orderId: string, reason: string, notes?: string, refundToWallet = true) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const returnTracking = "RET-" + Math.floor(100000 + Math.random() * 900000);
    const nextOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "return_requested" as const,
            returnReason: reason,
            returnNotes: notes,
            returnDate: new Date().toISOString(),
            returnTrackingNumber: returnTracking,
            refundMethod: refundToWallet ? ("wallet" as const) : ("original_payment" as const),
            refundAmount: o.total,
          }
        : o
    );
    setOrders(nextOrders);
    localStorage.setItem("bax-orders", JSON.stringify(nextOrders));

    addNotification({
      title: {
        ar: `تم تقديم طلب إرجاع للطلب ${target.id}`,
        en: `Return Request Submitted for ${target.id}`,
      },
      message: {
        ar: `رقم بوليصة الإرجاع: ${returnTracking}. سيتواصل معك مندوب سوقلي إكسبريس للاستلام المجاني من باب بيتك.`,
        en: `Return tracking number: ${returnTracking}. Free courier pickup scheduled.`,
      },
      type: "order",
      link: "/orders",
    });
  };

  const approveReturn = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const nextOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "returned" as const,
          }
        : o
    );
    setOrders(nextOrders);
    localStorage.setItem("bax-orders", JSON.stringify(nextOrders));

    const newBal = walletBalance + target.total;
    const newTx: WalletTransaction = {
      id: "tx_" + Date.now(),
      title: {
        ar: `استرداد إرجاع معتمد للطلب ${target.id}`,
        en: `Refund for returned ${target.id}`,
      },
      date: new Date().toISOString().split("T")[0],
      amount: target.total,
      type: "credit",
      orderId: target.id,
    };
    saveWallet(newBal, [newTx, ...walletTransactions]);

    addNotification({
      title: {
        ar: `اكتمل الإرجاع للطلب ${target.id}`,
        en: `Return Completed for ${target.id}`,
      },
      message: {
        ar: `تم فحص واستلام الشحنة وإيداع ${price(target.total)} في محفظتك الإلكترونية بنجاح.`,
        en: `Returned items received. ${price(target.total)} credited to your wallet.`,
      },
      type: "order",
      link: "/profile",
    });
  };

  const saveSellerPayouts = (payouts: SellerPayout[]) => {
    setSellerPayouts(payouts);
    localStorage.setItem("bax-seller-payouts", JSON.stringify(payouts));
  };

  const requestSellerPayout = (
    amountSar: number,
    method: "instapay" | "vodafone_cash" | "bank_iban",
    destination: string
  ): boolean => {
    const newPayout: SellerPayout = {
      id: "PAY-" + Math.floor(1000 + Math.random() * 9000),
      storeId: user?.id || "seller",
      amount: amountSar,
      currency,
      method,
      destination,
      status: "completed",
      date: new Date().toISOString().split("T")[0],
    };
    const next = [newPayout, ...sellerPayouts];
    saveSellerPayouts(next);

    addNotification({
      title: {
        ar: `تم تحويل أرباح بقيمة ${price(amountSar)} بنجاح`,
        en: `Payout of ${price(amountSar)} processed`,
      },
      message: {
        ar: `تم تحويل المبلغ عبر ${
          method === "instapay" ? "إنستاباي (InstaPay)" : method === "vodafone_cash" ? "فودافون كاش" : "التحويل البنكي"
        } إلى ${destination}.`,
        en: `Funds transferred to ${destination}.`,
      },
      type: "seller",
      link: "/sell",
    });
    return true;
  };

  // Currency pricing helper
  const price = (sar: number) => {
    const v = sar * (RATES[currency] || 1);
    const fractionDigits = currency === "KWD" || currency === "BHD" || currency === "OMR" ? 3 : 0;
    const locale = lang === "ar" ? (currency === "EGP" ? "ar-EG" : "ar-SA") : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: fractionDigits,
    }).format(v);
  };

  return (
    <StoreCtx.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        t: T[lang],
        cart,
        add,
        decrease,
        remove,
        clearCart,
        price,
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        user,
        login,
        logout,
        switchRole,
        registerSeller,
        orders,
        createOrder,
        updateOrderStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        stores,
        toggleStoreVerification,
        toggleStoreStatus,
        commissionRate,
        setCommissionRate,
        reviews,
        addReview,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        notifications,
        addNotification,
        markAllNotificationsRead,
        markNotificationRead,
        clearNotifications,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        updateUser,
        walletBalance,
        walletTransactions,
        topUpWallet,
        deductWallet,
        cancelOrder,
        requestReturn,
        approveReturn,
        sellerPayouts,
        requestSellerPayout,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
};
