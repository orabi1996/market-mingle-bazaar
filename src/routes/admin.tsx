import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type StoreInfo, type Order } from "@/lib/store";
import { useState } from "react";
import {
  ShieldCheck,
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Percent,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Sliders,
  ExternalLink,
  Trash2,
  Lock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة المركزية | Souqly Admin Console" },
      { name: "description", content: "إدارة التجار والمبيعات ومراقبة منصة سوقلي في الخليج." },
      { property: "og:title", content: "إدارة سوقلي المركزية | Souqly Admin" },
      { property: "og:description", content: "لوحة تحكم إدارة منصة سوقلي للتجارة الإلكترونية." },
    ],
  }),
  component: AdminConsole,
});

function AdminConsole() {
  const {
    lang,
    t,
    stores,
    toggleStoreVerification,
    toggleStoreStatus,
    commissionRate,
    setCommissionRate,
    products,
    deleteProduct,
    orders,
    price,
    user,
    switchRole,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"merchants" | "products" | "orders" | "financials">("merchants");
  const [storeSearch, setStoreSearch] = useState("");
  const [commRateInput, setCommRateInput] = useState(commissionRate);
  const [savedSettingsToast, setSavedSettingsToast] = useState(false);

  // Financial calculations
  const totalStoresSales = stores.reduce((acc, s) => acc + s.totalSales, 0);
  const totalOrdersSales = orders.reduce((acc, o) => acc + o.total, 0);
  const gmv = totalStoresSales + totalOrdersSales + 125400;
  const platformRevenue = gmv * (commissionRate / 100);

  const filteredStores = stores.filter(
    (s) =>
      !storeSearch.trim() ||
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.owner.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.category.includes(storeSearch)
  );

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    setCommissionRate(Number(commRateInput));
    setSavedSettingsToast(true);
    setTimeout(() => setSavedSettingsToast(false), 2000);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-card border border-border p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow">
            Souqly
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                {lang === "ar" ? "لوحة الإدارة المركزية والرقابة" : "Souqly Platform Administration"}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {lang === "ar" ? "مشرف النظام" : "Super Admin"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar" ? "مراقبة العمليات الحية، وتوثيق المتاجر، ونسب العمولات والتحصيلات في دول الخليج" : "Live GMV monitoring, merchant verification and platform operations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sell"
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            {lang === "ar" ? "لوحة التاجر" : "Seller Portal"}
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {lang === "ar" ? "واجهة المتجر" : "Marketplace"}
          </Link>
        </div>
      </div>

      {/* Global Platform KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي مبيعات المنصة (GMV)" : "Gross Merchandise Value"}
            </span>
            <DollarSign className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{price(gmv)}</div>
          <span className="text-[11px] font-semibold text-emerald-600">↑ +24.8% {lang === "ar" ? "نمو ربع سنوي" : "QoQ Growth"}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? `أرباح عمولة سوقلي (${commissionRate}%)` : `Souqly Net Take Rate (${commissionRate}%)`}
            </span>
            <Percent className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{price(platformRevenue)}</div>
          <span className="text-[11px] font-semibold text-muted-foreground">{lang === "ar" ? "صافي الدخل التشغيلي" : "Net Platform Fees"}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "المتاجر المعتمدة والنشطة" : "Active Merchants"}
            </span>
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{stores.length}</div>
          <span className="text-[11px] font-semibold text-emerald-600">
            {stores.filter((s) => s.isVerified).length} {lang === "ar" ? "موثق بشهادة رسمية" : "Verified"}
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي طلبات المشترين" : "Total Buyer Orders"}
            </span>
            <ShoppingBag className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{orders.length + 84}</div>
          <span className="text-[11px] font-semibold text-emerald-600">
            {orders.filter((o) => o.status === "delivered").length + 72} {lang === "ar" ? "تم تسليمها بنجاح" : "Delivered"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex border-b border-border">
        <button
          onClick={() => setActiveTab("merchants")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "merchants"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Store className="h-4 w-4" />
          {lang === "ar" ? "إدارة المتاجر والتوثيق" : "Merchants & Verification"} ({stores.length})
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "products"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          {lang === "ar" ? "كتالوج ورقابة المنتجات" : "Catalog & Moderation"} ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "orders"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {lang === "ar" ? "سجل طلبات المنصة" : "Platform Orders Feed"} ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("financials")}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition ${
            activeTab === "financials"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Percent className="h-4 w-4" />
          {lang === "ar" ? "العمولات والإعدادات" : "Commissions & Settings"}
        </button>
      </div>

      {/* Tab 1: Merchants & Verification */}
      {activeTab === "merchants" && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold">{lang === "ar" ? "المتاجر المسجلة في سوقلي" : "Registered Partner Stores"}</h2>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder={lang === "ar" ? "بحث عن متجر أو مالك..." : "Search merchant..."}
                className="w-full rounded-lg border border-input bg-background ps-9 pe-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute start-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-start text-sm">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3 text-start">{lang === "ar" ? "المتجر" : "Store Name"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "المالك / المسؤول" : "Owner"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "النشاط" : "Category"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "المبيعات" : "Total Volume"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "حالة التوثيق" : "Verification"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "حالة الحساب" : "Status"}</th>
                  <th className="p-3 text-end">{lang === "ar" ? "إجراءات الرقابة" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStores.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition">
                    <td className="p-3">
                      <div className="font-bold flex items-center gap-1.5">
                        <Store className="h-4 w-4 text-gold shrink-0" />
                        <span>{s.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{s.email}</span>
                    </td>
                    <td className="p-3 text-xs">{s.owner}</td>
                    <td className="p-3 text-xs font-medium text-muted-foreground">{s.category}</td>
                    <td className="p-3 font-bold text-foreground">{price(s.totalSales)}</td>
                    <td className="p-3">
                      {s.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          {lang === "ar" ? "موثق" : "Verified"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          {lang === "ar" ? "قيد المراجعة" : "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                          s.status === "active" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {s.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "موقوف" : "Suspended")}
                      </span>
                    </td>
                    <td className="p-3 text-end">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to="/store/$id"
                          params={{ id: s.id }}
                          className="inline-flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
                          title={lang === "ar" ? "زيارة واجهة المتجر" : "View Storefront"}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>{lang === "ar" ? "عرض المتجر" : "View"}</span>
                        </Link>

                        <button
                          onClick={() => toggleStoreVerification(s.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                            s.isVerified
                              ? "border-input text-muted-foreground hover:bg-muted"
                              : "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {s.isVerified
                            ? lang === "ar" ? "إلغاء التوثيق" : "Revoke"
                            : lang === "ar" ? "توثيق الآن 🛡️" : "Verify Store"}
                        </button>

                        <button
                          onClick={() => toggleStoreStatus(s.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                            s.status === "active"
                              ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                              : "border-primary/30 text-primary hover:bg-primary/10"
                          }`}
                        >
                          {s.status === "active" ? (lang === "ar" ? "إيقاف" : "Suspend") : (lang === "ar" ? "تفعيل" : "Activate")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Moderation */}
      {activeTab === "products" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{lang === "ar" ? "جميع المنتجات المعروضة في سوقلي" : "All Marketplace Products"}</h2>
            <span className="text-xs text-muted-foreground">
              {products.length} {lang === "ar" ? "منتج نشط بالمنصة" : "products live"}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-start text-sm">
              <thead className="bg-muted/50 text-xs font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3 text-start">{lang === "ar" ? "المنتج" : "Product"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "المتجر البائع" : "Seller"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "القسم" : "Category"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "السعر" : "Price"}</th>
                  <th className="p-3 text-start">{lang === "ar" ? "المخزون" : "Stock"}</th>
                  <th className="p-3 text-end">{lang === "ar" ? "حذف المنتج المخالف" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-secondary shrink-0" />
                        <div>
                          <Link to="/product/$id" params={{ id: p.id }} className="font-semibold hover:text-primary line-clamp-1">
                            {p.name[lang]}
                          </Link>
                          <span className="text-[11px] text-gold font-bold">★ {p.rating} ({p.reviews})</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs font-medium text-foreground">{p.seller}</td>
                    <td className="p-3 text-xs text-muted-foreground">{p.category[lang]}</td>
                    <td className="p-3 font-bold text-foreground">{price(p.price)}</td>
                    <td className="p-3 text-xs">{p.stock ?? 25} {lang === "ar" ? "قطعة" : "pcs"}</td>
                    <td className="p-3 text-end">
                      <button
                        onClick={() => {
                          if (confirm(lang === "ar" ? "هل ترغب في إزالة هذا المنتج من الكتالوج العام؟" : "Remove this item?")) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="rounded-md border border-destructive/20 p-1.5 text-destructive hover:bg-destructive/10"
                        title={lang === "ar" ? "حذف المنتج" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Feed */}
      {activeTab === "orders" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "متابعة جميع طلبات المشترين بالخليج" : "All Platform Orders Feed"}</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{o.id}</span>
                    <span className="text-xs text-muted-foreground">({o.city}، {o.country})</span>
                    <span className="text-xs font-semibold text-foreground">• {o.customerName}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {o.items.map((i) => `${i.name[lang] || i.name.ar} (x${i.quantity})`).join("، ")}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <span className="font-black text-sm text-foreground">{price(o.total)}</span>
                    <span className="block text-[10px] text-muted-foreground">{o.paymentMethod}</span>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      o.status === "delivered"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : o.status === "shipped"
                        ? "bg-blue-500/15 text-blue-600"
                        : "bg-amber-500/15 text-amber-600"
                    }`}
                  >
                    {o.status === "delivered" ? (lang === "ar" ? "تم التوصيل" : "Delivered") : o.status === "shipped" ? (lang === "ar" ? "مشحون" : "Shipped") : (lang === "ar" ? "قيد التجهيز" : "Processing")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Financials & Commission */}
      {activeTab === "financials" && (
        <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Percent className="h-5 w-5 text-gold" />
            {lang === "ar" ? "إعدادات العمولة والأرباح التشغيلية" : "Commission & Platform Take Rate"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "يتم خصم هذه النسبة تلقائياً من إجمالي كل عملية بيع لصالح منصة سوقلي وتحويل الباقي لحساب التاجر."
              : "This percentage is retained by Souqly on every transaction before merchant payout."}
          </p>

          {savedSettingsToast && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 p-3 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {lang === "ar" ? "تم تحديث نسبة عمولة المنصة بنجاح!" : "Commission rate updated successfully!"}
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "نسبة عمولة منصة سوقلي (%)" : "Platform Commission Rate (%)"}
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={commRateInput}
                  onChange={(e) => setCommRateInput(Number(e.target.value))}
                  className="w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-bold text-muted-foreground">%</span>
              </div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span>{lang === "ar" ? "مثال لعملية بيع بقيمة 1,000 ر.س:" : "Example on 1,000 SAR sale:"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "ربح منصة سوقلي الصافي:" : "Souqly Platform Fee:"}</span>
                <span className="font-bold text-emerald-600">{price(1000 * (commRateInput / 100))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{lang === "ar" ? "المحول لحساب التاجر البنكي:" : "Merchant Payout:"}</span>
                <span className="font-bold text-foreground">{price(1000 * (1 - commRateInput / 100))}</span>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
            >
              {lang === "ar" ? "حفظ وتطبيق النسبة فوراً" : "Save Commission Rate"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
