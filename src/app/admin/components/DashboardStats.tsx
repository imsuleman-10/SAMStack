import React from "react";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  Check
} from "lucide-react";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

interface DashboardStatsProps {
  activeTab: "INTERNS" | "MESSAGES";
  stats: {
    total: number;
    applied: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  messageStats: {
    total: number;
    unread: number;
    read: number;
    responded: number;
  };
}

const statCards = {
  interns: [
    { label: "All Intake", value: (s: any) => s.total, icon: Users, color: "slate" },
    { label: "Pending Reviews", value: (s: any) => s.submitted, icon: Clock, color: "amber" },
    { label: "Approved", value: (s: any) => s.approved, icon: CheckCircle, color: "emerald" },
    { label: "Rejected", value: (s: any) => s.rejected, icon: AlertCircle, color: "rose" },
    { label: "Awaiting Work", value: (s: any) => s.applied, icon: GraduationCap, color: "cyan" },
  ],
  messages: [
    { label: "Total Inquiries", value: (s: any) => s.total, icon: MessageSquare, color: "slate" },
    { label: "Unread Messages", value: (s: any) => s.unread, icon: Clock, color: "cyan" },
    { label: "Read Messages", value: (s: any) => s.read, icon: Check, color: "slate" },
    { label: "Responded", value: (s: any) => s.responded, icon: CheckCircle, color: "emerald" },
  ],
};

const colorMap: Record<string, { bg: string; text: string; glow: string; darkBg: string; darkText: string }> = {
  slate: { bg: "bg-slate-50", text: "text-slate-600", glow: "bg-slate-500/10", darkBg: "dark:bg-white/[0.03]", darkText: "dark:text-slate-300" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", glow: "bg-amber-500/10", darkBg: "dark:bg-amber-500/[0.04]", darkText: "dark:text-amber-400" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", glow: "bg-emerald-500/10", darkBg: "dark:bg-emerald-500/[0.04]", darkText: "dark:text-emerald-400" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", glow: "bg-rose-500/10", darkBg: "dark:bg-rose-500/[0.04]", darkText: "dark:text-rose-400" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", glow: "bg-cyan-500/10", darkBg: "dark:bg-cyan-500/[0.04]", darkText: "dark:text-cyan-400" },
};

function StatCard({ item, getValue, index }: { item: any; getValue: number; index: number }) {
  const c = colorMap[item.color];
  const Icon = item.icon;
  return (
    <AnimateOnScroll variant="fadeUp" delay={index * 0.08}>
      <div className="glass-card rounded-xl p-5 flex flex-col justify-between hover-lift relative overflow-hidden group">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.glow} blur-3xl`} />
        <span className={`relative text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${c.text} ${c.darkText}`}>
          <Icon className="w-4 h-4" />
          {item.label}
        </span>
        <span className="relative text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-3">
          {getValue}
        </span>
      </div>
    </AnimateOnScroll>
  );
}

export function DashboardStats({ activeTab, stats, messageStats }: DashboardStatsProps) {
  const items = activeTab === "INTERNS" ? statCards.interns : statCards.messages;
  const getValue = (item: any) => item.value(activeTab === "INTERNS" ? stats : messageStats);

  return (
    <div className={`grid grid-cols-2 ${items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4`}>
      {items.map((item, idx) => (
        <StatCard key={item.label} item={item} getValue={getValue(item)} index={idx} />
      ))}
    </div>
  );
}
