'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed z-50 left-1/2 top-1/2 w-full max-w-md px-4"
            style={{ transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(15,20,35,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: danger ? 'rgba(248,113,113,0.15)' : 'rgba(6,182,212,0.12)',
                  }}
                >
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: danger ? '#f87171' : '#22d3ee' }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: danger
                      ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
                      : 'linear-gradient(135deg,#0ea5e9,#6366f1)',
                    color: '#fff',
                    boxShadow: danger ? '0 4px 16px rgba(220,38,38,0.3)' : '0 4px 16px rgba(14,165,233,0.3)',
                  }}
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
