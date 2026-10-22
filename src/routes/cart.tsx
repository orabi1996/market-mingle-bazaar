import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type OrderItem, getShippingZoneForCity } from "@/lib/store";
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
  Wallet,
  QrCode,
  Copy,
  Check,
  Clock,
  Printer,
  Smartphone,
  KeyRound,
  Building2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "عربة التسوق | Souqly" },
      { name: "description", content: "راجع منتجاتك وأتمم طلبك بأمان على سوقلي." },
      { property: "og:title", content: "عربة التسوق | Souqly" },
      { property: "og:description", content: "راجع منتجاتك وأتمم طلبك بأمان على سوقلي." },
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
    walletBalance,
    deductWallet,
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

  // Interactive Egyptian Fintech Modals
  const [showInstaPayModal, setShowInstaPayModal] = useState(false);
  const [showFawryModal, setShowFawryModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("482910");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [copiedIpa, setCopiedIpa] = useState(false);
  const [copiedFawry, setCopiedFawry] = useState(false);

  const items = products.filter((p) => cart[p.id]);
  const subtotal = items.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
  const discountAmount = calculateDiscount(subtotal);
  const selectedZone = getShippingZoneForCity(city);
  const isFreeShipping = subtotal >= selectedZone.freeThreshold;
  const shippingFee = isFreeShipping ? 0 : selectedZone.baseFee;
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

  const executeOrder = (confirmedMethodName?: string) => {
    const orderItems: OrderItem[] = items.map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: cart[p.id] || 1,
      price: p.price,
      image: p.image,
      seller: p.seller,
    }));

    const finalMethod = confirmedMethodName || paymentMethod;

    if (finalMethod.includes("محفظة سوقلي")) {
      if (walletBalance < finalTotal) {
        alert(lang === "ar" ? "رصيد محفظة سوقلي غير كافٍ لإتمام عملية الشراء. يرجى شحن المحفظة أو اختيار وسيلة دفع أخرى." : "Insufficient Souqly Wallet balance.");
        return;
      }
      deductWallet(finalTotal, "شراء طلب من متجر سوقلي");
    }

    const order = createOrder({
      customerName,
      customerEmail: "buyer@example.com",
      customerPhone,
      customerAddress,
      city,
      governorate: city,
      country,
      courier: selectedZone.courier,
      shippingFee,
      estimatedDeliveryDate: selectedZone.eta.ar,
      paymentMethod:
        appliedCoupon
          ? `${finalMethod} (كوبون: ${appliedCoupon.code} - خصم ${price(discountAmount)})`
          : finalMethod,
      items: orderItems,
      total: finalTotal,
      currency,
    });

    setCompletedOrderNumber(order.id);
    setIsCheckingOut(false);
    setShowInstaPayModal(false);
    setShowFawryModal(false);
    setShowOtpModal(false);
    setIsAuthorizing(false);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    // Trigger interactive fintech simulators based on method
    if (paymentMethod.includes("إنستاباي") || paymentMethod.includes("فودافون كاش")) {
      setShowInstaPayModal(true);
      return;
    }
    if (paymentMethod.includes("فوري")) {
      setShowFawryModal(true);
      return;
    }
    if (paymentMethod.includes("فيزا") || paymentMethod.includes("مدى")) {
      setShowOtpModal(true);
      return;
    }

    // Direct execution for Wallet / COD / etc.
    executeOrder();
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
            {/* Free shipping & Governorates logistics banner */}
            <div className="rounded-xl bg-secondary/50 p-3.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-bold">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gold shrink-0" />
                  {isFreeShipping ? (
                    <span className="text-emerald-600">
                      {lang === "ar"
                        ? `مبارك! طلبك مؤهل للشحن المجاني السريع مع ${selectedZone.courier}.`
                        : `Congrats! Order qualifies for free delivery via ${selectedZone.courier}.`}
                    </span>
                  ) : (
                    <span>
                      {lang === "ar"
                        ? `أضف ${price(Math.max(0, selectedZone.freeThreshold - subtotal))} إضافية لتحصل على شحن مجاني في ${selectedZone.region.ar}`
                        : `Add ${price(Math.max(0, selectedZone.freeThreshold - subtotal))} more for free shipping`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground self-start sm:self-auto">
                  <Clock className="h-3 w-3 text-gold" />
                  <span>{lang === "ar" ? `التسليم: ${selectedZone.eta.ar}` : selectedZone.eta.en}</span>
                </div>
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
                    placeholder={lang === "ar" ? "أدخل الكود (مثال: SOUQLY10 أو GULF50)..." : "e.g. SOUQLY10..."}
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
                  onClick={() => applyCoupon("SOUQLY10", subtotal)}
                  className="rounded bg-secondary px-1.5 py-0.5 font-mono font-bold text-foreground hover:bg-muted"
                >
                  SOUQLY10 (10%)
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
                <span className="flex items-center gap-1">
                  <span>{lang === "ar" ? "رسوم الشحن والتوصيل" : "Shipping & Delivery"}</span>
                  <span className="text-[10px] text-muted-foreground">({selectedZone.courier.split(' ')[0]})</span>
                </span>
                <span className="font-semibold text-foreground">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">{lang === "ar" ? "مجاني" : "Free"}</span>
                  ) : (
                    price(selectedZone.baseFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{lang === "ar" ? "موعد التسليم المتوقع:" : "Estimated Delivery:"}</span>
                <span className="text-foreground font-medium">{selectedZone.eta.ar}</span>
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setCity(val);
                      if (["الرياض", "جدة", "الدمام"].includes(val)) setCountry("المملكة العربية السعودية");
                      else if (["دبي", "أبوظبي"].includes(val)) setCountry("الإمارات العربية المتحدة");
                      else if (val === "الكويت") setCountry("دولة الكويت");
                      else if (val === "الدوحة") setCountry("دولة قطر");
                      else if (val === "المنامة") setCountry("مملكة البحرين");
                      else if (val === "مسقط") setCountry("سلطنة عمان");
                      else setCountry("جمهورية مصر العربية");
                    }}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none font-medium"
                  >
                    <optgroup label="🇪🇬 القاهرة الكبرى (خلال 24-48 ساعة)">
                      <option value="القاهرة">القاهرة (Cairo)</option>
                      <option value="الجيزة">الجيزة (Giza)</option>
                      <option value="القليوبية">القليوبية (Qalyubia)</option>
                    </optgroup>
                    <optgroup label="🇪🇬 الإسكندرية ومدن القناة (2-3 أيام)">
                      <option value="الإسكندرية">الإسكندرية (Alexandria)</option>
                      <option value="بورسعيد">بورسعيد (Port Said)</option>
                      <option value="السويس">السويس (Suez)</option>
                      <option value="الإسماعيلية">الإسماعيلية (Ismailia)</option>
                    </optgroup>
                    <optgroup label="🇪🇬 محافظات الدلتا والوجه البحري (2-3 أيام)">
                      <option value="الدقهلية (المنصورة)">المنصورة - الدقهلية</option>
                      <option value="الغربية (طنطا)">طنطا - الغربية</option>
                      <option value="الشرقية (الزقازيق)">الزقازيق - الشرقية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="البحيرة">البحيرة</option>
                      <option value="دمياط">دمياط</option>
                      <option value="كفر الشيخ">كفر الشيخ</option>
                    </optgroup>
                    <optgroup label="🇪🇬 محافظات الصعيد (3-5 أيام)">
                      <option value="الفيوم">الفيوم</option>
                      <option value="بني سويف">بني سويف</option>
                      <option value="المنيا">المنيا</option>
                      <option value="أسيوط">أسيوط</option>
                      <option value="سوهاج">سوهاج</option>
                      <option value="قنا">قنا</option>
                      <option value="الأقصر">الأقصر</option>
                      <option value="أسوان">أسوان</option>
                    </optgroup>
                    <optgroup label="🇪🇬 المحافظات الساحلية والحدودية (4-6 أيام)">
                      <option value="البحر الأحمر (الغردقة)">الغردقة - البحر الأحمر</option>
                      <option value="جنوب سيناء (شرم الشيخ)">شرم الشيخ - جنوب سيناء</option>
                      <option value="مرسى مطروح">مرسى مطروح</option>
                      <option value="الوادي الجديد">الوادي الجديد</option>
                    </optgroup>
                    <optgroup label="🇸🇦 🇦🇪 🇰🇼 دول الخليج (شحن جوي سريع)">
                      <option value="الرياض">الرياض (Riyadh)</option>
                      <option value="جدة">جدة (Jeddah)</option>
                      <option value="الدمام">الدمام (Dammam)</option>
                      <option value="دبي">دبي (Dubai)</option>
                      <option value="أبوظبي">أبوظبي (Abu Dhabi)</option>
                      <option value="الكويت">الكويت (Kuwait)</option>
                      <option value="الدوحة">الدوحة (Doha)</option>
                      <option value="المنامة">المنامة (Manama)</option>
                      <option value="مسقط">مسقط (Muscat)</option>
                    </optgroup>
                  </select>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none font-medium"
                  >
                    <option value="محفظة سوقلي الإلكترونية (Souqly Wallet)">محفظة سوقلي الإلكترونية (Souqly Wallet)</option>
                    <option value="فودافون كاش / إنستاباي (Vodafone Cash / InstaPay)">فودافون كاش / إنستاباي</option>
                    <option value="فوري / بطاقة ميزة (Fawry / Meeza)">فوري / ميزة (Fawry / Meeza)</option>
                    <option value="مدى / بطاقة بنكية (Mada)">مدى (Mada)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="فيزا / ماستركارد">فيزا / ماستركارد (Visa / Master)</option>
                    <option value="تمارا / تابي بالتقسيط">تمارا / تابي بالتقسيط</option>
                    <option value="الدفع عند الاستلام">الدفع عند الاستلام (COD)</option>
                  </select>
                </div>

                {/* Simulated Souqly Wallet Option */}
                {paymentMethod.includes("محفظة سوقلي") && (
                  <div className="rounded-xl border border-gold/40 bg-gold/5 p-3 space-y-2 mt-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4 text-gold" />
                        {lang === "ar" ? "الدفع الفوري من رصيد محفظة سوقلي" : "Pay with Souqly Wallet Balance"}
                      </span>
                      <span className="font-mono text-gold-foreground dark:text-gold font-bold">
                        {price(walletBalance)}
                      </span>
                    </div>

                    {walletBalance >= finalTotal ? (
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                        <div className="flex items-center gap-1 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{lang === "ar" ? "رصيدك كافٍ لتغطية قيمة الطلب بالكامل." : "Balance covers full order."}</span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">
                          {lang === "ar"
                            ? `الرصيد المتبقي بعد الشراء سيكون: ${price(walletBalance - finalTotal)}`
                            : `Remaining balance: ${price(walletBalance - finalTotal)}`}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-[11px] text-rose-700 dark:text-rose-400">
                        <p className="font-bold">
                          {lang === "ar"
                            ? `رصيدك الحالي (${price(walletBalance)}) أقل من إجمالي الطلب (${price(finalTotal)}).`
                            : `Insufficient balance.`}
                        </p>
                        <Link to="/profile" className="font-bold underline text-primary mt-1 inline-block">
                          {lang === "ar" ? "اشحن محفظتك الآن بضغطة زر ↗" : "Top up wallet now ↗"}
                        </Link>
                      </div>
                    )}
                  </div>
                )}

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
    
      {/* 1. InstaPay Interactive Transfer Modal */}
      {showInstaPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-start relative overflow-hidden">
            <div className="absolute top-0 start-0 end-0 h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500" />
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">الدفع اللحظي عبر إنستاباي / المحافظ</h3>
                  <p className="text-[11px] text-muted-foreground">InstaPay Instant Payment Network (IPN)</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstaPayModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
                <div className="bg-white p-3 rounded-2xl shadow-inner border border-purple-200">
                  {/* Clean SVG Mock QR */}
                  <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    {/* Top Left */}
                    <rect x="10" y="10" width="24" height="24" rx="3" fill="#1e1b4b" />
                    <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="18" width="8" height="8" fill="#7c3aed" />
                    {/* Top Right */}
                    <rect x="66" y="10" width="24" height="24" rx="3" fill="#1e1b4b" />
                    <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                    <rect x="74" y="18" width="8" height="8" fill="#7c3aed" />
                    {/* Bottom Left */}
                    <rect x="10" y="66" width="24" height="24" rx="3" fill="#1e1b4b" />
                    <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                    <rect x="18" y="74" width="8" height="8" fill="#7c3aed" />
                    {/* Patterns */}
                    <rect x="38" y="14" width="6" height="6" fill="#1e1b4b" />
                    <rect x="48" y="14" width="12" height="6" fill="#7c3aed" />
                    <rect x="38" y="24" width="16" height="6" fill="#1e1b4b" />
                    <rect x="14" y="38" width="6" height="16" fill="#7c3aed" />
                    <rect x="24" y="44" width="14" height="6" fill="#1e1b4b" />
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="#7c3aed" />
                    <rect x="64" y="38" width="10" height="6" fill="#1e1b4b" />
                    <rect x="78" y="44" width="12" height="8" fill="#7c3aed" />
                    <rect x="40" y="66" width="12" height="6" fill="#1e1b4b" />
                    <rect x="40" y="78" width="6" height="12" fill="#7c3aed" />
                    <rect x="52" y="72" width="14" height="6" fill="#1e1b4b" />
                    <rect x="70" y="68" width="8" height="8" fill="#7c3aed" />
                    <rect x="82" y="76" width="8" height="12" fill="#1e1b4b" />
                  </svg>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                  <QrCode className="h-4 w-4" />
                  <span>امسح الكود من تطبيق إنستاباي أو المحفظة الإلكترونية</span>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  صالح للدفع اللحظي لمدة: 04:59 دقيقة
                </span>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-2.5">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">عنوان الدفع اللحظي (IPA):</span>
                    <span className="font-mono font-bold text-foreground">souqly.market@instapay</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText("souqly.market@instapay");
                      setCopiedIpa(true);
                      setTimeout(() => setCopiedIpa(false), 2000);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-background border border-border px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted"
                  >
                    {copiedIpa ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIpa ? "تم النسخ" : "نسخ IPA"}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-2.5">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">الرقم المرجعي للعملية:</span>
                    <span className="font-mono font-bold text-foreground">IPN-84920199</span>
                  </div>
                  <div className="text-end">
                    <span className="text-[10px] text-muted-foreground block">المبلغ المطلوب سداده:</span>
                    <span className="font-bold text-emerald-600 text-sm">{price(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => executeOrder("إنستاباي / محفظة إلكترونية (دفع لحظي IPN)")}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  تم التحويل بنجاح - تأكيد الطلب فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setShowInstaPayModal(false)}
                  className="w-full rounded-xl border border-border bg-background py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  تغيير وسيلة الدفع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fawry Pay 48-Hour Official Voucher Modal */}
      {showFawryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-card p-6 shadow-2xl text-start relative overflow-hidden">
            <div className="absolute top-0 start-0 end-0 h-2 bg-amber-500" />

            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 font-black">
                  F
                </div>
                <div>
                  <h3 className="text-sm font-black">إذن دفع فوري باي (Fawry Pay)</h3>
                  <p className="text-[11px] text-muted-foreground">صالح لدى أكثر من 300 ألف منفذ فوري وتطبيق MyFawry</p>
                </div>
              </div>
              <button
                onClick={() => setShowFawryModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Voucher Box */}
              <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-500/5 p-4 text-center">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  كود الدفع المرجعي في فوري (Ref Code)
                </span>
                <span className="mt-1 font-mono text-2xl font-black tracking-widest text-amber-600 block">
                  849 201 992
                </span>

                {/* Simulated Barcode */}
                <div className="mt-3 flex justify-center items-end gap-[3px] h-12 bg-white p-2 rounded-lg border border-amber-200">
                  <span className="w-1.5 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-1 h-full bg-black"></span>
                  <span className="w-2 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-1.5 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-2 h-full bg-black"></span>
                  <span className="w-1 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-1.5 h-full bg-black"></span>
                  <span className="w-2 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-1 h-full bg-black"></span>
                  <span className="w-1.5 h-full bg-black"></span>
                  <span className="w-0.5 h-full bg-black"></span>
                  <span className="w-2 h-full bg-black"></span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground mt-1 block">8492019920042</span>

                <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">كود خدمة فوري:</span>
                  <span className="font-bold text-foreground">788 (مدفوعات سوقلي Souqly)</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">المبلغ المستحق:</span>
                  <span className="font-black text-foreground">{price(finalTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1 text-amber-700 dark:text-amber-400 font-semibold">
                  <span>الصلاحية:</span>
                  <span>48 ساعة من تاريخ الحجز</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-xl bg-secondary/50 p-3 text-[11px] text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">📌 طريقة السداد لدى تاجر فوري:</p>
                <p>1. أخبر التاجر بالدفع عبر كود خدمة "788" أو "فوري باي".</p>
                <p>2. أعطه رقم الدفع المرجعي <b className="text-foreground">849201992</b>.</p>
                <p>3. بعد السداد، سيتم تأكيد طلبك وشحنه تلقائياً بدون أي إجراء إضافي.</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => executeOrder("فوري باي (كود مرجعي: 849201992)")}
                  className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white shadow hover:bg-amber-600 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  حفظ القسيمة وتأكيد حجز الطلب
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText("849201992");
                      setCopiedFawry(true);
                      setTimeout(() => setCopiedFawry(false), 2000);
                    }}
                    className="flex-1 rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:bg-muted flex items-center justify-center gap-1.5"
                  >
                    {copiedFawry ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedFawry ? "تم نسخ الرقم" : "نسخ الكود"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:bg-muted flex items-center justify-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                    طباعة القسيمة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 3D Secure SMS OTP Simulation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-start relative overflow-hidden">
            <div className="absolute top-0 start-0 end-0 h-2 bg-primary" />

            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">التحقق الآمن 3D Secure</h3>
                  <p className="text-[11px] text-muted-foreground">شبكة ميزة الوطنية / البنك الأهلي المصري / CIB</p>
                </div>
              </div>
              <button
                disabled={isAuthorizing}
                onClick={() => setShowOtpModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Transaction Summary Card */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-3.5 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>التاجر:</span>
                  <span className="font-bold text-foreground">Souqly E-Commerce Ltd</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>البطاقة البنكية:</span>
                  <span className="font-mono font-bold text-foreground">•••• •••• •••• 9821</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>المبلغ المراد خصمه:</span>
                  <span className="font-black text-primary text-sm">{price(finalTotal)}</span>
                </div>
              </div>

              {/* OTP Input Section */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <KeyRound className="h-4 w-4" />
                  <span>أدخل رمز التأكيد لمرة واحدة (SMS OTP)</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  تم إرسال كود التحقق السري إلى هاتفك المحمول المسجل لدى البنك والمنتهي برقم <b className="text-foreground">**43</b>.
                </p>
                
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-3 text-center font-mono text-xl font-black tracking-widest outline-none focus:ring-2 focus:ring-primary"
                    placeholder="482910"
                  />
                  <span className="text-[10px] text-emerald-600 block mt-1 text-center font-semibold">
                    ✓ كود التجربة التلقائي: 482910
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>لم يصلك الرمز؟</span>
                  <button type="button" className="text-primary font-bold hover:underline">
                    إعادة الإرسال (0:38)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isAuthorizing || !otpCode}
                  onClick={() => {
                    setIsAuthorizing(true);
                    setTimeout(() => {
                      executeOrder("بطاقة بنكية موثقة 3D Secure (ميزة / فيزا)");
                    }, 1200);
                  }}
                  className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAuthorizing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      جاري الاتصال بالبنك واعتماد العملية...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-gold" />
                      تأكيد الدفع وخصم {price(finalTotal)}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isAuthorizing}
                  onClick={() => setShowOtpModal(false)}
                  className="w-full rounded-xl border border-border bg-background py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  إلغاء المعاملة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
