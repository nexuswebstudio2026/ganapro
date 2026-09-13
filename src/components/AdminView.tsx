import React, { useState } from 'react';
import { User, UserLevel } from '../types';
import { ShieldCheck, Database, Users, Gift, Search, Award } from 'lucide-react';

interface AdminViewProps {
  users: User[];
  currentUser: User;
  onAddBonusToUser: (userId: string | number, amount: number) => void;
  onChangeUserLevel: (userId: string | number, newLevel: UserLevel) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  currentUser,
  onAddBonusToUser,
  onChangeUserLevel
}) => {
  const [search, setSearch] = useState('');

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
  const totalReferrals = users.reduce((acc, u) => acc + (u.referralCount || 0), 0);

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
            <span>Panel de Administración</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Gestión global de usuarios, niveles (1 a 4), comisiones, referidos y asignación de bonos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Auditoría y Niveles Activos</span>
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Usuarios</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Saldo Total en Plataforma</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${totalBalance.toLocaleString('es-CO')} COP
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Referidos Totales</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {totalReferrals}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase">Tu Sesión</div>
          <div className="text-xs font-bold text-amber-600 mt-1 truncate">
            SuperAdmin ({currentUser.email})
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Gestión de Usuarios, Rango de Nivel y Referidos</span>
          </h3>

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
                <th className="py-3 px-3">Usuario / Nombre</th>
                <th className="py-3 px-3">Correo</th>
                <th className="py-3 px-3">Nivel (1-4)</th>
                <th className="py-3 px-3">Código / Referidos</th>
                <th className="py-3 px-3">Saldo Actual</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrent = u.email.toLowerCase() === currentUser.email.toLowerCase();
                const level = (u.level || 1) as UserLevel;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      <span>{u.name}</span>
                      {isCurrent && (
                        <span className="ml-1 text-[10px] text-emerald-600 font-semibold">
                          (Tú)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                      {u.email}
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
                      <div className="font-mono text-[11px] text-indigo-700 font-bold">
                        {u.referralCode || 'Sin código'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.referralCount || 0} amigos (${((u.referralCount || 0) * 1000).toLocaleString('es-CO')})
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-black text-emerald-600">
                      ${(u.balance || 0).toLocaleString('es-CO')} COP
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
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onAddBonusToUser(u.id, 5000)}
                        title="Bonificar $5.000 COP a este usuario"
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Gift className="w-3 h-3" />
                        <span>+ $5.000 COP</span>
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
