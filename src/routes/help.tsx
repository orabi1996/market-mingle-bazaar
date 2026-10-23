import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useState } from "react";
import {
  HelpCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  FileText,
  BadgeCheck,
  ArrowRight,
  Headphones,
  Store,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "مركز المساعدة والدعم الفني | Souqly Help Center" },
      { name: "description", content: "مركز المساعدة، سياسة الشحن والاسترجاع، والضمان لعملاء مصر والخليج العربي في سوقلي." },
      { property: "og:title", content: "مركز الدعم والضمان | Souqly Marketplace" },
    ],
  }),
  component: HelpCenterPage,
});

type FaqItem = {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
  category: "shipping" | "returns" | "payments" | "seller";
};

const FAQS: FaqItem[] = [
  {
    category: "shipping",
    qAr: "كم تستغرق مدة شحن وتوصيل الطلبات في مصر والخليج؟",
    qEn: "How long does shipping take across Egypt and the Gulf?",
    aAr: "يتم توصيل الشحنات داخل القاهرة الكبرى، الجيزة، والإسكندرية، بالإضافة للرياض ودبي خلال 24 إلى 48 ساعة كحد أقصى. أما باقي محافظات مصر ومدن دول مجلس التعاون فتستغرق من يومين إلى 3 أيام عمل عبر أسطول الشحن السريع Souqly Express.",
    aEn: "Deliveries within Greater Cairo, Giza, Alexandria, Riyadh, and Dubai arrive within 24 to 48 hours. Other Egyptian governorates and Gulf cities typically take 2-3 business days via Souqly Express.",
  },
  {
    category: "returns",
    qAr: "ما هي شروط وسياسة الاسترجاع واسترداد الأموال في سوقلي؟",
    qEn: "What is Souqly's return and refund policy?",
    aAr: "تتيح منصة سوقلي إرجاع المنتجات مجاناً خلال 14 يوماً من تاريخ الاستلام في حال كان المنتج معيباً أو غير مطابق للمواصفات أو لم يعجبك، شريطة أن يكون بحالته وتغليفه الأصلي. ويتم استرداد المبلغ فور فحص المنتج خلال 3 إلى 5 أيام عمل لنفس وسيلة الدفع أو لمحفظتك الإلكترونية.",
    aEn: "Souqly offers free returns within 14 days of delivery if the item is defective, does not match description, or if you are not satisfied, provided it is in its original packaging. Refunds are processed within 3-5 business days.",
  },
  {
    category: "payments",
    qAr: "كيف يمكنني الدفع عبر فودافون كاش، إنستاباي، أو فوري في مصر؟",
    qEn: "How can I pay using Vodafone Cash, InstaPay, or Fawry?",
    aAr: "بكل سهولة! عند الوصول لخطوة الدفع في سلة الشراء، اختر 'فودافون كاش / إنستاباي' وأدخل رقم محفظتك وسيصلك إشعار تأكيد الدفع الفوري. أو اختر 'فوري' للحصول على كود دفع مرجعي وسداد القيمة عبر أقرب منفذ فوري خلال 48 ساعة.",
    aEn: "Easily! At checkout, select 'Vodafone Cash / InstaPay' and enter your wallet number to receive an instant payment request. Alternatively, choose 'Fawry' to obtain a reference payment code payable at any Fawry kiosk within 48 hours.",
  },
  {
    category: "payments",
    qAr: "ما هي وسائل الدفع المعتمدة في دول الخليج؟",
    qEn: "What payment methods are supported in the GCC?",
    aAr: "ندعم بطاقات مدى البنكية في السعودية، Apple Pay، فيزا وماستركارد، تابي وتمارا لتقسيط المشتريات على 4 دفعات بدون فوائد، بالإضافة لخدمة الدفع نقداً عند الاستلام (COD).",
    aEn: "We support Mada cards in Saudi Arabia, Apple Pay, Visa, Mastercard, Tabby & Tamara for interest-free installment splits, and Cash on Delivery (COD).",
  },
  {
    category: "seller",
    qAr: "كيف أبدأ البيع وأعرض منتجاتي كتاجر أو ماركة على منصة سوقلي؟",
    qEn: "How do I start selling as a merchant or brand on Souqly?",
    aAr: "يمكنك التوجه مباشرة إلى 'مركز البائعين' بالنقر على رابط 'بِع على سوقلي'، ثم تسجيل اسم متجرك ورقمك التجاري أو الضريبي. يتم تفعيل متجرك ومنحك شارة التوثيق والبدء في رفع المنتجات واستقبال الطلبات فوراً.",
    aEn: "Head directly to Seller Central by clicking 'Sell on Souqly', register your boutique name and commercial details. Your storefront will be activated with a verified badge to start uploading products immediately.",
  },
];

