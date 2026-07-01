"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardStats } from "./components/DashboardStats";
import { DashboardFilters } from "./components/DashboardFilters";
import { InternTable } from "./components/InternTable";
import { MessageList } from "./components/MessageList";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Check,
  X,
  LogOut,
  Terminal,
  RefreshCw,
  Search,
  Filter,
  GraduationCap,
  MessageSquare,
  Trash2,
  Send,
  FileText,
  Award
} from "lucide-react";
import { tracks } from "@/lib/curriculum";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

interface Intern {
  id: string;
  fullName: string;
  email: string;
  university: string;
  trackSelected: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  rollNumber: string;
  applicationTimestamp: string;
  status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  certificateNumber: string | null;
  submissionData: null | {
    submissionTimestamp: string;
    githubRepositoryUrl: string;
    liveDeploymentUrl?: string;
    figmaProjectUrl?: string;
    studentNotes: string;
    completedTaskCount: number;
    completedTasks: number[];
  };
}

interface ClientMessage {
  id: string;
  clientName: string;
  clientEmail: string;
  organization: string;
  serviceType: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'UNREAD' | 'READ' | 'RESPONDED';
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"INTERNS" | "MESSAGES">("INTERNS");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTrack, setSelectedTrack] = useState<string>("ALL");

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    submitted: 0,
    approved: 0,
    rejected: 0
  });

  const [processingRoll, setProcessingRoll] = useState<string | null>(null);
  const [processingMessageId, setProcessingMessageId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [resendingRoll, setResendingRoll] = useState<string | null>(null);

  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeConfirmationText, setPurgeConfirmationText] = useState("");
  const [isPurging, setIsPurging] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/applications");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load database records.");
      }
      const fetchedInterns = data.interns as Intern[];
      setInterns(fetchedInterns);

      const total = fetchedInterns.length;
      const applied = fetchedInterns.filter(x => x.status === "APPLIED").length;
      const submitted = fetchedInterns.filter(x => x.status === "SUBMITTED").length;
      const approved = fetchedInterns.filter(x => x.status === "APPROVED").length;
      const rejected = fetchedInterns.filter(x => x.status === "REJECTED").length;

      setStats({ total, applied, submitted, approved, rejected });
    } catch (err: any) {
      setError(err.message || "An error occurred fetching telemetry records.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/messages");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load client inquiries.");
      }
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching client messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const refreshAllData = async () => {
    if (activeTab === "INTERNS") {
      await fetchApplications();
    } else {
      await fetchMessages();
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchMessages();
  }, []);

  const handleAction = useCallback(async (rollNumber: string, action: "APPROVE" | "REJECT") => {
    if (processingRoll) return;

    setProcessingRoll(rollNumber);
    setError(null);
    setActionSuccessMessage(null);

    try {
      const response = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to execute action ${action}.`);
      }

      setActionSuccessMessage(data.message);

      await fetchApplications();
      await fetchMessages();

      setTimeout(() => {
        setActionSuccessMessage(null);
      }, 5000);

    } catch (err: any) {
      setError(err.message || "Action execution failed.");
    } finally {
      setProcessingRoll(null);
    }
  }, [processingRoll]);

  const handleMessageStatus = useCallback(async (messageId: string, newStatus: 'UNREAD' | 'READ' | 'RESPONDED') => {
    if (processingMessageId) return;

    setProcessingMessageId(messageId);
    setError(null);
    setActionSuccessMessage(null);

    try {
      const response = await fetch("/api/admin/messages/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to update status to ${newStatus}.`);
      }

      setActionSuccessMessage(data.message || "Client message status updated successfully.");

      await fetchMessages();

      setTimeout(() => {
        setActionSuccessMessage(null);
      }, 5000);

    } catch (err: any) {
      setError(err.message || "Message action failed.");
    } finally {
      setProcessingMessageId(null);
    }
  }, [processingMessageId]);

  const handleResend = useCallback(async (rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE") => {
    if (resendingRoll) return;
    setResendingRoll(`${rollNumber}-${type}`);
    setError(null);
    setActionSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, type }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Resend failed.");
      setActionSuccessMessage(data.message);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Resend failed.");
    } finally {
      setResendingRoll(null);
    }
  }, [resendingRoll]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/");
      router.refresh();
    }
  };

  const handlePurgeDatabase = async () => {
    if (purgeConfirmationText.trim().toUpperCase() !== "PURGE") {
      setError("Please type 'PURGE' in the text field to confirm database deletion.");
      return;
    }

    setIsPurging(true);
    setError(null);
    setActionSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/purge", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to purge database records.");
      }
      setActionSuccessMessage(data.message || "Database purged successfully.");
      setInterns([]);
      setStats({
        total: 0,
        applied: 0,
        submitted: 0,
        approved: 0,
        rejected: 0
      });
      setShowPurgeModal(false);
      setPurgeConfirmationText("");

      await fetchMessages();
    } catch (err: any) {
      setError(err.message || "An error occurred during database purging.");
    } finally {
      setIsPurging(false);
    }
  };

  const filteredInterns = useMemo(() => {
    return interns.filter((intern) => {
      const matchesSearch =
        intern.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.university.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === "ALL" || intern.status === selectedStatus;
      const matchesTrack = selectedTrack === "ALL" || intern.trackSelected === selectedTrack;

      return matchesSearch && matchesStatus && matchesTrack;
    });
  }, [interns, searchTerm, selectedStatus, selectedTrack]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === "ALL" || msg.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, selectedStatus]);

  const messageStats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(x => x.status === "UNREAD").length,
    read: messages.filter(x => x.status === "READ").length,
    responded: messages.filter(x => x.status === "RESPONDED").length
  }), [messages]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-8 min-h-screen">
      <AnimateOnScroll variant="fadeUp">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/5">
          <div className="space-y-2">
            <span className="section-label">
              <Terminal className="w-3.5 h-3.5" />
              System Console Active
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
              Operator <span className="text-gradient-brand">Console Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xl">
              Admin review center for vetting submitted curriculum modules, reviewing client inquiries, and generating secure, immutable credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshAllData}
              disabled={isLoading || isLoadingMessages}
              className="btn-secondary px-3 py-2.5 text-xs"
              title="Refresh current database"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoading || isLoadingMessages) ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setShowPurgeModal(true)}
              className="btn-secondary px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10"
              title="Purge fake student records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Fake Data
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fadeUp" delay={0.1}>
        {error && (
          <div className="glass-card rounded-xl p-4 flex items-start gap-3 text-rose-700 dark:text-rose-200 text-sm border-rose-500/20">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">System Error Blocked:</span> {error}
            </div>
          </div>
        )}

        {actionSuccessMessage && (
          <div className="glass-card rounded-xl p-4 flex items-start gap-3 text-emerald-700 dark:text-emerald-200 text-sm border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Execution Successful:</span> {actionSuccessMessage}
            </div>
          </div>
        )}
      </AnimateOnScroll>

      <DashboardStats
        activeTab={activeTab}
        stats={stats}
        messageStats={messageStats}
      />

      <AnimateOnScroll variant="fadeUp" delay={0.15}>
        <div className="flex justify-center md:justify-start">
          <div className="glass-card p-1 rounded-xl flex gap-1">
            <button
              onClick={() => {
                setActiveTab("INTERNS");
                setSelectedStatus("ALL");
                setSearchTerm("");
              }}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "INTERNS"
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 border border-transparent hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Intern Applications
              {stats.submitted > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30">
                  {stats.submitted}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("MESSAGES");
                setSelectedStatus("ALL");
                setSearchTerm("");
              }}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "MESSAGES"
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 border border-transparent hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Client Inquiries
              {messageStats.unread > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full border border-brand-500/30 animate-pulse">
                  {messageStats.unread}
                </span>
              )}
            </button>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fadeUp" delay={0.2}>
        <DashboardFilters
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        />
      </AnimateOnScroll>

      <AnimateOnScroll variant="fadeUp" delay={0.25}>
        <div className="glass-card rounded-xl overflow-hidden">
          {activeTab === "INTERNS" ? (
            <InternTable
              isLoading={isLoading}
              filteredInterns={filteredInterns}
              tracks={tracks}
              processingRoll={processingRoll}
              resendingRoll={resendingRoll}
              handleAction={handleAction}
              handleResend={handleResend}
              formatDate={formatDate}
            />
          ) : (
            <MessageList
              isLoadingMessages={isLoadingMessages}
              filteredMessages={filteredMessages}
              processingMessageId={processingMessageId}
              handleMessageStatus={handleMessageStatus}
              formatDate={formatDate}
            />
          )}
        </div>
      </AnimateOnScroll>

      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <AnimateOnScroll variant="scaleUp">
            <div className="glass-card w-full max-w-md mx-4 p-6 rounded-2xl border border-rose-500/20 shadow-2xl space-y-6 text-slate-800 dark:text-slate-100">
              <div className="flex items-center gap-3 text-rose-500">
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                    Confirm Database Purge
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Critical system operations alert
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  You are about to perform a <span className="font-bold text-rose-500">destructive database purge</span>. This operation will:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                  <li>Permanently delete ALL student internship records</li>
                  <li>Clear all certificate credentials & records</li>
                  <li>Reset auto-increment sequence roll-counters to 0</li>
                </ul>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  This action is irreversible. All generated offer letters and verification links will be broken.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Type <span className="text-rose-500 font-bold">PURGE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={purgeConfirmationText}
                  onChange={(e) => setPurgeConfirmationText(e.target.value)}
                  placeholder="Type PURGE here..."
                  className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPurgeModal(false);
                    setPurgeConfirmationText("");
                  }}
                  disabled={isPurging}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePurgeDatabase}
                  disabled={isPurging || purgeConfirmationText.trim().toUpperCase() !== "PURGE"}
                  className="btn-primary px-4 py-2 text-xs !bg-rose-600 !shadow-rose-500/30 hover:!bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
                >
                  {isPurging ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  Purge Database
                </button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      )}
    </div>
  );
}
