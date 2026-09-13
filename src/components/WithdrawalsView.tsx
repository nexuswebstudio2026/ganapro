import React, { useState } from 'react';
import { User, PaymentMethod } from '../types';
import {
  ArrowRightLeft,
  Send,
  AlertCircle,
  Receipt,
  CheckCircle2,
  Clock,
  Wallet
} from 'lucide-react';

interface WithdrawalsViewProps {
  currentUser: User;
  onWithdraw: (amount: number, method: PaymentMethod, account: string) => void;
  onErrorToast: (msg: string) => void;
}

export const WithdrawalsView: React.FC<WithdrawalsViewProps> = ({
  currentUser,
  onWithdraw,
  onErrorToast
}) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<PaymentMethod>(currentUser.paymentMethod || 'Nequi');
  const [account, setAccount] = useState<string>('');

  const handleMax = () => {
    if (currentUser.balance >= 10000) {
      setAmount(currentUser.balance);
    } else {
      onErrorToast('Tu saldo actual es inferior al mínimo de retiro ($10.000 COP)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || isNaN(numAmount) || numAmount < 10000) {
      onErrorToast('El monto mínimo para solicitar retiro es de $10.000 COP');
      return;
    }

    if (numAmount > currentUser.balance) {
      onErrorToast('Saldo insuficiente para realizar esta solicitud de retiro');
      return;
    }

    if (!account.trim()) {
      onErrorToast('Ingresa tu número de cuenta, teléfono Nequi/Daviplata o correo PayPal');
      return;
    }

    onWithdraw(numAmount, method, account.trim());
    setAmount('');
    setAccount('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Retiro */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Solicitud de Retiro</span>
            </h3>
            <p className="text-xs text-slate-500">
              Retira tus ganancias directamente a tu cuenta bancaria o billetera digital favorita.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-semibold">Tu Saldo Disponible:</span>
            <span className="font-black text-emerald-700 text-sm">
              ${currentUser.balance.toLocaleString('es-CO')} COP
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Monto a Retirar (COP)
                </label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  Retirar Todo
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  min={10000}
                  step={1000}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Mínimo 10.000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 font-semibold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Mínimo: <strong>$10.000 COP</strong> (sin comisiones)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Método de Destino
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-medium"
              >
                <option value="Nequi">Nequi (Colombia)</option>
                <option value="Daviplata">Daviplata (Colombia)</option>
                <option value="Bancolombia">Bancolombia / Ahorros</option>
                <option value="PayPal">PayPal (Internacional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Número de Cuenta / Teléfono / Correo
              </label>
              <input
                type="text"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Ej: 3001234567 o usuario@paypal.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Transferencia</span>
            </button>
          </form>
        </div>

        {/* Tabla Historial de Movimientos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span>Historial de Movimientos</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {currentUser.history?.length || 0} registro(s)
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Tipo / Descripción</th>
                  <th className="py-3 px-3">Monto</th>
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {currentUser.history && currentUser.history.length > 0 ? (
                  currentUser.history.map((item) => {
                    const isPositive = item.amount > 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-800">{item.type}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                            {item.description}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold">
                          <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                            {isPositive ? '+' : ''}${item.amount.toLocaleString('es-CO')} COP
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 font-medium">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${
                              item.status === 'Pendiente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.status === 'Pendiente' ? (
                              <Clock className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            <span>{item.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                      Sin transacciones registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
