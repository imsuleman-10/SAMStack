import React from "react";
import { MessageSquare, Check, Clock } from "lucide-react";

interface MessageListProps {
  isLoadingMessages: boolean;
  filteredMessages: any[];
  processingMessageId: string | null;
  handleMessageStatus: (id: string, status: "READ" | "RESPONDED" | "UNREAD") => void;
  formatDate: (timestamp: any) => string;
}

export const MessageList = React.memo(function MessageList({
  isLoadingMessages,
  filteredMessages,
  processingMessageId,
  handleMessageStatus,
  formatDate
}: MessageListProps) {
  if (isLoadingMessages) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-indigo-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        </div>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Loading Inquiries Database...</span>
      </div>
    );
  }

  if (filteredMessages.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-center">
          <MessageSquare className="w-7 h-7 text-slate-400 dark:text-slate-600" />
        </div>
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No client messages matched filters.</h3>
        <p className="text-sm text-slate-500 font-mono">Any inquiries received from the Services page will display here.</p>
      </div>
    );
  }

  const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
    UNREAD: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200", darkBg: "dark:bg-amber-500/10", darkText: "dark:text-amber-400", darkBorder: "dark:border-amber-500/20" },
    READ: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-200", darkBg: "dark:bg-white/5", darkText: "dark:text-slate-400", darkBorder: "dark:border-white/10" },
    RESPONDED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", darkBg: "dark:bg-emerald-500/10", darkText: "dark:text-emerald-400", darkBorder: "dark:border-emerald-500/20" },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <th className="py-4 px-6">Client info</th>
            <th className="py-4 px-6">Required Service</th>
            <th className="py-4 px-6">Budget</th>
            <th className="py-4 px-6">Project Goals / Details</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
          {filteredMessages.map((msg) => {
            const sc = statusConfig[msg.status];
            return (
              <tr key={msg.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.015]">
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400 shrink-0">
                      {msg.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{msg.clientName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex flex-col gap-0.5">
                        <a href={`mailto:${msg.clientEmail}`} className="truncate max-w-[180px] hover:text-brand-600 dark:hover:text-brand-400 transition-colors" title={msg.clientEmail}>
                          {msg.clientEmail}
                        </a>
                        <span className="text-[11px] text-slate-500">{msg.organization || "No Organization Specified"}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6 align-top">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/15 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                      {msg.serviceType}
                    </span>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Received: {formatDate(msg.timestamp)}
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {msg.budget}
                </td>

                <td className="py-5 px-6">
                  <div className="text-sm text-slate-700 dark:text-slate-300 max-w-md whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </div>
                </td>

                <td className="py-5 px-6 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${sc.bg} ${sc.text} ${sc.border} ${sc.darkBg} ${sc.darkText} ${sc.darkBorder}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {msg.status.toLowerCase()}
                  </span>
                </td>

                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {msg.status === "UNREAD" && (
                      <button
                        disabled={processingMessageId !== null}
                        onClick={() => handleMessageStatus(msg.id, "READ")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-neutral-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Mark Read
                      </button>
                    )}

                    {msg.status !== "RESPONDED" ? (
                      <button
                        disabled={processingMessageId !== null}
                        onClick={() => handleMessageStatus(msg.id, "RESPONDED")}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Responded
                      </button>
                    ) : (
                      <button
                        disabled={processingMessageId !== null}
                        onClick={() => handleMessageStatus(msg.id, "UNREAD")}
                        className="px-3 py-1.5 bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold rounded-lg border border-slate-200 dark:border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        Reset status
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
