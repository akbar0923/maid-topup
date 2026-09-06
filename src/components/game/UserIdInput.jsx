import React, { useState } from 'react';
import { User, HelpCircle, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import Modal from '../common/Modal';

export default function UserIdInput({
  inputFields = [],
  inputs = {},
  onChange,
  onVerify,
  isCheckingId,
  nickname,
  idCheckError,
  idGuideTip,
  idGuideImage,
}) {
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-cyan-500/30">
            1
          </div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-white">
            Masukkan Data Akun
          </h3>
        </div>

        {/* Petunjuk ID Button */}
        {idGuideTip && (
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium py-1 px-2.5 rounded-lg hover:bg-cyan-500/10 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Petunjuk ID</span>
          </button>
        )}
      </div>

      {/* Dynamic Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputFields.map((field) => {
          if (field.type === 'select') {
            return (
              <div key={field.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-rose-400">*</span>}
                </label>
                <select
                  value={inputs[field.id] || ''}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl glass-card text-white border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 bg-[#0d1322] cursor-pointer"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.helperText && (
                  <p className="text-[11px] text-slate-400">{field.helperText}</p>
                )}
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-rose-400">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={inputs[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl glass-card text-white placeholder-slate-500 border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition bg-[#0d1322]/50"
              />
              {field.helperText && (
                <p className="text-[11px] text-slate-400">{field.helperText}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Verify Nickname Strip */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          {nickname ? (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Username: <strong>{nickname}</strong>
              </span>
            </div>
          ) : idCheckError ? (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{idCheckError}</span>
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Pastikan User ID dan Server sudah benar sebelum melanjutkan.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onVerify}
          disabled={isCheckingId || !inputs.userId}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium glass-card hover:bg-cyan-500/10 hover:border-cyan-500/40 text-cyan-400 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
        >
          {isCheckingId ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Memeriksa...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cek Nickname</span>
            </>
          )}
        </button>
      </div>

      {/* Petunjuk ID Modal */}
      <Modal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="Petunjuk Menemukan User ID"
      >
        <div className="space-y-4 text-sm">
          {idGuideImage && (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
              <img
                src={idGuideImage}
                alt="Petunjuk User ID"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
            💡 {idGuideTip}
          </div>
          <p className="text-xs text-slate-400">
            Periksa kembali digit ID Anda. Kesalahan pengisian User ID yang mengakibatkan saldo masuk
            ke akun lain tidak dapat dibatalkan.
          </p>
        </div>
      </Modal>
    </div>
  );
}
