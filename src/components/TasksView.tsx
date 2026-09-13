import React, { useState } from 'react';
import { Task, User, TASK_REWARDS_BY_LEVEL, UserLevel } from '../types';
import { NequiMatrixView } from './NequiMatrixView';
import {
  CheckCircle2,
  Zap,
  X,
  Send,
  Sparkles,
  TrendingUp,
  Award,
  Smartphone,
  CheckSquare
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  currentUser: User;
  users: User[];
  onCompleteTask: (task: Task, proof: string, earnedReward: number) => void;
  onUploadTransferProof: (
    senderId: string | number,
    receiverId: string | number,
    amount: number,
    targetLevel: UserLevel,
    referenceCode: string,
    senderPhone?: string
  ) => void;
  onSimulateIncomingTransfer: (receiverId: string | number, level: UserLevel) => void;
  onCompleteFourSlots: (receiverId: string | number, level: UserLevel) => void;
  onSwitchUser?: (user: User) => void;
  onUpdatePhone?: (phone: string) => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  currentUser,
  users,
  onCompleteTask,
  onUploadTransferProof,
  onSimulateIncomingTransfer,
  onCompleteFourSlots,
  onSwitchUser,
  onUpdatePhone,
  onSuccessToast,
  onErrorToast
}) => {
  const [activeTaskTab, setActiveTaskTab] = useState<'nequi-matrix' | 'daily'>('nequi-matrix');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [proof, setProof] = useState<string>('');
  const [showLevelTable, setShowLevelTable] = useState(false);

  const userLevel = (currentUser.level || 1) as UserLevel;
  const currentReward = TASK_REWARDS_BY_LEVEL[userLevel] || 5000;

  const openTaskModal = (task: Task) => {
    setActiveTask(task);
    setProof('');
  };

  const closeModal = () => {
    setActiveTask(null);
    setProof('');
  };

  const submitProof = () => {
    if (!activeTask) return;
    if (!proof.trim()) {
      onErrorToast('Ingresa un comprobante, nombre de usuario o enlace de validación');
      return;
    }

    onCompleteTask(activeTask, proof.trim(), currentReward);
    closeModal();
  };

  const levelBadges: Record<UserLevel, { label: string; bg: string; text: string; border: string }> = {
    1: { label: 'Nivel 1 (Bronce)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    2: { label: 'Nivel 2 (Plata)', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
    3: { label: 'Nivel 3 (Oro)', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300' },
    4: { label: 'Nivel 4 (Diamante)', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
  };

  return (
    <div className="space-y-6">
      {/* Task Type Switcher: Nequi Matrix 4x1 vs Daily Tasks */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl w-full sm:w-fit gap-1 border border-slate-300/60 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTaskTab('nequi-matrix')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTaskTab === 'nequi-matrix'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Tarea de Ascenso Nequi (Metodología 4x1)</span>
          <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full">
            Nueva
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTaskTab('daily')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTaskTab === 'daily'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tareas Diarias Remuneradas</span>
          <span className="text-xs font-mono opacity-80">({tasks.length})</span>
        </button>
      </div>

      {/* Render Nequi Matrix View if selected */}
      {activeTaskTab === 'nequi-matrix' && (
        <NequiMatrixView
          currentUser={currentUser}
          users={users}
          onUploadTransferProof={onUploadTransferProof}
          onSimulateIncomingTransfer={onSimulateIncomingTransfer}
          onCompleteFourSlots={onCompleteFourSlots}
          onSwitchUser={onSwitchUser}
          onUpdatePhone={onUpdatePhone}
          onSuccessToast={onSuccessToast}
          onErrorToast={onErrorToast}
        />
      )}

      {/* Render Traditional Daily Tasks if selected */}
      {activeTaskTab === 'daily' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Tareas Diarias Remuneradas
                </h2>
                <span className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${levelBadges[userLevel].bg} ${levelBadges[userLevel].text} ${levelBadges[userLevel].border}`}>
                  {levelBadges[userLevel].label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Tu comisión en tareas es de <strong className="text-emerald-600 font-black">${currentReward.toLocaleString('es-CO')} COP</strong> por cada instrucción verificada.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowLevelTable(!showLevelTable)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Escala de Tareas</span>
              </button>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Paga: ${currentReward.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          </div>

          {/* Levels Explanatory Dropdown / Card */}
          {showLevelTable && (
            <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">Escala de Comisiones por Nivel en Tareas</h4>
                </div>
                <button
                  onClick={() => setShowLevelTable(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${userLevel === 1 ? 'bg-emerald-800/80 border-emerald-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-slate-300 font-bold">Nivel 1</div>
                  <div className="text-base font-black text-emerald-300">$5.000 COP</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Inicial / Bronce</div>
                </div>
                <div className={`p-3 rounded-xl border ${userLevel === 2 ? 'bg-emerald-800/80 border-emerald-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-slate-300 font-bold">Nivel 2</div>
                  <div className="text-base font-black text-emerald-300">$10.000 COP</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Rango Plata</div>
                </div>
                <div className={`p-3 rounded-xl border ${userLevel === 3 ? 'bg-emerald-800/80 border-emerald-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-slate-300 font-bold">Nivel 3</div>
                  <div className="text-base font-black text-emerald-300">$20.000 COP</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Rango Oro</div>
                </div>
                <div className={`p-3 rounded-xl border ${userLevel === 4 ? 'bg-emerald-800/80 border-emerald-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-slate-300 font-bold">Nivel 4</div>
                  <div className="text-base font-black text-emerald-300">$50.000 COP</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Rango VIP Diamante</div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const isDone = currentUser.tasksCompleted.includes(task.id);

              return (
                <div
                  key={task.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:border-emerald-200 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
                        {task.category}
                      </span>
                      <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        Paga Nivel {userLevel}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {task.instructions}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Recompensa</span>
                      <span className="text-base font-extrabold text-emerald-600">
                        +${currentReward.toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    {isDone ? (
                      <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completada</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => openTaskModal(task)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Realizar Tarea</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 border border-slate-100">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                Tarea Especial • {activeTask.category}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {activeTask.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Recompensa garantizada (Nivel {userLevel}):{' '}
                <strong className="text-emerald-600 font-extrabold text-sm">
                  +${currentReward.toLocaleString('es-CO')} COP
                </strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Instrucciones de la tarea:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeTask.instructions}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Enlace o Comprobante de Validación
                </label>
                <textarea
                  rows={3}
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  placeholder="Pega aquí el enlace de tu reseña, tu usuario de Instagram/Maps, o descripción de confirmación..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-900 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tu comprobante será verificado y respaldado en la base de datos de auditoría.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitProof}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar y Cobrar ${currentReward.toLocaleString('es-CO')} COP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

