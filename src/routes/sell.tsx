import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "بِع على سوقلي | Souqly Sellers" },
      { name: "description", content: "افتح متجرك على سوقلي ووصّل منتجاتك لعملاء الخليج كله." },
      { property: "og:title", content: "بِع على سوقلي" },
      { property: "og:description", content: "افتح متجرك على سوقلي ووصّل منتجاتك لعملاء الخليج." },
    ],
  }),
  component: Sell,
});

const STEPS = {
  ar: [["سجّل متجرك", "بياناتك وبيانات نشاطك التجاري"], ["أضف منتجاتك", "صور وأسعار ومخزون"], ["استقبل الطلبات", "واشحن بنفسك أو نشحن عنك"], ["استلم أرباحك", "تحويل دوري لحسابك البنكي"]],
  en: [["Register your store", "Your business details"], ["List products", "Photos, prices and stock"], ["Get orders", "Ship yourself or let us ship"], ["Get paid", "Regular payouts to your bank"]],
};

function Sell() {
  const { lang, t } = useStore();
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">{t.sell}</h1>
      <p className="mt-3 text-muted-foreground">{lang === "ar" ? "لوحة التاجر قادمة في المرحلة الجاية." : "The seller dashboard is coming in the next phase."}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {STEPS[lang].map(([h, d], i) => (
          <div key={h} className="rounded-xl bg-card p-5 shadow-card">
            <span className="text-3xl font-bold text-gold">{i + 1}</span>
            <h3 className="mt-2 font-semibold">{h}</h3>
            <p className="text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
