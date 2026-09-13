import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
import { Wallet, Mail, Lock, User as UserIcon, ArrowRight, UserPlus, ShieldCheck, KeyRound, Gift } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (data: {
    name: string;
    email: string;
    password: string;
    paymentMethod: PaymentMethod;
    referralCode?: string;
  }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPaymentMethod, setRegPaymentMethod] = useState<PaymentMethod>('Llave Bre-B');
  const [regReferralCode, setRegReferralCode] = useState('');

  // Auto-detect referral code from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setRegReferralCode(ref.toUpperCase());
        setActiveTab('register');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword);
  };

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      name: regName,
      email: regEmail,
      password: regPassword,
      paymentMethod: regPaymentMethod,
      referralCode: regReferralCode.trim()
    });
  };

  const fillAdminCredentials = () => {
    setActiveTab('login');
    setLoginEmail('admin@ganapro.com');
    setLoginPassword('admin');
  };

  const fillUser1Credentials = () => {
    setActiveTab('login');
    setLoginEmail('usuario1@ganapro.com');
    setLoginPassword('1234');
  };

  const fillUser5Credentials = () => {
    setActiveTab('login');
    setLoginEmail('usuario5@ganapro.com');
    setLoginPassword('1234');
  };

  const fillUser4Credentials = () => {
    setActiveTab('login');
    setLoginEmail('usuario4@ganapro.com');
    setLoginPassword('1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="bg-white/95 backdrop-blur-md w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
        {/* Logo / Cabecera */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-lg mb-3 transform hover:scale-105 transition-transform">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gana<span className="text-emerald-600">Pro</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Encuestas con IA (hasta $20.000) • Tareas (hasta $50.000) • Referidos ($1.000)
          </p>
        </div>

        {/* Tabs Login / Registro */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'text-emerald-800 bg-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'text-emerald-800 bg-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={submitLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ingresar a mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={submitRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  minLength={4}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Método de Retiro Predeterminado
              </label>
              <div className="w-full px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 flex items-center justify-between">
                <span>Llave Bre-B (Llave de Breve)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-md">
                  Inmediato
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Recibirás tus retiros directamente a través del sistema interoperable Bre-B.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Código de Referido (Opcional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 text-amber-500 w-4 h-4" />
                <input
                  type="text"
                  value={regReferralCode}
                  onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                  placeholder="Ej: GP-ADMIN"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono uppercase text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Si un amigo te invitó, ingresa su código para apoyarlo con $1.000 COP.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Crear Cuenta Gratis</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3 text-center">
          {/* Admin and Demo Users Credentials Quick Hint */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 flex flex-col gap-2">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                Cuentas de Prueba Vinculadas a Google Sheets:
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={fillUser4Credentials}
                className="p-1.5 bg-amber-100/80 hover:bg-amber-100 rounded border border-amber-300 text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-amber-900">Usuario 4 (Nivel 1)</div>
                <div className="text-[10px] text-slate-500">Prueba Ascenso</div>
              </button>

              <button
                type="button"
                onClick={fillUser1Credentials}
                className="p-1.5 bg-white/90 hover:bg-white rounded border border-amber-200 text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-emerald-800">Usuario 1 (Nivel 2)</div>
                <div className="text-[10px] text-slate-500">$80k Sheets</div>
              </button>

              <button
                type="button"
                onClick={fillUser5Credentials}
                className="p-1.5 bg-white/90 hover:bg-white rounded border border-amber-200 text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-indigo-800">Usuario 5 (Nivel 3)</div>
                <div className="text-[10px] text-slate-500">$150k Sheets</div>
              </button>

              <button
                type="button"
                onClick={fillAdminCredentials}
                className="p-1.5 bg-white/90 hover:bg-white rounded border border-amber-200 text-left cursor-pointer transition-colors shadow-2xs"
              >
                <div className="font-bold text-slate-900">Admin (Nivel 4)</div>
                <div className="text-[10px] text-slate-500">admin@ganapro</div>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Pagos directos garantizados al acumular tu saldo.
          </p>
        </div>
      </div>
    </div>
  );
};
