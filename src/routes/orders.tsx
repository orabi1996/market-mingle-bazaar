import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Order } from "@/lib/store";
import { useState } from "react";
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
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Printer,
  ChevronRight,
  Info,
  X,
  Wallet,
  Copy,
  Check,
  MessageCircle,
  Send,
  Smartphone,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "طلباتي، المرتجعات وتتبع الشحنات | Souqly Orders" },
      { name: "description", content: "تتبع شحناتك، إدارة المرتجعات، الإلغاء الفوري والفواتير الضريبية على سوقلي مصر والخليج." },
      { property: "og:title", content: "طلباتي والمرتجعات | Souqly Orders" },
      { property: "og:description", content: "تتبع شحناتك وإدارة طلبات الإرجاع والاستبدال مع ضمان سوقلي الذهبي." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const {
    lang,
    t,
    orders,
    price,
    add,
    cancelOrder,
    requestReturn,
    walletBalance,
    addresses,
  } = useStore();

  const [filterTab, setFilterTab] = useState<"all" | "active" | "delivered" | "returns">("all");

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("غيرت رأيي / لم أعد بحاجة للمنتج");
  const [refundToWallet, setRefundToWallet] = useState(true);

  // Return Modal State
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("المقاس أو اللون غير مطابق للمواصفات");
  const [returnNotes, setReturnNotes] = useState("");
  const [returnAddress, setReturnAddress] = useState(addresses[0]?.street || "العنوان المسجل بالطلب");
  const [returnRefundToWallet, setReturnRefundToWallet] = useState(true);

  // Invoice Modal State
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // WhatsApp & SMS Notification Modal State
  const [whatsappModalOrder, setWhatsappModalOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const getStepStatus = (orderStatus: Order["status"], stepIndex: number) => {
    // 0: Confirmed (pending), 1: Processing, 2: Shipped, 3: Delivered
    const statusMap: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
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

  const returnSteps = [
    { label: { ar: "طلب الإرجاع", en: "Return Requested" }, desc: { ar: "تم تسجيل الطلب", en: "Registered" } },
    { label: { ar: "الموافقة والفحص", en: "Inspection" }, desc: { ar: "موافقة التاجر وسوقلي", en: "Approved" } },
    { label: { ar: "استلام المندوب", en: "Courier Pickup" }, desc: { ar: "استلام مجاني من الباب", en: "Free pickup" } },
    { label: { ar: "استرداد المبلغ", en: "Refund Completed" }, desc: { ar: "إيداع في المحفظة", en: "Refund issued" } },
  ];

  const filteredOrders = orders.filter((o) => {
    if (filterTab === "all") return true;
    if (filterTab === "active") return o.status === "pending" || o.status === "processing" || o.status === "shipped";
    if (filterTab === "delivered") return o.status === "delivered";
    if (filterTab === "returns") return o.status === "cancelled" || o.status === "return_requested" || o.status === "returned";
    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    cancelOrder(cancellingOrder.id, cancelReason, refundToWallet);
    setCancellingOrder(null);
  };

  const handleConfirmReturn = () => {
    if (!returningOrder) return;
    requestReturn(returningOrder.id, returnReason, `${returnNotes} (عنوان الاستلام: ${returnAddress})`, returnRefundToWallet);
    setReturningOrder(null);
    setReturnNotes("");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2.5">
              <Package className="h-7 w-7 text-gold" />
              {lang === "ar" ? "طلباتي، المرتجعات وتتبع الشحنات" : "My Orders, Returns & Tracking"}
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
              {lang === "ar" ? "ضمان سوقلي الذهبي 🇪🇬 🇸🇦" : "Souqly Golden Guarantee"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "متابعة مباشرة للشحنات، سياسة إرجاع مجاني 14 يوماً وفق قانون حماية المستهلك، واسترداد فوري للأموال."
              : "Track live shipments, 14-day free returns compliance, and instant refunds."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold hover:bg-muted"
          >
            <Wallet className="h-4 w-4 text-gold" />
            <span>{lang === "ar" ? `المحفظة (${price(walletBalance)})` : `Wallet (${price(walletBalance)})`}</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 w-fit"
          >
            <ShoppingBag className="h-4 w-4" />
            {lang === "ar" ? "تسوق المزيد" : "Browse Deals"}
          </Link>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
        <button
          onClick={() => setFilterTab("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filterTab === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "جميع الطلبات" : "All Orders"} ({orders.length})
        </button>
        <button
          onClick={() => setFilterTab("active")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filterTab === "active"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "قيد التجهيز والتوصيل" : "Active & In Transit"} (
          {orders.filter((o) => o.status === "pending" || o.status === "processing" || o.status === "shipped").length})
        </button>
        <button
          onClick={() => setFilterTab("delivered")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filterTab === "delivered"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "تم الاستلام والتسليم" : "Delivered"} (
          {orders.filter((o) => o.status === "delivered").length})
        </button>
        <button
          onClick={() => setFilterTab("returns")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filterTab === "returns"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "ar" ? "المرتجعات والملغية" : "Returns & Cancelled"} (
          {orders.filter((o) => o.status === "cancelled" || o.status === "return_requested" || o.status === "returned").length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold">
            {lang === "ar" ? "لا توجد طلبات في هذا القسم حالياً" : "No orders found in this section"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {lang === "ar"
              ? "تصفح ملايين المنتجات والعروض المخفضة في السوق المصري ودول الخليج وأضفها لسلة التسوق."
              : "Explore thousands of products across Egypt and the Gulf on Souqly."}
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
          {filteredOrders.map((o) => {
            const isCancellable = o.status === "pending" || o.status === "processing";
            const isReturnable = o.status === "delivered";
            const isReturnRequested = o.status === "return_requested";
            const isReturned = o.status === "returned";
            const isCancelled = o.status === "cancelled";

            return (
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
                        {new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "حالة الطلب" : "Status"}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isCancelled
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                            : isReturnRequested
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : isReturned
                            ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                            : o.status === "delivered"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {isCancelled && <XCircle className="h-3 w-3" />}
                        {isReturnRequested && <Clock className="h-3 w-3" />}
                        {isReturned && <RotateCcw className="h-3 w-3" />}
                        {o.status === "delivered" && <CheckCircle2 className="h-3 w-3" />}
                        {isCancelled
                          ? lang === "ar" ? "تم إلغاء الطلب" : "Cancelled"
                          : isReturnRequested
                          ? lang === "ar" ? "طلب إرجاع قيد المعالجة" : "Return In Progress"
                          : isReturned
                          ? lang === "ar" ? "تم إرجاع الطلب واسترداد المبلغ" : "Returned & Refunded"
                          : o.status === "delivered"
                          ? lang === "ar" ? "تم التوصيل بنجاح" : "Delivered"
                          : o.status === "shipped"
                          ? lang === "ar" ? "خرج للشحن والتوصيل" : "Out for Delivery"
                          : lang === "ar" ? "قيد التجهيز" : "Processing"}
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

                {/* Cancelled Banner */}
                {isCancelled && (
                  <div className="p-4 bg-rose-500/5 border-b border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>
                        <b>{lang === "ar" ? "سبب الإلغاء:" : "Cancellation Reason:"}</b> {o.cancelReason || "بناءً على رغبة العميل"}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                      {lang === "ar"
                        ? `تم استرداد ${price(o.total)} إلى ${o.refundMethod === "wallet" ? "محفظة سوقلي الرقمية فوراً" : "وسيلة الدفع الأصلية"}.`
                        : `Refund of ${price(o.total)} completed.`}
                    </div>
                  </div>
                )}

                {/* Return Stepper if Return Requested or Returned */}
                {(isReturnRequested || isReturned) && (
                  <div className="p-5 border-b border-border bg-amber-500/5">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
                        <RotateCcw className="h-4 w-4" />
                        {lang === "ar" ? "متابعة مسار الإرجاع والاستبدال المجاني:" : "Return & Free Replacement Tracking:"}
                      </span>
                      {o.returnTrackingNumber && (
                        <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-bold text-amber-900 dark:text-amber-200">
                          {o.returnTrackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 relative mt-4">
                      <div className="absolute top-4 start-8 end-8 h-1 bg-border -z-0 hidden sm:block"></div>
                      {returnSteps.map((step, idx) => {
                        const stepDone = isReturned ? true : idx <= 1;
                        return (
                          <div key={idx} className="flex flex-col items-center text-center relative z-10">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                                stepDone
                                  ? "bg-amber-600 text-white ring-4 ring-amber-500/15"
                                  : "bg-muted border border-border text-muted-foreground"
                              }`}
                            >
                              {stepDone ? <CheckCircle2 className="h-4 w-4" /> : <span>{idx + 1}</span>}
                            </div>
                            <span className="mt-1.5 text-xs font-bold text-foreground">
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
                )}

                {/* Real-time Visual Tracking Stepper for normal orders */}
                {!isCancelled && !isReturnRequested && !isReturned && (
                  <div className="p-6 border-b border-border bg-background/50">
                    <div className="grid grid-cols-4 gap-2 relative">
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
                )}

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
                            className="block text-[11px] font-semibold text-primary hover:underline mt-1 cursor-pointer"
                          >
                            {lang === "ar" ? "شراء مجدداً" : "Buy Again"}
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Action Bar for Customer: Cancel Order or Request Return */}
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      {isCancellable && (
                        <button
                          onClick={() => setCancellingOrder(o)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {lang === "ar" ? "إلغاء الطلب واسترداد فوري" : "Cancel Order & Instant Refund"}
                        </button>
                      )}

                      {isReturnable && (
                        <button
                          onClick={() => setReturningOrder(o)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {lang === "ar" ? "طلب إرجاع مجاني (14 يوماً)" : "Request 14-Day Free Return"}
                        </button>
                      )}

                      <button
                        onClick={() => setInvoiceOrder(o)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-gold" />
                        {lang === "ar" ? "الفاتورة الضريبية الرسمية" : "Tax Invoice"}
                      </button>

                      <button
                        onClick={() => setWhatsappModalOrder(o)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        {lang === "ar" ? "إشعار الواتساب وتتبع الشحنة" : "WhatsApp Tracking"}
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address & Logistics Details */}
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

                    {/* Logistics Partner & Tracking Info */}
                    <div className="pt-3 border-t border-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-gold" />
                          {o.courier || "بوسطة Bosta Express"}
                        </span>
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          {o.estimatedDeliveryDate || "24-48 ساعة"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-1.5 text-[11px]">
                        <span className="font-mono text-foreground font-bold">{o.trackingNumber || `BST-EG-${o.id.replace('ORD-', '')}89`}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const track = o.trackingNumber || `BST-EG-${o.id.replace('ORD-', '')}89`;
                            navigator.clipboard?.writeText(track);
                            setCopiedTracking(o.id);
                            setTimeout(() => setCopiedTracking(null), 2000);
                          }}
                          className="text-primary hover:underline text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          {copiedTracking === o.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          {copiedTracking === o.id ? "تم النسخ" : "نسخ"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{lang === "ar" ? "حماية المشتري المعتمدة" : "Souqly Buyer Protection"}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {lang === "ar"
                          ? "مشترياتك مغطاة بضمان سوقلي الذهبي. استرجاع واستبدال مجاني واسترداد فوري خلال 14 يوماً."
                          : "Covered by Souqly Golden Warranty & 14-day return compliance."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Interactive Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <AlertTriangle className="h-5 w-5" />
                <span>{lang === "ar" ? `إلغاء الطلب ${cancellingOrder.id}` : `Cancel Order ${cancellingOrder.id}`}</span>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ سيتم استرداد المبلغ المدفوع بالكامل دون أي خصومات."
                : "Are you sure you want to cancel this order? A full refund will be processed immediately."}
            </p>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {lang === "ar" ? "سبب الإلغاء:" : "Reason for cancellation:"}
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="غيرت رأيي / لم أعد بحاجة للمنتج">غيرت رأيي / لم أعد بحاجة للمنتج</option>
                <option value="أخطأت في اختيار المقاس أو مواصفات المنتج">أخطأت في اختيار المقاس أو مواصفات المنتج</option>
                <option value="وجدت سعراً أفضل في متجر آخر">وجدت سعراً أفضل في متجر آخر</option>
                <option value="أرغب في تغيير عنوان الشحن">أرغب في تغيير عنوان الشحن</option>
                <option value="وقت التوصيل المتوقع طويل">وقت التوصيل المتوقع طويل</option>
                <option value="سبب آخر">سبب آخر</option>
              </select>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
              <span className="text-xs font-bold text-foreground block">
                {lang === "ar" ? "وجهة استرداد الأموال:" : "Refund Destination:"}
              </span>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="refundDest"
                  checked={refundToWallet}
                  onChange={() => setRefundToWallet(true)}
                  className="accent-primary"
                />
                <span className="font-semibold text-foreground">
                  {lang === "ar"
                    ? `إيداع فوري في محفظة سوقلي Souqly Wallet (${price(cancellingOrder.total)})`
                    : `Instant to Souqly Wallet (${price(cancellingOrder.total)})`}
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="refundDest"
                  checked={!refundToWallet}
                  onChange={() => setRefundToWallet(false)}
                  className="accent-primary"
                />
                <span className="text-muted-foreground">
                  {lang === "ar"
                    ? `استرداد لوسيلة الدفع الأصلية (${cancellingOrder.paymentMethod}) خلال 48 ساعة`
                    : `Refund to original payment method within 48h`}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-bold hover:bg-muted cursor-pointer"
              >
                {lang === "ar" ? "تراجع" : "Keep Order"}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                {lang === "ar" ? "تأكيد الإلغاء واسترداد المبلغ" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Interactive Modal (Egyptian Consumer Protection Act 181/2018) */}
      {returningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
                <RotateCcw className="h-5 w-5" />
                <span>{lang === "ar" ? `طلب إرجاع للطلب ${returningOrder.id}` : `Return Request for ${returningOrder.id}`}</span>
              </div>
              <button
                onClick={() => setReturningOrder(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>{lang === "ar" ? "سياسة الإرجاع المجاني (حماية المستهلك)" : "Free 14-Day Return Guarantee"}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {lang === "ar"
                  ? "يحق لك استرجاع أو استبدال المنتج مجاناً خلال 14 يوماً من الاستلام. سيتولى مندوب أسطول سوقلي إكسبريس الحضور لاستلام الشحنة من باب بيتك مجاناً دون أي رسوم إضافية."
                  : "You can return or exchange any item for free within 14 days. Our courier will pick up from your doorstep at zero cost."}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {lang === "ar" ? "سبب طلب الإرجاع:" : "Reason for Return:"}
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="المقاس أو اللون غير مطابق للمواصفات">المقاس أو اللون غير مطابق للمواصفات</option>
                <option value="المنتج به عيب صناعة أو وصل تالفاً">المنتج به عيب صناعة أو وصل تالفاً</option>
                <option value="استلمت منتجاً مختلفاً عن المعروض">استلمت منتجاً مختلفاً عن المعروض</option>
                <option value="جودة الخامة غير متوقعة">جودة الخامة غير متوقعة</option>
                <option value="أجزاء أو ملحقات ناقصة من العبوة">أجزاء أو ملحقات ناقصة من العبوة</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {lang === "ar" ? "ملاحظات إضافية أو وصف للمشكلة:" : "Additional Notes:"}
              </label>
              <textarea
                rows={2}
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder={lang === "ar" ? "اكتب توضيحاً لمندوب الفحص (اختياري)..." : "Write details for inspection..."}
                className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {lang === "ar" ? "عنوان استلام المرتجع بواسطة مندوب سوقلي:" : "Pickup Address for Courier:"}
              </label>
              <input
                type="text"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder="العنوان التفصيلي للاستلام..."
                className="w-full rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
              <span className="text-xs font-bold text-foreground block">
                {lang === "ar" ? "طريقة استرداد المبلغ بعد الفحص:" : "Refund Method:"}
              </span>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="returnRefund"
                  checked={returnRefundToWallet}
                  onChange={() => setReturnRefundToWallet(true)}
                  className="accent-primary"
                />
                <span className="font-semibold text-foreground">
                  {lang === "ar"
                    ? `إيداع فوري في محفظة سوقلي Souqly Wallet (${price(returningOrder.total)})`
                    : `Instant to Souqly Wallet (${price(returningOrder.total)})`}
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="returnRefund"
                  checked={!returnRefundToWallet}
                  onChange={() => setReturnRefundToWallet(false)}
                  className="accent-primary"
                />
                <span className="text-muted-foreground">
                  {lang === "ar"
                    ? `تحويل بنكي / إنستاباي / محفظة إلكترونية لنفس وسيلة الدفع`
                    : `Original Payment Method Refund`}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setReturningOrder(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-bold hover:bg-muted cursor-pointer"
              >
                {lang === "ar" ? "إلغاء" : "Close"}
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-xs cursor-pointer"
              >
                {lang === "ar" ? "إرسال طلب الإرجاع وتوليد البوليصة" : "Submit Return Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Tax Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                <h3 className="font-black text-base text-foreground">
                  {lang === "ar" ? "فاتورة ضريبية رسمية مبسطة" : "Official Simplified Tax Invoice"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs font-bold flex items-center gap-1 hover:bg-muted cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{lang === "ar" ? "طباعة" : "Print"}</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex items-start justify-between text-xs border-b border-border pb-4">
              <div>
                <span className="font-display font-black text-xl text-primary block">Souqly Marketplace</span>
                <span className="text-muted-foreground block text-[11px]">
                  {lang === "ar" ? "سوق سوقلي للتجارة الإلكترونية ش.م.م" : "Souqly E-Commerce LLC"}
                </span>
                <span className="text-muted-foreground block text-[11px]">
                  {lang === "ar" ? "الرقم الضريبي الموحد: 310982347100003" : "Tax ID: 310982347100003"}
                </span>
                <span className="text-muted-foreground block text-[11px]">
                  {lang === "ar" ? "القاهرة: التجمع الخامس، برج التسعين | الرياض: طريق الملك فهد" : "Cairo & Riyadh Offices"}
                </span>
              </div>
              <div className="text-end">
                <span className="font-mono font-bold text-sm block">{invoiceOrder.id}</span>
                <span className="text-muted-foreground block text-[11px]">
                  {new Date(invoiceOrder.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                    dateStyle: "long",
                  })}
                </span>
                <span className="text-emerald-600 font-bold block text-[11px]">
                  {lang === "ar" ? "✓ مدفوعة ومؤكدة إلكترونياً" : "✓ Paid Electronically"}
                </span>
              </div>
            </div>

            {/* Customer & Merchant Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-3 rounded-xl">
              <div>
                <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "بيانات العميل:" : "Customer Details:"}</span>
                <p className="font-bold text-foreground">{invoiceOrder.customerName}</p>
                <p className="text-muted-foreground">{invoiceOrder.customerAddress}، {invoiceOrder.city}</p>
                <p className="text-muted-foreground">{invoiceOrder.customerPhone}</p>
              </div>
              <div className="text-end">
                <span className="text-muted-foreground block text-[10px]">{lang === "ar" ? "طريقة الدفع والشحن:" : "Payment & Shipping:"}</span>
                <p className="font-semibold text-foreground">{invoiceOrder.paymentMethod}</p>
                <p className="text-muted-foreground">{lang === "ar" ? "شحن سريع: أسطول سوقلي إكسبريس" : "Souqly Express Courier"}</p>
              </div>
            </div>

            {/* Invoice Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-muted text-muted-foreground border-y border-border">
                  <tr>
                    <th className="py-2 px-3 text-start">{lang === "ar" ? "البند والبيان" : "Item"}</th>
                    <th className="py-2 px-3 text-center">{lang === "ar" ? "الكمية" : "Qty"}</th>
                    <th className="py-2 px-3 text-end">{lang === "ar" ? "سعر الوحدة" : "Unit Price"}</th>
                    <th className="py-2 px-3 text-end">{lang === "ar" ? "الإجمالي" : "Total"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoiceOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold block">{item.name[lang] || item.name.ar}</span>
                        <span className="text-[10px] text-muted-foreground">{lang === "ar" ? "البائع:" : "Seller:"} {item.seller}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-end">{price(item.price)}</td>
                      <td className="py-2.5 px-3 text-end font-bold">{price(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-border pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "المجموع قبل الضريبة" : "Subtotal (Excl. VAT)"}</span>
                <span>{price(Math.round(invoiceOrder.total / 1.14))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "ضريبة القيمة المضافة (14% مصر / 15% الخليج)" : "VAT (Included)"}</span>
                <span>{price(Math.round(invoiceOrder.total - invoiceOrder.total / 1.14))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "رسوم الشحن والتوصيل" : "Shipping"}</span>
                <span className="text-emerald-600 font-semibold">{lang === "ar" ? "مجاني" : "Free"}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-foreground pt-2 border-t border-border">
                <span>{lang === "ar" ? "إجمالي الفاتورة الصافي" : "Net Invoice Total"}</span>
                <span className="text-primary">{price(invoiceOrder.total)}</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-muted-foreground pt-2">
              {lang === "ar"
                ? "فاتورة إلكترونية معتمدة تصدر آلياً من منصة سوقلي وفقاً لتعليمات مصلحة الضرائب المصرية وهيئة الزكاة والضريبة والجمارك ZATCA."
                : "Certified automated tax invoice issued in compliance with Egyptian Tax Authority & ZATCA standards."}
            </div>
          </div>
        </div>
      )}
    
      {/* WhatsApp & SMS Notification Preview Modal */}
      {whatsappModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-2xl space-y-4 text-start relative overflow-hidden">
            {/* Top WhatsApp Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black">Souqly سوقلي</span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">حساب أعمال موثق عبر WhatsApp Business</span>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalOrder(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* WhatsApp Chat Bubble */}
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs space-y-2 relative">
              <p className="font-bold text-foreground">
                مرحباً بك يا {whatsappModalOrder.customerName}! 👋
              </p>
              <p className="text-muted-foreground leading-relaxed">
                يسرنا إبلاغك بأنه تم شحن طلبك رقم <b className="text-foreground">{whatsappModalOrder.id}</b> بنجاح من متجر سوقلي!
              </p>

              <div className="rounded-xl bg-card border border-border p-3 space-y-1 font-mono text-[11px] text-foreground">
                <div>📦 <b>شركة الشحن:</b> {whatsappModalOrder.courier || "بوسطة Bosta Express"}</div>
                <div>🏷️ <b>رقم التتبع:</b> {whatsappModalOrder.trackingNumber || "BST-EG-849201"}</div>
                <div>⏱️ <b>موعد الوصول المتوقع:</b> {whatsappModalOrder.estimatedDeliveryDate || "خلال 24-48 ساعة"}</div>
                <div>📍 <b>عنوان التوصيل:</b> {whatsappModalOrder.customerAddress} ({whatsappModalOrder.city})</div>
                <div>💰 <b>إجمالي الفاتورة:</b> {price(whatsappModalOrder.total)}</div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                يمكنك التنسيق مع مندوب التوصيل فور وصوله أو متابعة خط السير اللحظي. شكراً لتسوقك من سوقلي! 💚
              </p>

              <div className="flex justify-end items-center gap-1 text-[10px] text-muted-foreground pt-1">
                <span>{new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-emerald-600 font-bold">✓✓</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappModalOrder.customerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`مرحباً، أود الاستفسار عن شحنتي رقم ${whatsappModalOrder.id} مع ${whatsappModalOrder.courier || 'بوسطة'}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                مشاركة التحديث أو التواصل عبر واتساب
              </a>
              <button
                type="button"
                onClick={() => setWhatsappModalOrder(null)}
                className="w-full rounded-xl border border-border bg-background py-2 text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
