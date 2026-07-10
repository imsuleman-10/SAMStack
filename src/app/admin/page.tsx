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
  Award,
  Download
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
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

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

  const [showAddModal, setShowAddModal] = useState(false);
  const [newIntern, setNewIntern] = useState({ fullName: "", email: "", university: "", trackSelected: "PYTHON" });
  const [isAddingIntern, setIsAddingIntern] = useState(false);

  const [showDirectSendModal, setShowDirectSendModal] = useState(false);
  const [directSendRoll, setDirectSendRoll] = useState("");
  const [directSendType, setDirectSendType] = useState<"OFFER_LETTER" | "CERTIFICATE">("OFFER_LETTER");
  const [isSendingDirect, setIsSendingDirect] = useState(false);

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
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
      router.push("/");
      router.refresh();
    }
  };

  const handleAddIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingIntern(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/interns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIntern),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add intern.");
      setActionSuccessMessage(data.message);
      setShowAddModal(false);
      setNewIntern({ fullName: "", email: "", university: "", trackSelected: "PYTHON" });
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || "Failed to add intern.");
    } finally {
      setIsAddingIntern(false);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this intern record? This cannot be undone.")) return;
    setError(null);
    try {
      const response = await fetch(`/api/admin/interns/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete intern.");
      setActionSuccessMessage(data.message);
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || "Failed to delete intern.");
    } finally {
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  }, []);

  const handleDirectSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directSendRoll.trim()) return;
    setIsSendingDirect(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/send-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: directSendRoll.trim(), type: directSendType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Direct send failed.");
      setActionSuccessMessage(data.message);
      setShowDirectSendModal(false);
      setDirectSendRoll("");
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || "Direct send failed.");
    } finally {
      setIsSendingDirect(false);
      setTimeout(() => setActionSuccessMessage(null), 6000);
    }
  };

  const handleDownload = useCallback((rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE") => {
    window.open(`/api/admin/download?rollNumber=${rollNumber}&type=${type}`, "_blank");
  }, []);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === "INTERNS") {
      csvContent += "ID,Name,Email,University,Track,RollNumber,Status,AppliedOn\n";
      filteredInterns.forEach(intern => {
        const row = [
          intern.id,
          `"${intern.fullName.replace(/"/g, '""')}"`,
          `"${intern.email}"`,
          `"${intern.university.replace(/"/g, '""')}"`,
          intern.trackSelected,
          intern.rollNumber,
          intern.status,
          intern.applicationTimestamp
        ].join(",");
        csvContent += row + "\r\n";
      });
    } else {
      csvContent += "ID,ClientName,ClientEmail,Organization,ServiceType,Budget,Status,Timestamp\n";
      filteredMessages.forEach(msg => {
        const row = [
          msg.id,
          `"${msg.clientName.replace(/"/g, '""')}"`,
          `"${msg.clientEmail}"`,
          `"${msg.organization.replace(/"/g, '""')}"`,
          `"${msg.serviceType}"`,
          `"${msg.budget}"`,
          msg.status,
          msg.timestamp
        ].join(",");
        csvContent += row + "\r\n";
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `samstack_export_${activeTab.toLowerCase()}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="section-label flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> System Console Active</span>
              {currentTime && <span className="pl-2 border-l border-brand-500/30 font-mono text-[10px] opacity-80">{currentTime.toLocaleTimeString()}</span>}
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
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-4 py-2.5 text-xs bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-2 border-brand-500/30"
              title="Add New Intern"
            >
              <Users className="w-3.5 h-3.5" />
              Add Intern
            </button>

            <button
              onClick={() => setShowDirectSendModal(true)}
              className="btn-primary px-4 py-2.5 text-xs !bg-amber-600 hover:!bg-amber-500 text-white flex items-center gap-2"
              title="Directly send offer letter or certificate to any intern"
            >
              <Send className="w-3.5 h-3.5" />
              Direct Send
            </button>

            <button
              onClick={refreshAllData}
              disabled={isLoading || isLoadingMessages}
              className="btn-secondary px-3 py-2.5 text-xs"
              title="Refresh current database"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoading || isLoadingMessages) ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-secondary px-4 py-2.5 text-xs text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-500/10"
              title="Export current view to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Export
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
          <div className="glass-card p-1 rounded-xl flex flex-col sm:flex-row w-full sm:w-auto gap-1">
            <button
              onClick={() => {
                setActiveTab("INTERNS");
                setSelectedStatus("ALL");
                setSearchTerm("");
              }}
              className={`w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
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
              className={`w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
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
              handleDownload={handleDownload}
              handleDelete={handleDelete}
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <AnimateOnScroll variant="scaleUp">
            <div className="glass-card w-full max-w-md mx-4 p-6 rounded-2xl border border-brand-500/20 shadow-2xl space-y-6 text-slate-800 dark:text-slate-100">
              <div className="flex items-center gap-3 text-brand-500">
                <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                    Add New Intern
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Manually enroll a candidate
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddIntern} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newIntern.fullName}
                    onChange={e => setNewIntern({...newIntern, fullName: e.target.value})}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">Email</label>
                  <input
                    type="email"
                    required
                    value={newIntern.email}
                    onChange={e => setNewIntern({...newIntern, email: e.target.value})}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">University</label>
                  <input
                    type="text"
                    required
                    value={newIntern.university}
                    onChange={e => setNewIntern({...newIntern, university: e.target.value})}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">Track</label>
                  <select
                    value={newIntern.trackSelected}
                    onChange={e => setNewIntern({...newIntern, trackSelected: e.target.value})}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all"
                  >
                    {Object.keys(tracks).map(trackKey => (
                      <option key={trackKey} value={trackKey}>{tracks[trackKey].title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isAddingIntern}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingIntern}
                    className="btn-primary px-4 py-2 text-xs flex items-center gap-2"
                  >
                    {isAddingIntern ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Add Intern
                  </button>
                </div>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      )}
      {showDirectSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <AnimateOnScroll variant="scaleUp">
            <div className="glass-card w-full max-w-md mx-4 p-6 rounded-2xl border border-amber-500/20 shadow-2xl space-y-6 text-slate-800 dark:text-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Send className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                    Direct Send
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Send credentials to any intern instantly — no approval needed
                  </p>
                </div>
              </div>

              <form onSubmit={handleDirectSend} className="space-y-4">

                {/* Roll Number Selector */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">Select Intern</label>
                  <select
                    required
                    value={directSendRoll}
                    onChange={e => setDirectSendRoll(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
                  >
                    <option value="">— Choose an intern —</option>
                    {interns.map(i => (
                      <option key={i.rollNumber} value={i.rollNumber}>
                        {i.fullName} ({i.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500">Document to Send</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDirectSendType("OFFER_LETTER")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        directSendType === "OFFER_LETTER"
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                          : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-brand-400"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Offer Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectSendType("CERTIFICATE")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        directSendType === "CERTIFICATE"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-amber-400"
                      }`}
                    >
                      <Award className="w-5 h-5" />
                      Certificate
                    </button>
                  </div>
                  {directSendType === "CERTIFICATE" && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                      ⚡ A certificate will be auto-generated and the intern's status will be set to APPROVED automatically.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowDirectSendModal(false); setDirectSendRoll(""); }}
                    disabled={isSendingDirect}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingDirect || !directSendRoll}
                    className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
                  >
                    {isSendingDirect ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send Now
                  </button>
                </div>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      )}
    </div>
  );
}
