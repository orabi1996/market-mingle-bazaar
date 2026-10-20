import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Order } from "@/lib/store";
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  RotateCcw,
  ExternalLink,
  MapPin,
  CreditCard,
} from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "طلباتي ومتابعة الشحنات | BAX Orders" },
      { name: "description", content: "تتبع شحناتك ومشترياتك السابقة على متجر باكس." },
      { property: "og:title", content: "طلباتي | BAX Orders" },
      { property: "og:description", content: "تتبع شحناتك ومشترياتك السابقة على متجر باكس." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { lang, t, orders, price, add } = useStore();

  const getStepStatus = (orderStatus: Order["status"], stepIndex: number) => {
    // 0: Confirmed (pending), 1: Processing, 2: Shipped, 3: Delivered
    const statusMap = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
    const current = statusMap[orderStatus] ?? 0;
    if (current > stepIndex) return "completed";
    if (current === stepIndex) return "current";
    return "upcoming";
  };

  const steps = [
    { label: { ar: "تم تأكيد الطلب", en: "Order Placed" }, desc: { ar: "تم استلام الطلب بنجاح", en: "Received" } },
    { label: { ar: "قيد التجهيز", en: "Processing" }, desc: { ar: "التاجر يجهز الشحنة", en: "Packed by merchant" } },
    { label: { ar: "خرج للشحن", en: "Out for Delivery" }, desc: { ar: "مع مندوب التوصيل", en: "In transit" } },
    { label: { ar: "تم التوصيل", en: "Delivered" }, desc: { ar: "وصل لباب العميل", en: "Arrived at destination" } },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2.5">
            <Package className="h-7 w-7 text-gold" />
            {lang === "ar" ? "طلباتي وتتبع الشحنات" : "My Orders & Tracking"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "متابعة مباشرة لحالة جميع مشترياتك السابقة من الباب إلى الباب في كافة مدن الخليج."
              : "Track the real-time progress of your purchases across the Gulf."}
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 w-fit"
        >
          <ShoppingBag className="h-4 w-4" />
          {lang === "ar" ? "تصفح أحدث العروض" : "Browse Today's Deals"}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold">{lang === "ar" ? "لا توجد لديك طلبات سابقة حتى الآن" : "No orders found"}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {lang === "ar"
              ? "ابدأ بتصفح ملايين المنتجات والعروض المخفضة وأضفها لسلة التسوق لتصلك حتى باب منزلك."
              : "Start browsing thousands of deals and authentic products on BAX."}
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-gold px-6 py-2.5 text-xs font-bold text-gold-foreground hover:opacity-90"
          >
            {t.startShopping}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden"
            >
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-4 border-b border-border text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "رقم الطلب" : "Order ID"}</span>
                    <span className="font-mono font-bold text-foreground text-sm">{o.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "تاريخ الطلب" : "Order Date"}</span>
                    <span className="font-semibold text-foreground">
                      {new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "طريقة الدفع" : "Payment"}</span>
                    <span className="font-medium text-foreground">{o.paymentMethod}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "الإجمالي الكلي" : "Total Amount"}</span>
                    <span className="font-black text-primary text-sm">{price(o.total)}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Visual Tracking Stepper */}
              <div className="p-6 border-b border-border bg-background/50">
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Background progress connector bar */}
                  <div className="absolute top-4 start-8 end-8 h-1 bg-border -z-0 hidden sm:block"></div>

                  {steps.map((step, idx) => {
                    const status = getStepStatus(o.status, idx);
                    return (
                      <div key={idx} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition shadow-xs ${
                            status === "completed"
                              ? "bg-emerald-600 text-white ring-4 ring-emerald-500/15"
                              : status === "current"
                              ? "bg-gold text-gold-foreground ring-4 ring-gold/25 animate-pulse"
                              : "bg-muted border border-border text-muted-foreground"
                          }`}
                        >
                          {status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <span className={`mt-2 text-xs font-bold ${status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>
                          {step.label[lang]}
                        </span>
                        <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                          {step.desc[lang]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Shipping Address Details */}
              <div className="p-5 grid gap-6 md:grid-cols-3">
                {/* Items List */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs font-bold text-foreground block mb-1">
                    {lang === "ar" ? "المنتجات في هذه الشحنة:" : "Items in this shipment:"}
                  </span>
                  {o.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-2.5">
                      <img
                        src={item.image}
                        alt=""
                        className="h-14 w-14 rounded-lg object-cover bg-secondary shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/product/$id"
                          params={{ id: item.productId }}
                          className="font-semibold text-xs text-foreground hover:text-primary line-clamp-1"
                        >
                          {item.name[lang] || item.name.ar}
                        </Link>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          {t.by}: <b className="text-foreground">{item.seller}</b> • {lang === "ar" ? "الكمية:" : "Qty:"} {item.quantity}
                        </span>
                      </div>
                      <div className="text-end shrink-0">
                        <span className="font-bold text-xs text-foreground">{price(item.price * item.quantity)}</span>
                        <button
                          onClick={() => {
                            add(item.productId, item.quantity);
                            alert(lang === "ar" ? "تمت إضافة المنتج مجدداً لسلة التسوق!" : "Added back to cart!");
                          }}
                          className="block text-[11px] font-semibold text-primary hover:underline mt-1"
                        >
                          {lang === "ar" ? "شراء مجدداً" : "Buy Again"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Invoice Card */}
                <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-3 h-fit">
                  <div>
                    <span className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {lang === "ar" ? "عنوان التوصيل" : "Delivery Address"}
                    </span>
                    <p className="font-semibold text-foreground">{o.customerName}</p>
                    <p className="text-muted-foreground">{o.customerAddress}</p>
                    <p className="text-muted-foreground">{o.city}، {o.country}</p>
                    <p className="text-muted-foreground mt-0.5">{o.customerPhone}</p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{lang === "ar" ? "الفاتورة الضريبية" : "Invoice"}</span>
                    <button
                      onClick={() => alert(lang === "ar" ? `فاتورة ضريبية رسمية للطلب ${o.id} بقيمة ${price(o.total)} جاهزة للطباعة.` : `Tax invoice for ${o.id} is ready.`)}
                      className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{lang === "ar" ? "عرض الفاتورة" : "View Invoice"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
