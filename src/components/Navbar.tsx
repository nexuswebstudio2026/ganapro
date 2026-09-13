import React from 'react';
import { User } from '../types';
import { Coins, LogOut, Menu, Wallet } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onSyncSheets?: () => void;
  isSyncingSheets?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onToggleSidebar,
  onLogout,
  onSyncSheets,
  isSyncingSheets = false
}) => {
  const acumulado = currentUser.acumulado !== undefined ? currentUser.acumulado : currentUser.balance;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-slate-900 leading-none">
                  Gana<span className="text-emerald-600">Pro</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 hidden sm:inline">
                  Encuestas & Tareas Remuneradas
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Saldo Acumulado Vinculado a Google Sheets */}
            <div className="bg-slate-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2.5 sm:gap-3 shadow-md border border-slate-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none">
                    Saldo Acumulado
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-800/80 hidden sm:inline-block">
                    Sheets
                  </span>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400 leading-tight">
                  ${acumulado.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-black text-[10px] rounded border border-indigo-200">
                    Nivel {currentUser.level || 1}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded uppercase shadow-xs">
                      ADMIN
                    </span>
                  )}
                  <span className="text-sm font-bold text-slate-800">
                    {currentUser.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                  {currentUser.email}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
