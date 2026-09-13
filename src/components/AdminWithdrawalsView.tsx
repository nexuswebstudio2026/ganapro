import React, { useState } from 'react';
import { WithdrawalRequest } from '../types';
import {
  Banknote,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowDownToLine,
  Copy,
  Check,
  XCircle,
  AlertCircle,
  Smartphone
} from 'lucide-react';

interface AdminWithdrawalsViewProps {
  withdrawalRequests: WithdrawalRequest[];
  onApproveWithdrawal: (requestId: string) => void;
  onRejectWithdrawal?: (requestId: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const AdminWithdrawalsView: React.FC<AdminWithdrawalsViewProps> = ({
  withdrawalRequests,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onSuccessToast
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pendiente' | 'Aprobado' | 'Rechazado'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    onSuccessToast(`Llave Bre-B "${key}" copiada al portapapeles.`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filteredRequests = withdrawalRequests.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.account.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingRequests = withdrawalRequests.filter((r) => r.status === 'Pendiente');
  const approvedRequests = withdrawalRequests.filter((r) => r.status === 'Aprobado');

  const pendingAmount = pendingRequests.reduce((acc, curr) => acc + curr.amount, 0);
  const approvedAmount = approvedRequests.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAmount = withdrawalRequests.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
            Administración de Pagos
          </span>
          <h2 className="text-2xl font-black mt-2 flex items-center gap-2.5 tracking-tight text-white">
            <Banknote className="w-6 h-6 text-emerald-400" />
            <span>Solicitudes de Retiro de Usuarios Registrados</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Revisa, autoriza y liquida las solicitudes de retiro de los usuarios registrados a sus Llaves Bre-B / Nequi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Pendientes</div>
            <div className="text-lg font-black text-amber-400">{pendingRequests.length}</div>
          </div>
          <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Aprobadas</div>
            <div className="text-lg font-black text-emerald-400">{approvedRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Monto Pendiente</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            ${pendingAmount.toLocaleString('es-CO')} COP
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingRequests.length} transferencias por liquidar
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Monto Liquidado</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            ${approvedAmount.toLocaleString('es-CO')} COP
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {approvedRequests.length} solicitudes aprobadas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Solicitado</span>
            <ArrowDownToLine className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${totalAmount.toLocaleString('es-CO')} COP
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {withdrawalRequests.length} transacciones en histórico
          </p>
        </div>
      </div>

      {/* Requests Table Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>Listado de Solicitudes (Llave Bre-B)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en &quot;Aprobar&quot; tras emitir la transferencia bancaria hacia la llave del usuario.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({withdrawalRequests.length})
              </button>
              <button
                onClick={() => setStatusFilter('Pendiente')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'Pendiente'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pendientes ({pendingRequests.length})
              </button>
              <button
                onClick={() => setStatusFilter('Aprobado')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'Aprobado'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aprobadas ({approvedRequests.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuario o llave..."
                className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Llave Bre-B (Cuenta)</th>
                <th className="py-3 px-3">Monto Solicitado</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRequests.map((req) => {
                const isPending = req.status === 'Pendiente';
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{req.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.userEmail}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {req.account || req.userPhone || 'Sin Llave'}
                        </span>
                        {req.account && (
                          <button
                            onClick={() => handleCopyKey(req.account)}
                            title="Copiar Llave Bre-B"
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          >
                            {copiedKey === req.account ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Método: {req.method}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-900 text-sm">
                        ${req.amount.toLocaleString('es-CO')} <span className="text-[11px] font-normal text-slate-500">COP</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {req.date}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : req.status === 'Aprobado'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {isPending && <Clock className="w-3 h-3 text-amber-700 animate-spin" />}
                        {req.status === 'Aprobado' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        {req.status === 'Rechazado' && <XCircle className="w-3 h-3 text-rose-700" />}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right space-x-2">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveWithdrawal(req.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar Retiro</span>
                          </button>
                          {onRejectWithdrawal && (
                            <button
                              onClick={() => onRejectWithdrawal(req.id)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              Rechazar
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">
                          Completado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
