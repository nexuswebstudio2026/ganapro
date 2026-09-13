import React, { useState } from 'react';
import { User, UserLevel, WithdrawalRequest } from '../types';
import { ShieldCheck, Database, Users, Gift, Search, Award, RefreshCw, FileSpreadsheet, Edit3, Check, Banknote, ArrowRight } from 'lucide-react';

interface AdminViewProps {
  users: User[];
  currentUser: User;
  onAddBonusToUser: (userId: string | number, amount: number) => void;
  onChangeUserLevel: (userId: string | number, newLevel: UserLevel) => void;
  onUpdateUserAcumulado?: (userId: string | number, newAcumulado: number) => void;
  onSyncSheets?: () => void;
  isSyncingSheets?: boolean;
  onSwitchUser?: (user: User) => void;
  withdrawalRequests?: WithdrawalRequest[];
  onApproveWithdrawal?: (requestId: string) => void;
  onNavigateToSolicitudes?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  currentUser,
  onAddBonusToUser,
  onChangeUserLevel,
  onUpdateUserAcumulado,
  onSyncSheets,
  isSyncingSheets = false,
  onSwitchUser,
  withdrawalRequests = [],
  onApproveWithdrawal,
  onNavigateToSolicitudes
}) => {
  const [search, setSearch] = useState('');
  const [editingAcumuladoId, setEditingAcumuladoId] = useState<string | number | null>(null);
  const [tempAcumulado, setTempAcumulado] = useState<string>('');

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(term)) ||
      u.paymentMethod.toLowerCase().includes(term)
    );
  });

  const totalBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalAcumulado = users.reduce((acc, u) => acc + (u.acumulado !== undefined ? u.acumulado : u.balance || 0), 0);
  const totalReferrals = users.reduce((acc, u) => acc + (u.referralCount || 0), 0);
  const pendingRequests = withdrawalRequests.filter((r) => r.status === 'Pendiente');
  const pendingAmount = pendingRequests.reduce((acc, r) => acc + r.amount, 0);

  const startEditAcumulado = (u: User) => {
    setEditingAcumuladoId(u.id);
    setTempAcumulado(String(u.acumulado !== undefined ? u.acumulado : u.balance || 0));
  };

  const saveAcumulado = (userId: string | number) => {
    const val = Number(tempAcumulado.replace(/[^0-9]/g, ''));
    if (!isNaN(val) && onUpdateUserAcumulado) {
      onUpdateUserAcumulado(userId, val);
    }
    setEditingAcumuladoId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
            Acceso Privilegiado
          </span>
          <h2 className="text-2xl font-black mt-2 flex items-center gap-2 tracking-tight">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Panel de Administración & Vinculación Sheets</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Gestión global de usuarios, columnas "Nivel" y "Acumulado" vinculadas con Google Sheets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSyncSheets && (
            <button
              onClick={onSyncSheets}
              disabled={isSyncingSheets}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? 'animate-spin' : ''}`} />
              <span>{isSyncingSheets ? 'Sincronizando...' : 'Sincronizar con Google Sheets'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Usuarios</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Saldo Acumulado Total (Sheets)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${totalAcumulado.toLocaleString('es-CO')} COP
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Saldo Retirable Total</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            ${totalBalance.toLocaleString('es-CO')} COP
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Referidos Totales</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {totalReferrals}
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Quick Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-300/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Solicitudes de Retiro de Usuarios Registrados
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                pendingRequests.length > 0 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {pendingRequests.length} pendientes
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {pendingRequests.length > 0
                ? `Hay $${pendingAmount.toLocaleString('es-CO')} COP solicitados para transferencia a Llaves Bre-B / Nequi.`
                : 'Todas las solicitudes de retiro han sido procesadas con éxito.'}
            </p>
          </div>
        </div>

        {onNavigateToSolicitudes && (
          <button
            onClick={onNavigateToSolicitudes}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver y Liquidar Solicitudes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Usuarios: Niveles (1-4) y Saldo Acumulado Vinculado</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Los cambios en <strong>Nivel</strong> y <strong>Acumulado</strong> se reflejan en el perfil y se sincronizan a Google Sheets.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nombre, correo o código..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Usuario / Correo</th>
                <th className="py-3 px-3">Nivel (1-4)</th>
                <th className="py-3 px-3">Acumulado (Google Sheets)</th>
                <th className="py-3 px-3">Saldo Retirable</th>
                <th className="py-3 px-3">Código / Referidos</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrent = u.email.toLowerCase() === currentUser.email.toLowerCase();
                const level = (u.level || 1) as UserLevel;
                const userAcumulado = u.acumulado !== undefined ? u.acumulado : u.balance || 0;
                const isEditingThis = editingAcumuladoId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            (Sesión actual)
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {u.email}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                        <span>📱 Nequi:</span>
                        <strong className="font-mono">{u.phone || '312 000 0000'}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={level}
                        onChange={(e) => onChangeUserLevel(u.id, Number(e.target.value) as UserLevel)}
                        className="px-2.5 py-1 text-xs font-black rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value={1}>Nivel 1 (Enc: $2k / Tar: $5k)</option>
                        <option value={2}>Nivel 2 (Enc: $5k / Tar: $10k)</option>
                        <option value={3}>Nivel 3 (Enc: $10k / Tar: $20k)</option>
                        <option value={4}>Nivel 4 (Enc: $20k / Tar: $50k)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      {isEditingThis ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempAcumulado}
                            onChange={(e) => setTempAcumulado(e.target.value)}
                            className="w-24 px-2 py-1 text-xs font-bold border border-emerald-500 rounded-lg focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveAcumulado(u.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                            title="Guardar Acumulado"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ${userAcumulado.toLocaleString('es-CO')} COP
                          </span>
                          {onUpdateUserAcumulado && (
                            <button
                              onClick={() => startEditAcumulado(u)}
                              title="Editar Saldo Acumulado de Google Sheets"
                              className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-black text-slate-700">
                      ${(u.balance || 0).toLocaleString('es-CO')} COP
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-[11px] text-indigo-700 font-bold">
                        {u.referralCode || 'Sin código'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.referralCount || 0} amigos (${((u.referralCount || 0) * 1000).toLocaleString('es-CO')})
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'ADMIN' : 'USUARIO'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      {onSwitchUser && !isCurrent && (
                        <button
                          onClick={() => onSwitchUser(u)}
                          title={`Ver sitio web como ${u.name}`}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver perfil</span>
                        </button>
                      )}
                      <button
                        onClick={() => onAddBonusToUser(u.id, 5000)}
                        title="Bonificar $5.000 COP a este usuario"
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Gift className="w-3 h-3" />
                        <span>+ $5.000</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
