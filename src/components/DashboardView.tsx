import React from 'react';
import { User, ViewTab, SURVEY_REWARDS_BY_LEVEL, TASK_REWARDS_BY_LEVEL, UserLevel } from '../types';
import {
  Wallet,
  ClipboardList,
  CheckCircle2,
  HandCoins,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  CheckSquare,
  Users,
  Award,
  ChevronRight,
  Bot
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onNavigate: (tab: ViewTab) => void;
  onUpgradeLevel?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigate,
  onUpgradeLevel
}) => {
  const firstName = currentUser.name.split(' ')[0] || currentUser.name;
  const userLevel = (currentUser.level || 1) as UserLevel;
  const surveyCommission = SURVEY_REWARDS_BY_LEVEL[userLevel] || 2000;
  const taskCommission = TASK_REWARDS_BY_LEVEL[userLevel] || 5000;

  const levelBadges: Record<UserLevel, { label: string; bg: string; text: string; next?: string; border: string }> = {
    1: { label: 'Nivel 1 (Bronce)', bg: 'bg-amber-500/20', text: 'text-amber-300', next: 'Nivel 2', border: 'border-amber-500/30' },
    2: { label: 'Nivel 2 (Plata)', bg: 'bg-slate-300/20', text: 'text-slate-200', next: 'Nivel 3', border: 'border-slate-400/30' },
    3: { label: 'Nivel 3 (Oro)', bg: 'bg-yellow-500/20', text: 'text-yellow-300', next: 'Nivel 4', border: 'border-yellow-500/30' },
    4: { label: 'Nivel 4 (VIP Diamante)', bg: 'bg-indigo-500/25', text: 'text-cyan-300', border: 'border-indigo-400/30' },
  };

  const totalCompleted = (currentUser.surveysCompleted?.length || 0) + (currentUser.tasksCompleted?.length || 0);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Plataforma Activa & Pagos Inmediatos</span>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full border ${levelBadges[userLevel].bg} ${levelBadges[userLevel].text} ${levelBadges[userLevel].border}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{levelBadges[userLevel].label}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ¡Hola, {firstName}! 👋
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Tu rango actual es <strong>Nivel {userLevel}</strong>. Ganas <strong>${surveyCommission.toLocaleString('es-CO')} COP</strong> por encuesta completada (generada con IA), <strong>${taskCommission.toLocaleString('es-CO')} COP</strong> por tarea, y <strong>$1.000 COP</strong> por cada amigo referido.
          </p>

          {/* 3 Forms to Earn Money Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('encuestas')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>Encuestas IA (${surveyCommission.toLocaleString('es-CO')})</span>
            </button>
            <button
              onClick={() => onNavigate('tareas')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-emerald-200" />
              <span>Tareas (${taskCommission.toLocaleString('es-CO')})</span>
            </button>
            <button
              onClick={() => onNavigate('referidos')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-yellow-200" />
              <span>Referidos ($1.000 c/u)</span>
            </button>
          </div>
        </div>

        <TrendingUp className="w-72 h-72 text-white/5 absolute -right-12 -bottom-12 pointer-events-none" />
      </div>

      {/* Rango & Comisiones Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0">
            {userLevel}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              <span>Tu Rango: {levelBadges[userLevel].label}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Encuesta: <strong className="text-indigo-600">${surveyCommission.toLocaleString('es-CO')}</strong> • Tarea: <strong className="text-emerald-600">${taskCommission.toLocaleString('es-CO')}</strong> • Referido: <strong className="text-amber-600">$1.000 COP</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {userLevel < 4 ? (
            <button
              onClick={onUpgradeLevel}
              className="w-full sm:w-auto px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subir a Nivel {(userLevel + 1)} (Mayor Comisión)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black rounded-xl border border-indigo-200">
              🌟 Rango Máximo VIP
            </span>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Saldo Disponible
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              ${currentUser.balance.toLocaleString('es-CO')} COP
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Encuestas Llenadas
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {currentUser.surveysCompleted?.length || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Tareas Completadas
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {currentUser.tasksCompleted?.length || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Amigos Referidos
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {currentUser.referralCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Summary of 3 Ways to Earn Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
              Esquema de Pagos y Rango
            </span>
            <h3 className="text-base sm:text-lg font-black mt-0.5">
              Tus 3 Formas de Ganar Dinero en GanaPro
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto text-xs">
            <div
              onClick={() => onNavigate('encuestas')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-all"
            >
              <div className="text-slate-400 font-semibold">1. Encuestas IA</div>
              <div className="text-sm font-black text-indigo-300 mt-0.5">
                ${surveyCommission.toLocaleString('es-CO')} COP
              </div>
              <div className="text-[10px] text-slate-400">Hasta $20.000 en Nivel 4</div>
            </div>

            <div
              onClick={() => onNavigate('tareas')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-all"
            >
              <div className="text-slate-400 font-semibold">2. Tareas Verificadas</div>
              <div className="text-sm font-black text-emerald-300 mt-0.5">
                ${taskCommission.toLocaleString('es-CO')} COP
              </div>
              <div className="text-[10px] text-slate-400">Hasta $50.000 en Nivel 4</div>
            </div>

            <div
              onClick={() => onNavigate('referidos')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-all"
            >
              <div className="text-slate-400 font-semibold">3. Referidos Directos</div>
              <div className="text-sm font-black text-amber-300 mt-0.5">
                $1.000 COP
              </div>
              <div className="text-[10px] text-slate-400">Por cada amigo registrado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Actividad Reciente</span>
          </h3>
          <button
            onClick={() => onNavigate('retiros')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todo el historial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {currentUser.history && currentUser.history.length > 0 ? (
          <div className="space-y-2.5">
            {currentUser.history.slice(0, 5).map((item) => {
              const isPositive = item.amount > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.type === 'Encuesta' ? (
                        <ClipboardList className="w-4 h-4" />
                      ) : item.type === 'Tarea' ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : item.type === 'Referido' ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{item.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-black text-sm block ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}${item.amount.toLocaleString('es-CO')} COP
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        item.status === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm">Aún no has completado ninguna encuesta o tarea.</p>
            <p className="text-xs text-slate-400">
              ¡Haz clic en Encuestas o Tareas para comenzar a ganar hoy!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