function HelpCenterPage() {
  const { lang, addNotification } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<"all" | "shipping" | "returns" | "payments" | "seller">("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket Form State
  const [ticketName, setTicketName] = useState("");
  const [ticketContact, setTicketContact] = useState("");
  const [ticketOrder, setTicketOrder] = useState("");
  const [ticketType, setTicketType] = useState("shipping");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketContact || !ticketMessage) return;

    const ticketCode = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket(ticketCode);

    addNotification({
      title: {
        ar: `تم فتح تذكرة دعم فني جديدة (#${ticketCode})`,
        en: `Support Ticket Opened (#${ticketCode})`,
      },
      message: {
        ar: `تم استلام استفسارك بنجاح وسيتواصل معك فريق خدمة عملاء سوقلي خلال 60 دقيقة.`,
        en: `Your inquiry has been received. Our support team will reach out within 60 minutes.`,
      },
      type: "system",
      link: "/help",
    });

    setTicketMessage("");
    setTicketOrder("");
  };

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = selectedCat === "all" || f.category === selectedCat;
    const matchesSearch =
      !search.trim() ||
      f.qAr.toLowerCase().includes(search.toLowerCase()) ||
      f.qEn.toLowerCase().includes(search.toLowerCase()) ||
      f.aAr.toLowerCase().includes(search.toLowerCase()) ||
      f.aEn.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="relative border-b border-border bg-gradient-to-r from-primary via-slate-900 to-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold mb-3">
            <Headphones className="h-3.5 w-3.5" />
            <span>{lang === "ar" ? "خدمة عملاء مصر والخليج العربي 🇪🇬 🇸🇦" : "Egypt & GCC Customer Care"}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {lang === "ar" ? "كيف يمكننا مساعدتك اليوم؟" : "How can we assist you today?"}
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-xs md:text-sm text-white/80 leading-relaxed">
            {lang === "ar"
              ? "ابحث في الأسئلة الشائعة، وتعرف على سياسات الشحن والضمان في مصر والخليج، أو تواصل مباشرة مع فريق الدعم الفني."
              : "Search FAQs, learn about our delivery and buyer guarantee policies, or open a live support ticket."}
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن موضوع: شحن، استرجاع، فودافون كاش، فواتير..." : "Search topics: shipping, returns, refunds, payment..."}
              className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-11 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-gold shadow-lg"
            />
            <Search className="absolute start-4 top-3.5 h-4 w-4 text-gold" />
          </div>
        </div>
      </div>

      {/* 4 Quick Category Cards */}
      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setSelectedCat("shipping");
              document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-gold/50 hover:-translate-y-1 transition group cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition mb-2">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xs text-foreground">{lang === "ar" ? "الشحن والتوصيل" : "Shipping & Delivery"}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{lang === "ar" ? "مصر والخليج (24-48 ساعة)" : "24-48h Delivery"}</p>
          </button>

          <button
            onClick={() => {
              setSelectedCat("returns");
              document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-gold/50 hover:-translate-y-1 transition group cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition mb-2">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xs text-foreground">{lang === "ar" ? "الاسترجاع والاستبدال" : "Returns & Refunds"}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{lang === "ar" ? "ضمان مجاني 14 يوماً" : "14-Day Guarantee"}</p>
          </button>

          <button
            onClick={() => {
              setSelectedCat("payments");
              document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-gold/50 hover:-translate-y-1 transition group cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold group-hover:scale-110 transition mb-2">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xs text-foreground">{lang === "ar" ? "طرق الدفع والأمان" : "Payments & Safety"}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{lang === "ar" ? "فوري، كاش، مدى، فيزا" : "Fawry, Mada, Cards"}</p>
          </button>

          <button
            onClick={() => {
              setSelectedCat("seller");
              document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-gold/50 hover:-translate-y-1 transition group cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition mb-2">
              <Store className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xs text-foreground">{lang === "ar" ? "خدمات التجار" : "Selling on Souqly"}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{lang === "ar" ? "فتح متجر والتوثيق" : "Store Verification"}</p>
          </button>
        </div>
      </div>

      {/* Main Content: FAQs & Support Ticket Form */}
      <div id="faqs" className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 mt-12 grid gap-10 lg:grid-cols-3">
        {/* FAQs Accordion (2 cols on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gold" />
                <span>{lang === "ar" ? "الأسئلة الشائعة والأكثر طلباً" : "Frequently Asked Questions"}</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar" ? "إجابات فورية ومعتمدة من فريق سياسات سوقلي." : "Instant verified answers from Souqly policies."}
              </p>
            </div>

            {/* Filter pills */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              {(["all", "shipping", "returns", "payments", "seller"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`rounded-lg px-2.5 py-1 font-bold transition cursor-pointer ${
                    selectedCat === cat
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat === "all" ? (lang === "ar" ? "الكل" : "All") : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-start text-xs md:text-sm font-bold text-foreground hover:bg-muted/30 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold text-xs font-bold">
                        ?
                      </span>
                      <span>{lang === "ar" ? faq.qAr : faq.qEn}</span>
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/50 bg-secondary/20">
                      {lang === "ar" ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guarantees Box */}
          <div className="rounded-3xl border border-gold/30 bg-gold/5 p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold text-slate-950 font-bold shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-foreground">
                  {lang === "ar" ? "ضمان سوقلي الذهبي لحماية المشتري في مصر والخليج" : "Souqly Golden Buyer Protection"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === "ar"
                    ? "أموالك في أمان تام: نحتجز قيمة المشتريات في حساب وسيط (Escrow) حتى تستلم شحنتك وتتأكد من مطابقتها للمواصفات 100%. في حال وجود أي مشكلة، نضمن استرداد أموالك بالكامل."
                    : "Your payments are protected: funds are held safely in escrow until you receive and inspect your items. Full refund guaranteed if anything is not as described."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Ticket Sidebar */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-fit space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>{lang === "ar" ? "فتح تذكرة دعم مباشر" : "Open Support Ticket"}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar" ? "فريق الدعم الفني متواجد لمساعدتك والرد خلال 60 دقيقة." : "Support team available 24/7 with 60-min response."}
            </p>
          </div>

          {submittedTicket ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
              <h4 className="font-bold text-sm text-foreground">
                {lang === "ar" ? "تم تسجيل تذكرتك بنجاح!" : "Ticket Submitted Successfully!"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {lang === "ar" ? "رقم التذكرة المرجعي:" : "Reference Ticket #:"}
              </p>
              <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-xs font-mono font-black text-primary">
                {submittedTicket}
              </span>
              <p className="text-[11px] text-muted-foreground pt-2">
                {lang === "ar" ? "سيتواصل معك ممثل خدمة العملاء عبر الهاتف أو البريد الإلكتروني." : "Our support agent will contact you shortly."}
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="mt-3 text-xs font-bold text-primary underline"
              >
                {lang === "ar" ? "إرسال استفسار آخر" : "Submit another inquiry"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "الاسم الكريم *" : "Your Name *"}</label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: حسام عادل" : "Your Name"}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "رقم الهاتف أو البريد *" : "Phone or Email *"}</label>
                <input
                  type="text"
                  required
                  value={ticketContact}
                  onChange={(e) => setTicketContact(e.target.value)}
                  placeholder="+20 1X XXXX XXXX / +966 5X XXX"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "نوع المشكلة" : "Issue Type"}</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-2.5 py-2 text-xs outline-none font-medium cursor-pointer"
                  >
                    <option value="shipping">{lang === "ar" ? "تتبع الشحنة والتوصيل" : "Shipping"}</option>
                    <option value="returns">{lang === "ar" ? "استرجاع أو استبدال" : "Returns"}</option>
                    <option value="payment">{lang === "ar" ? "فوري / كاش / مدفوعات" : "Payment"}</option>
                    <option value="seller">{lang === "ar" ? "استفسار تجار ومتاجر" : "Merchant"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "رقم الطلب (اختياري)" : "Order ID"}</label>
                  <input
                    type="text"
                    value={ticketOrder}
                    onChange={(e) => setTicketOrder(e.target.value)}
                    placeholder="ORD-9421"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">{lang === "ar" ? "تفاصيل الاستفسار أو الشكوى *" : "Details *"}</label>
                <textarea
                  rows={3}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder={lang === "ar" ? "اكتب استفسارك بالتفصيل وسيقوم فريقنا بمساعدتك..." : "Describe your inquiry..."}
                  className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-xs font-bold text-gold-foreground shadow hover:opacity-90 transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{lang === "ar" ? "إرسال التذكرة لفريق الدعم" : "Submit Ticket"}</span>
              </button>
            </form>
          )}

          {/* Quick Contacts Box */}
          <div className="pt-3 border-t border-border space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{lang === "ar" ? "الخط الساخن: 19445 (مصر) • 800-Souqly (الخليج)" : "Hotline: 19445 (EG) • 800-Souqly (GCC)"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-gold" />
              <span>support@souqly.market</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>{lang === "ar" ? "خدمة العملاء متوفرة 24/7" : "24/7 Customer Support"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}