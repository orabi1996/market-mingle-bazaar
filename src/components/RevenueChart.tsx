import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Props = {
  gmv: number;
  commissionRate: number;
  lang: "ar" | "en";
  price: (n: number) => string;
};

// Fixed seasonal weights (sum = 1) so the chart is deterministic and SSR-safe.
const MONTHS = [
  { ar: "يناير", en: "Jan", w: 0.07 },
  { ar: "فبراير", en: "Feb", w: 0.065 },
  { ar: "مارس", en: "Mar", w: 0.1 },
  { ar: "أبريل", en: "Apr", w: 0.085 },
  { ar: "مايو", en: "May", w: 0.08 },
  { ar: "يونيو", en: "Jun", w: 0.09 },
  { ar: "يوليو", en: "Jul", w: 0.095 },
  { ar: "أغسطس", en: "Aug", w: 0.09 },
  { ar: "سبتمبر", en: "Sep", w: 0.095 },
  { ar: "أكتوبر", en: "Oct", w: 0.13 },
];

export function RevenueChart({ gmv, commissionRate, lang, price }: Props) {
  const totalWeight = MONTHS.reduce((a, m) => a + m.w, 0);
  const data = MONTHS.map((m) => {
    const sales = Math.round((gmv * m.w) / totalWeight);
    return {
      month: m[lang],
      sales,
      revenue: Math.round(sales * (commissionRate / 100)),
    };
  });

  const config = {
    sales: {
      label: lang === "ar" ? "إجمالي المبيعات (GMV)" : "Gross sales (GMV)",
      color: "var(--primary)",
    },
    revenue: {
      label: lang === "ar" ? "إيراد عمولة سوقلي" : "Souqly commission revenue",
      color: "var(--gold)",
    },
  } satisfies ChartConfig;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          {lang === "ar" ? "منحنى المبيعات وإيرادات العمولة" : "Sales & Commission Trend"}
        </h2>
        <span className="text-[11px] text-muted-foreground">
          {lang === "ar"
            ? "توزيع تقديري موسمي لإجمالي المبيعات الحالي — بيانات توضيحية حتى ربط التحليلات الفعلية"
            : "Seasonal estimate of current GMV — illustrative until live analytics are connected"}
        </span>
      </div>

      <ChartContainer config={config} className="mt-4 h-72 w-full">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            orientation={lang === "ar" ? "right" : "left"}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-6">
                    <span className="text-muted-foreground">{config[name as keyof typeof config]?.label}</span>
                    <span className="font-mono font-bold">{price(Number(value))}</span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="sales"
            type="monotone"
            stroke="var(--color-sales)"
            strokeWidth={2}
            fill="url(#fillSales)"
            isAnimationActive
          />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} barSize={18} />
        </ComposedChart>
      </ChartContainer>
    </motion.section>
  );
}
