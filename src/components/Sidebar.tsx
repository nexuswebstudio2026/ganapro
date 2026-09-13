import React from 'react';
import { ViewTab, User, SURVEY_REWARDS_BY_LEVEL, TASK_REWARDS_BY_LEVEL, UserLevel, WithdrawalRequest } from '../types';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  ArrowRightLeft,
  Table,
  ShieldCheck,
  X,
  Users,
  Award,
  Banknote,
  Check,
  ExternalLink,
  Clock
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  currentUser: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  withdrawalRequests?: WithdrawalRequest[];
  onApproveWithdrawal?: (requestId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  withdrawalRequests = [],
  onApproveWithdrawal
}) => {
  const isAdmin = currentUser.role === 'admin';
  const userLevel = (currentUser.level || 1) as UserLevel;
  const surveyCommission = SURVEY_REWARDS_BY_LEVEL[userLevel] || 2000;
  const taskCommission = TASK_REWARDS_BY_LEVEL[userLevel] || 5000;

  // Filter pending requests
  const pendingRequests = withdrawalRequests.filter(r => r.status === 'Pendiente');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between p-4 shadow-xl md:shadow-none shrink-0 overflow-y-auto custom-scrollbar`}
      >
        <div className="space-y-5">
          <div className="md:hidden flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Menú de Navegación</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => {
                onNavigate('dashboard');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'text-emerald-800 bg-emerald-50 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Panel Principal</span>
            </button>

            <button
              onClick={() => {
                onNavigate('encuestas');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'encuestas'
                  ? 'text-indigo-800 bg-indigo-50 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className={`w-4 h-4 ${currentTab === 'encuestas' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <span>Encuestas IA</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                ${(surveyCommission / 1000).toFixed(0)}k
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('tareas');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'tareas'
                  ? 'text-emerald-800 bg-emerald-50 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className={`w-4 h-4 ${currentTab === 'tareas' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                <span>Tareas</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
                ${(taskCommission / 1000).toFixed(0)}k
              </span>
            </button>

            {/* Referidos Tab */}
            <button
              onClick={() => {
                onNavigate('referidos');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'referidos'
                  ? 'text-amber-800 bg-amber-50 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${currentTab === 'referidos' ? 'text-amber-600' : 'text-amber-500'}`} />
                <span>Referidos</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-700 rounded-full">
                +$1.000
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('retiros');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'retiros'
                  ? 'text-slate-900 bg-slate-100 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className={`w-4 h-4 ${currentTab === 'retiros' ? 'text-slate-700' : 'text-slate-400'}`} />
              <span>Retiros y Historial</span>
            </button>

            {/* Admin navigation items */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    onNavigate('solicitudes');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    currentTab === 'solicitudes'
                      ? 'text-emerald-950 bg-emerald-100/90 shadow-xs font-bold border border-emerald-300'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Solicitudes de Retiro</span>
                  </div>
                  {pendingRequests.length > 0 ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full animate-pulse shadow-xs">
                      {pendingRequests.length}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-md">
                      0
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onNavigate('admin');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    currentTab === 'admin'
                      ? 'text-amber-900 bg-amber-100/80 shadow-xs font-bold'
                      : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Panel Admin</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-200 text-amber-900 rounded-md">
                    ADMIN
                  </span>
                </button>
              </>
            )}
          </nav>

          <hr className="border-slate-200" />

          <nav className="space-y-1">
            <button
              onClick={() => {
                onNavigate('sheets');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                currentTab === 'sheets'
                  ? 'text-emerald-800 bg-emerald-50 shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Conexión Google Sheets</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        {isAdmin ? (
          /* Admin Specific: Solicitudes de Retiro de Usuarios Registrados */
          <div className="mt-4 p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>Retiros Solicitados</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Usuarios Registrados</div>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                pendingRequests.length > 0
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                  : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}>
                {pendingRequests.length > 0 ? `${pendingRequests.length} pend.` : 'Al día ✓'}
              </span>
            </div>

            {/* List of Withdrawal Requests */}
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
              {withdrawalRequests.slice(0, 4).map((req) => {
                const isPending = req.status === 'Pendiente';
                return (
                  <div
                    key={req.id}
                    className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 text-[11px] space-y-1.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-bold text-slate-100 truncate max-w-[125px]">
                          {req.userName}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <span>Llave:</span>
                          <strong className="text-emerald-400">{req.account || req.userPhone || 'N/A'}</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-400 text-[11px]">
                          ${req.amount.toLocaleString('es-CO')}
                        </div>
                        <span className="text-[9px] text-slate-400">COP</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/60 text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {req.status}
                      </span>

                      {isPending && onApproveWithdrawal ? (
                        <button
                          onClick={() => onApproveWithdrawal(req.id)}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          title="Aprobar pago de retiro"
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>Aprobar</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{req.date.split(',')[0]}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {withdrawalRequests.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-dashed border-slate-800">
                  No hay solicitudes registradas
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onNavigate('solicitudes');
                onCloseMobile();
              }}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/80 shadow-xs"
            >
              <ExternalLink className="w-3 h-3 text-emerald-400" />
              <span>Ver y gestionar todas ({withdrawalRequests.length})</span>
            </button>
          </div>
        ) : (
          /* Regular User Level & Commissions Summary */
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2 mt-4">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Tu Nivel: {userLevel}</span>
              </span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Escala de Pagos
              </span>
            </div>
            <ul className="space-y-1 pl-4 text-slate-600 list-disc text-[11px]">
              <li>Encuesta IA: <strong className="text-indigo-700">${surveyCommission.toLocaleString('es-CO')} COP</strong></li>
              <li>Tarea verificada: <strong className="text-emerald-700">${taskCommission.toLocaleString('es-CO')} COP</strong></li>
              <li>Amigo referido: <strong className="text-amber-700">$1.000 COP</strong></li>
            </ul>
          </div>
        )}
      </aside>
    </>
  );
};
