import React, { useState } from 'react';
import { User, REFERRAL_REWARD } from '../types';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  ArrowRight,
  Sparkles,
  UserPlus,
  Coins,
  ShieldCheck
} from 'lucide-react';

interface ReferralsViewProps {
  currentUser: User;
  onSimulateReferral: (friendName: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  currentUser,
  onSimulateReferral,
  onSuccessToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [friendName, setFriendName] = useState('');

  const referralCode = currentUser.referralCode || `GP-${currentUser.name.slice(0, 3).toUpperCase()}${currentUser.id.toString().slice(-3)}`;
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      onSuccessToast('Enlace de referido copiado al portapapeles');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      onSuccessToast('Enlace seleccionado para copiar');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      onSuccessToast('Código de referido copiado');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      onSuccessToast('Código seleccionado');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Únete a GanaPro y gana dinero respondiendo encuestas y tareas remuneradas! Regístrate con mi código ${referralCode} o a través de este enlace: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    onSimulateReferral(friendName.trim());
    setFriendName('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
            <Gift className="w-3.5 h-3.5" />
            <span>3ra Forma de Ganar: Referidos Directos</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gana <span className="text-emerald-400">$1.000 COP</span> por cada amigo invitado
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Comparte tu código o enlace personalizado con tus contactos, grupos de WhatsApp y redes sociales. Cada vez que una persona se registre con tu código, recibirás automáticamente <strong>$1.000 COP</strong> acreditados de inmediato a tu saldo.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir por WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>

        <Users className="w-64 h-64 text-white/5 absolute -right-10 -bottom-10 pointer-events-none" />
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Amigos Referidos
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {currentUser.referralCount || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Ganado por Referidos
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              ${(currentUser.referralEarnings || (currentUser.referralCount || 0) * REFERRAL_REWARD).toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Comisión por Amigo
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              $1.000 COP
            </div>
          </div>
        </div>
      </div>

      {/* Link & Code Box + Invite Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tu Código & Enlace */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Tus Credenciales de Referido</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Tu Código Único de Referido
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 text-sm tracking-widest">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Enlace Directo de Invitación
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sin límite de referidos:</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Entre más amigos compartas, mayores ingresos acumularás en tu billetera. Por ejemplo: 10 amigos = $10.000 COP, 50 amigos = $50.000 COP.
            </p>
          </div>
        </div>

        {/* Simulador / Registro Rápido de Amigo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Simular o Invitar Amigo Ahora</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prueba la acreditación automática ingresando el nombre de un amigo o familiar. Se simulará su registro con tu código y se abonarán <strong>$1.000 COP</strong> a tu saldo al instante.
            </p>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre de tu Amigo / Invitado
              </label>
              <input
                type="text"
                required
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Ej: Carolina Morales"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Registrar Referido y Cobrar $1.000 COP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 3 Formas de Ganar Dinero en GanaPro */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Las 3 Formas de Ganar Dinero en GanaPro:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block font-bold text-indigo-700">1. Encuestas</span>
                <span className="text-[11px] text-slate-500">$2.000 - $20.000</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block font-bold text-emerald-700">2. Tareas</span>
                <span className="text-[11px] text-slate-500">$5.000 - $50.000</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block font-bold text-amber-700">3. Referidos</span>
                <span className="text-[11px] text-slate-500">$1.000 c/u</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
