import React from "react";
import { Search, Filter } from "lucide-react";

interface DashboardFiltersProps {
  activeTab: "INTERNS" | "MESSAGES";
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedTrack: string;
  setSelectedTrack: (value: string) => void;
}

const statusOptions = {
  INTERNS: [
    { value: "ALL", label: "All Statuses" },
    { value: "SUBMITTED", label: "Pending (Submitted)" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "APPLIED", label: "Applied Only" },
  ],
  MESSAGES: [
    { value: "ALL", label: "All Inquiries" },
    { value: "UNREAD", label: "Unread" },
    { value: "READ", label: "Read" },
    { value: "RESPONDED", label: "Responded" },
  ],
};

const trackOptions = [
  { value: "ALL", label: "All Specializations" },
  { value: "PYTHON", label: "Python Systems" },
  { value: "UI_UX", label: "UI/UX Design" },
  { value: "CPP", label: "C++ Systems" },
  { value: "WEB_DEV", label: "Core Web Dev" },
  { value: "REACT", label: "React.js Frontend" },
  { value: "NEXT_JS", label: "Next.js Architecture" },
  { value: "MERN", label: "MERN Full Stack" },
];

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-white/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function DashboardFilters({
  activeTab,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedTrack,
  setSelectedTrack
}: DashboardFiltersProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-xs shrink-0">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={activeTab === "INTERNS" ? "Search by name, roll, university..." : "Search client name, email, budget, service..."}
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg placeholder:text-slate-400 bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 text-slate-900 dark:text-white transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:justify-end text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Status:</span>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions[activeTab]}
          />
        </div>

        {activeTab === "INTERNS" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Track:</span>
            <Select
              value={selectedTrack}
              onChange={setSelectedTrack}
              options={trackOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
