import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type OrderItem } from "@/lib/store";
import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "عربة التسوق | BAX" },
      { name: "description", content: "راجع منتجاتك وأتمم طلبك بأمان على باكس." },
      { property: "og:title", content: "عربة التسوق | BAX" },
      { property: "og:description", content: "راجع منتجاتك وأتمم طلبك بأمان على باكس." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const {
    cart,
    products,
    lang,
    t,
    price,
    add,
    decrease,
    remove,
    clearCart,
    createOrder,
    currency,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [city, setCity] = useState("الرياض");
  const [country, setCountry] = useState("المملكة العربية السعودية");
  const [paymentMethod, setPaymentMethod] = useState("مدى / بطاقة بنكية (Mada)");

  const cartProductIds = Object.keys(cart);
  const items = products.filter((p) => cart[p.id]);
  const total = items.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const isFreeShipping = total >= 200;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    const orderItems: OrderItem[] = items.map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: cart[p.id] || 1,
      price: p.price,
      image: p.image,
      seller: p.seller,
    }));

    const order = createOrder({
      customerName,
      customerEmail: "buyer@example.com",
      customerPhone,
      customerAddress,
      city,
      country,
      paymentMethod,
      items: orderItems,
      total,
      currency,
    });

    setCompletedOrderNumber(order.id);
    setIsCheckingOut(false);
  };

  if (completedOrderNumber) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-3xl font-black">
          {lang === "ar" ? "تم تأكيد طلبك بنجاح!" : "Order Confirmed Successfully!"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "ar"
            ? `رقم الطلب الخاص بك: `
            : `Your Order Reference: `}
          <span className="font-mono font-bold text-foreground">{completedOrderNumber}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {lang === "ar"
            ? "سيصلك إشعار بالرسائل النصية والواتساب فور شحن الشحنة، وتم تسجيل الطلب أيضاً في لوحة تحكم التاجر."
            : "You will receive SMS tracking updates once dispatched, and order is recorded in the Seller Dashboard."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
          </Link>
          <Link
            to="/sell"
            className="rounded-xl border border-input bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            {lang === "ar" ? "معاينة الطلب في لوحة التاجر" : "View in Seller Dashboard"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl md:text-3xl font-black flex items-center gap-2">
        <ShoppingBag className="h-7 w-7 text-gold" />
        {t.cart} ({Object.values(cart).reduce((a, b) => a + b, 0)})
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-xl font-bold">{t.empty}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "ar" ? "تصفح أحدث العروض والمنتجات وأضف ما يعجبك لسلتك." : "Browse deals and add items to your cart."}
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            {t.startShopping}
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping banner */}
            <div className="rounded-xl bg-secondary/50 p-3.5 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Truck className="h-4 w-4 text-gold" />
                {isFreeShipping ? (
                  <span className="text-emerald-600">{lang === "ar" ? "مبارك! طلبك مؤهل للشحن المجاني السريع." : "Congrats! Your order qualifies for free delivery."}</span>
                ) : (
                  <span>
                    {lang === "ar"
                      ? `أضف ${price(Math.max(0, 200 - total))} إضافية لتحصل على الشحن المجاني`
                      : `Add ${price(Math.max(0, 200 - total))} more for free shipping`}
                  </span>
                )}
              </div>
            </div>

            {items.map((p) => {
              const qty = cart[p.id] || 1;
              return (
                <div
                  key={p.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs"
                >
                  <img
                    src={p.image}
                    alt={p.name[lang]}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-xl object-cover bg-secondary shrink-0"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/product/$id"
                          params={{ id: p.id }}
                          className="font-bold text-foreground hover:text-primary line-clamp-2 text-sm"
                        >
                          {p.name[lang]}
                        </Link>
                        <button
                          onClick={() => remove(p.id)}
                          className="text-muted-foreground hover:text-destructive p-1"
                          title={t.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5 inline-block">
                        {t.by}: <b className="text-foreground">{p.seller}</b>
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-input bg-background">
                        <button
                          onClick={() => decrease(p.id)}
                          className="p-1.5 text-muted-foreground hover:bg-muted rounded-s-lg"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-bold">{qty}</span>
                        <button
                          onClick={() => add(p.id)}
                          className="p-1.5 text-muted-foreground hover:bg-muted rounded-e-lg"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-end">
                        <span className="text-base font-black text-foreground">
                          {price(p.price * qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout & Summary Sidebar */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs h-fit">
            <h3 className="text-base font-bold pb-3 border-b border-border">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-foreground">{price(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "رسوم الشحن والتوصيل" : "Shipping & Delivery"}</span>
                <span className="font-semibold text-foreground">
                  {isFreeShipping ? (lang === "ar" ? "مجاني" : "Free") : price(25)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "ضريبة القيمة المضافة" : "VAT"}</span>
                <span className="text-emerald-600 font-semibold">{lang === "ar" ? "شاملة" : "Included"}</span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between text-base font-black text-foreground">
                <span>{t.total}</span>
                <span className="text-primary">{price(total + (isFreeShipping ? 0 : 25))}</span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="mt-6 w-full rounded-xl bg-gold py-3 text-sm font-black text-gold-foreground shadow hover:opacity-90 transition"
              >
                {t.checkout}
              </button>
            ) : (
              /* Inline Fast Checkout Form */
              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3 pt-3 border-t border-border">
                <h4 className="text-xs font-bold text-foreground">
                  {lang === "ar" ? "بيانات التوصيل والدفع:" : "Delivery & Payment:"}
                </h4>

                <div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === "ar" ? "الاسم المستلم بالكامل *" : "Full Name *"}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={lang === "ar" ? "رقم الجوال للتوصيل *" : "Mobile Phone *"}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder={lang === "ar" ? "عنوان التوصيل (الحي والشارع) *" : "Street Address *"}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="دبي">دبي</option>
                    <option value="أبوظبي">أبوظبي</option>
                    <option value="الكويت">الكويت</option>
                    <option value="الدوحة">الدوحة</option>
                    <option value="المنامة">المنامة</option>
                    <option value="مسقط">مسقط</option>
                  </select>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none"
                  >
                    <option value="بطاقة مدى (Mada)">مدى (Mada)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="فيزا / ماستركارد">Visa / Mastercard</option>
                    <option value="الدفع عند الاستلام">الدفع عند الاستلام</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
                >
                  {lang === "ar" ? "تأكيد الطلب وشراء الآن" : "Confirm & Place Order"}
                </button>
              </form>
            )}

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>{lang === "ar" ? "دفع آمن 100% وضمان استرداد" : "100% Secure Checkout"}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
