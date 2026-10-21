import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  Sparkles,
  Truck,
  RotateCcw,
  CreditCard,
  Store,
  ChevronDown,
  Bot,
  User,
} from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  link?: { url: string; label: string };
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_welcome",
    sender: "bot",
    text: "أهلاً بك في منصة سوقلي مصر والخليج العربي! 👋 كيف يمكن لفريق خدمة العملاء مساعدتك اليوم؟",
    time: "الآن",
  },
];

export function LiveChatWidget() {
  const { lang, user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("bax-live-chat");
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("bax-live-chat", JSON.stringify(messages));
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Auto-reply based on keywords
    setTimeout(() => {
      let botReply: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: "bot",
        text: lang === "ar"
          ? "شكراً لتواصلك مع سوقلي! تم استلام رسالتك وسيتواصل معك ممثل خدمة العملاء المختص خلال دقائق."
          : "Thank you for reaching out! A representative will connect with you shortly.",
        time: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }),
      };

      const lower = text.toLowerCase();
      if (lower.includes("شحن") || lower.includes("تتبع") || lower.includes("توصيل") || lower.includes("ship") || lower.includes("track")) {
        botReply.text = lang === "ar"
          ? "مدة التوصيل في محافظات مصر (القاهرة، الجيزة، الإسكندرية) والرياض ودبي خلال 24 - 48 ساعة. يمكنك تتبع شحناتك الحالية ورؤية الفواتير مباشرة من سجل طلباتك."
          : "Delivery across Egyptian governorates and Gulf cities takes 24-48 hours. You can track your packages directly from your orders page.";
        botReply.link = { url: "/orders", label: lang === "ar" ? "تتبع طلباتي وشحناتي ←" : "Track My Orders →" };
      } else if (lower.includes("فودافون") || lower.includes("فوري") || lower.includes("دفع") || lower.includes("pay") || lower.includes("كاش") || lower.includes("مدى")) {
        botReply.text = lang === "ar"
          ? "ندعم الدفع الفوري بمصر عبر فودافون كاش وإنستاباي، منافذ فوري، بطاقات ميزة، بالإضافة لبطاقات مدى، Apple Pay، والتقسيط على 4 دفعات."
          : "We support Vodafone Cash, InstaPay, Fawry kiosks, Meeza cards, Mada, Apple Pay, Visa, and Tabby installments.";
        botReply.link = { url: "/cart", label: lang === "ar" ? "الذهاب لسلة الشراء والدفع ←" : "Go to Checkout →" };
      } else if (lower.includes("استرجاع") || lower.includes("استبدال") || lower.includes("ضمان") || lower.includes("return") || lower.includes("refund")) {
        botReply.text = lang === "ar"
          ? "نضمن لك استرجاعاً واستبدالاً مجانياً خلال 14 يوماً من استلام الشحنة، مع استرداد كامل أموالك لنفس وسيلة الدفع."
          : "We offer 14-day free returns and complete refunds to your original payment method.";
        botReply.link = { url: "/help", label: lang === "ar" ? "مركز الضمان والمساعدة ←" : "Help & Warranty Center →" };
      } else if (lower.includes("تاجر") || lower.includes("بيع") || lower.includes("متجر") || lower.includes("seller") || lower.includes("store")) {
        botReply.text = lang === "ar"
          ? "يسعدنا انضمامك لشبكة تجار وماركات سوقلي في مصر والخليج! يمكنك فتح متجرك والبدء برفع المنتجات خلال دقائق من مركز البائعين."
          : "Join Souqly's merchant network across Egypt & GCC! Open your storefront in minutes via Seller Central.";
        botReply.link = { url: "/sell", label: lang === "ar" ? "افتح متجرك الآن مجاناً ←" : "Open Your Store →" };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const handleShortcutClick = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="fixed bottom-5 end-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-slate-900 p-3.5 sm:px-4 sm:py-3 text-white shadow-2xl hover:shadow-gold/20 hover:scale-105 transition-all duration-200 cursor-pointer ring-2 ring-gold/40"
          title="محادثة مباشرة مع خدمة العملاء"
        >
          <div className="relative">
            <Headphones className="h-5 w-5 text-gold group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden sm:flex flex-col text-start leading-tight text-xs">
            <span className="font-bold text-white flex items-center gap-1">
              <span>{lang === "ar" ? "محادثة فورية" : "Live Chat"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </span>
            <span className="text-[10px] text-white/70">
              {lang === "ar" ? "دعم مصر والخليج 🇪🇬 🇸🇦" : "Egypt & GCC Support"}
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="flex flex-col w-[92vw] sm:w-96 h-[520px] max-h-[85vh] rounded-3xl border border-border bg-card text-foreground shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary via-slate-900 to-primary p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-slate-950 font-bold shadow-xs">
                <Headphones className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-primary"></span>
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-white flex items-center gap-1">
                  <span>{lang === "ar" ? "خدمة عملاء سوقلي" : "Souqly Customer Support"}</span>
                </h4>
                <p className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{lang === "ar" ? "متصل الآن • الرد فوري" : "Online • Instant reply"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Shortcuts Strip */}
          <div className="bg-secondary/40 border-b border-border p-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleShortcutClick(lang === "ar" ? "أين شحنتي وتفاصيل الشحن؟" : "Where is my order?")}
              className="whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:border-gold/50 transition cursor-pointer"
            >
              🚚 {lang === "ar" ? "تتبع الشحنة" : "Track Order"}
            </button>
            <button
              onClick={() => handleShortcutClick(lang === "ar" ? "طرق الدفع بفودافون كاش أو فوري" : "Vodafone Cash & Fawry")}
              className="whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:border-gold/50 transition cursor-pointer"
            >
              📱 {lang === "ar" ? "فودافون كاش وفوري" : "Payments"}
            </button>
            <button
              onClick={() => handleShortcutClick(lang === "ar" ? "ما هي شروط الاسترجاع؟" : "Return policy")}
              className="whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:border-gold/50 transition cursor-pointer"
            >
              🔄 {lang === "ar" ? "الاسترجاع 14 يوم" : "Returns"}
            </button>
            <button
              onClick={() => handleShortcutClick(lang === "ar" ? "كيف أبدأ البيع كتاجر في سوقلي؟" : "How to sell on Souqly")}
              className="whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:border-gold/50 transition cursor-pointer"
            >
              🏪 {lang === "ar" ? "بِع معنا" : "Become Seller"}
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/15 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/30">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-ee-xs"
                      : "bg-card border border-border text-foreground shadow-2xs rounded-es-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <Link
                      to={m.link.url}
                      onClick={() => setIsOpen(false)}
                      className="inline-block mt-2 font-bold text-primary dark:text-gold underline text-[11px]"
                    >
                      {m.link.label}
                    </Link>
                  )}
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === "user" ? "text-primary-foreground/70 text-end" : "text-muted-foreground"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="rounded-2xl bg-card border border-border px-3 py-2 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === "ar" ? "اكتب رسالتك أو استفسارك هنا..." : "Type your message..."}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold text-slate-950 disabled:opacity-40 transition hover:opacity-90 cursor-pointer shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}