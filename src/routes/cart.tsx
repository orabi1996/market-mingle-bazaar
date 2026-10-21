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
  Tag,
  X,
  Lock,
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
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
    addresses,
    user,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  // Promo code state
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Checkout form state with default address support
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [customerName, setCustomerName] = useState(user?.name || defaultAddr?.recipientName || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || defaultAddr?.phone || "");
  const [customerAddress, setCustomerAddress] = useState(defaultAddr ? `${defaultAddr.street}، ${defaultAddr.district}` : "");
  const [city, setCity] = useState(defaultAddr?.city || "القاهرة");
  const [country, setCountry] = useState(defaultAddr?.country || "جمهورية مصر العربية");
  const [paymentMethod, setPaymentMethod] = useState("فودافون كاش / إنستاباي (Vodafone Cash / InstaPay)");
  const [walletNumber, setWalletNumber] = useState("01012345678");

  // Simulated Card Payment Inputs
  const [cardNumber, setCardNumber] = useState("4111 •••• •••• 9821");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");

  const items = products.filter((p) => cart[p.id]);
  const subtotal = items.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const discountAmount = calculateDiscount(subtotal);
  const isFreeShipping = subtotal >= 200;
  const shippingFee = isFreeShipping ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, subtotal);
    if (res.success) {
      setCouponFeedback({ type: "success", msg: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", msg: res.message });
    }
  };

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
      paymentMethod:
        appliedCoupon
          ? `${paymentMethod} (كوبون: ${appliedCoupon.code} - خصم ${price(discountAmount)})`
          : paymentMethod,
      items: orderItems,
      total: finalTotal,
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
          {lang === "ar" ? `رقم الطلب الخاص بك: ` : `Your Order Reference: `}
          <span className="font-mono font-bold text-foreground">{completedOrderNumber}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {lang === "ar"
            ? "سيصلك إشعار بالرسائل النصية والواتساب فور شحن الشحنة، وتم تسجيل الطلب أيضاً في لوحة تحكم التاجر."
            : "You will receive SMS tracking updates once dispatched, and order is recorded in the Seller Dashboard."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/orders"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 flex items-center gap-2"
          >
            <Truck className="h-4 w-4 text-gold" />
            {lang === "ar" ? "تتبع حالة الشحنة مباشرة" : "Track Shipment Live"}
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-input bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
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
                  <span className="text-emerald-600">
                    {lang === "ar" ? "مبارك! طلبك مؤهل للشحن المجاني السريع." : "Congrats! Your order qualifies for free delivery."}
                  </span>
                ) : (
                  <span>
                    {lang === "ar"
                      ? `أضف ${price(Math.max(0, 200 - subtotal))} إضافية لتحصل على الشحن المجاني`
                      : `Add ${price(Math.max(0, 200 - subtotal))} more for free shipping`}
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

            {/* Promo Code Input Box */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                <Tag className="h-4 w-4 text-gold" />
                {lang === "ar" ? "هل لديك كوبون خصم أو قسيمة شراء؟" : "Have a promo coupon code?"}
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold text-emerald-700">{appliedCoupon.code}</span>
                      <span className="ms-2 text-emerald-600 font-medium">({appliedCoupon.description[lang]})</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-muted-foreground hover:text-destructive"
                    title={lang === "ar" ? "إلغاء الكوبون" : "Remove"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={lang === "ar" ? "أدخل الكود (مثال: BAX10 أو GULF50)..." : "e.g. BAX10..."}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono uppercase outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                  >
                    {lang === "ar" ? "تطبيق الكوبون" : "Apply"}
                  </button>
                </form>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className="mt-2 text-xs font-semibold text-destructive">{couponFeedback.msg}</p>
              )}

              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{lang === "ar" ? "كوبونات تجريبية متاحة:" : "Available codes:"}</span>
                <button
                  type="button"
                  onClick={() => applyCoupon("BAX10", subtotal)}
                  className="rounded bg-secondary px-1.5 py-0.5 font-mono font-bold text-foreground hover:bg-muted"
                >
                  BAX10 (10%)
                </button>
                <button
                  type="button"
                  onClick={() => applyCoupon("GULF50", subtotal)}
                  className="rounded bg-secondary px-1.5 py-0.5 font-mono font-bold text-foreground hover:bg-muted"
                >
                  GULF50 (50 ر.س)
                </button>
              </div>
            </div>
          </div>

          {/* Checkout & Summary Sidebar */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs h-fit">
            <h3 className="text-base font-bold pb-3 border-b border-border">
              {lang === "ar" ? "ملخص الفاتورة" : "Order Summary"}
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-foreground">{price(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>{lang === "ar" ? `خصم الكوبون (${appliedCoupon?.code})` : `Coupon Discount (${appliedCoupon?.code})`}</span>
                  <span>- {price(discountAmount)}</span>
                </div>
              )}

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
                <span className="text-primary">{price(finalTotal)}</span>
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

                {/* Saved Address Quick-Selector */}
                {addresses.length > 0 && (
                  <div className="rounded-xl border border-border bg-secondary/30 p-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-bold text-muted-foreground">
                      <span>{lang === "ar" ? "📍 شحن سريع إلى عنوان محفوظ:" : "📍 Quick Deliver to:"}</span>
                      <Link to="/profile" className="text-primary hover:underline font-semibold">
                        {lang === "ar" ? "إدارة العناوين" : "Manage"}
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {addresses.map((a) => {
                        const isCurrent = customerAddress === `${a.street}، ${a.district}`;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setCustomerName(a.recipientName);
                              setCustomerPhone(a.phone);
                              setCustomerAddress(`${a.street}، ${a.district}`);
                              setCity(a.city);
                              setCountry(a.country);
                            }}
                            className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
                              isCurrent
                                ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                                : "border-border bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            {a.title} ({a.city})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                    <option value="القاهرة">القاهرة (Cairo)</option>
                    <option value="الجيزة">الجيزة (Giza)</option>
                    <option value="الإسكندرية">الإسكندرية (Alexandria)</option>
                    <option value="المنصورة">المنصورة (Mansoura)</option>
                    <option value="طنطا">طنطا (Tanta)</option>
                    <option value="بورسعيد">بورسعيد (Port Said)</option>
                    <option value="الرياض">الرياض (Riyadh)</option>
                    <option value="جدة">جدة (Jeddah)</option>
                    <option value="الدمام">الدمام (Dammam)</option>
                    <option value="دبي">دبي (Dubai)</option>
                    <option value="أبوظبي">أبوظبي (Abu Dhabi)</option>
                    <option value="الكويت">الكويت (Kuwait)</option>
                    <option value="الدوحة">الدوحة (Doha)</option>
                    <option value="المنامة">المنامة (Manama)</option>
                    <option value="مسقط">مسقط (Muscat)</option>
                  </select>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none font-medium"
                  >
                    <option value="فودافون كاش / إنستاباي (Vodafone Cash / InstaPay)">فودافون كاش / إنستاباي</option>
                    <option value="فوري / بطاقة ميزة (Fawry / Meeza)">فوري / ميزة (Fawry / Meeza)</option>
                    <option value="مدى / بطاقة بنكية (Mada)">مدى (Mada)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="فيزا / ماستركارد">فيزا / ماستركارد (Visa / Master)</option>
                    <option value="تمارا / تابي بالتقسيط">تمارا / تابي بالتقسيط</option>
                    <option value="الدفع عند الاستلام">الدفع عند الاستلام (COD)</option>
                  </select>
                </div>

                {/* Simulated Vodafone Cash / InstaPay Input */}
                {paymentMethod.includes("فودافون") && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1.5 mt-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <span>📱 فودافون كاش / المحافظ الإلكترونية / إنستاباي</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <input
                      type="tel"
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      placeholder="رقم المحفظة (010xxxxxxx) أو معرف InstaPay IPA"
                      className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs font-mono outline-none"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      سيصلك طلب تأكيد الدفع الفوري على محفظتك لإتمام المعاملة بأمان.
                    </p>
                  </div>
                )}

                {/* Simulated Fawry Ref Code */}
                {paymentMethod.includes("فوري") && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5 mt-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400">
                      <span>⚡ الدفع عبر منافذ فوري (Fawry Pay)</span>
                      <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-800 dark:text-amber-300 font-bold">FAWRY</span>
                    </div>
                    <div className="rounded border border-amber-200 bg-background p-2 text-center">
                      <span className="text-[10px] text-muted-foreground block">رقم الدفع المرجعي بفوري (صالح 48 ساعة):</span>
                      <span className="font-mono text-sm font-black tracking-wider text-amber-600">849 201 992</span>
                    </div>
                  </div>
                )}

                {/* Simulated Interactive Card Input for Mada / Visa */}
                {(paymentMethod.includes("مدى") || paymentMethod.includes("فيزا")) && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2 mt-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                      <span>{paymentMethod.includes("مدى") ? "💳 بوابة دفع مدى Mada" : "💳 بطاقة ائتمانية"}</span>
                      <Lock className="h-3 w-3" />
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="رقم البطاقة"
                      className="w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs font-mono outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="rounded border border-input bg-background px-2.5 py-1.5 text-xs font-mono outline-none text-center"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="rounded border border-input bg-background px-2.5 py-1.5 text-xs font-mono outline-none text-center"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5 text-gold" />
                  {lang === "ar"
                    ? `تأكيد ودفع ${price(finalTotal)} بأمان`
                    : `Confirm & Pay ${price(finalTotal)}`}
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
