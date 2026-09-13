import React, { useState } from 'react';
import { User, UserLevel, NequiTransferProof } from '../types';
import {
  Users,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Send,
  Sparkles,
  HelpCircle,
  PlusCircle,
  Award,
  RefreshCw,
  Eye,
  UserCheck
} from 'lucide-react';

interface NequiMatrixViewProps {
  currentUser: User;
  users: User[];
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

export const NequiMatrixView: React.FC<NequiMatrixViewProps> = ({
  currentUser,
  users,
  onUploadTransferProof,
  onSimulateIncomingTransfer,
  onCompleteFourSlots,
  onSwitchUser,
  onUpdatePhone,
  onSuccessToast,
  onErrorToast
}) => {
  const currentLevel = (currentUser.level || 1) as UserLevel;

  // Transfer form state
  const [referenceInput, setReferenceInput] = useState('');
  const [senderPhoneInput, setSenderPhoneInput] = useState(currentUser.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // Phone edit state
  const [myPhone, setMyPhone] = useState(currentUser.phone || '312 456 7890');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Helper copy function
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    onSuccessToast(`Copiado: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Matrix Rules by Level:
  // L1 -> L2: Send $10.000 COP to Level 2. Level 2 receives 4 x $10.000 = $40.000 COP.
  // L2 -> L3: Send $20.000 COP to Level 3. Level 3 receives 4 x $20.000 = $80.000 COP.
  // L3 -> L4: Send $40.000 COP to Level 4. Level 4 receives 4 x $40.000 = $160.000 COP.
  const MATRIX_RULES: Record<UserLevel, {
    nextLevel: UserLevel | null;
    sendAmount: number;
    receiveSlotAmount: number;
    totalExpectedReceive: number;
    netBenefit: number;
    senderTierLabel: string;
    receiverTierLabel: string;
  }> = {
    1: {
      nextLevel: 2,
      sendAmount: 10000,
      receiveSlotAmount: 0,
      totalExpectedReceive: 0,
      netBenefit: 0,
      senderTierLabel: '4 Usuarios Nivel 1',
      receiverTierLabel: 'Líder Nivel 2'
    },
    2: {
      nextLevel: 3,
      sendAmount: 20000,
      receiveSlotAmount: 10000,
      totalExpectedReceive: 40000, // 4 x $10.000
      netBenefit: 20000, // $40.000 - $20.000
      senderTierLabel: '4 Usuarios Nivel 1 ($10.000 c/u)',
      receiverTierLabel: 'Líder Nivel 3'
    },
    3: {
      nextLevel: 4,
      sendAmount: 40000,
      receiveSlotAmount: 20000,
      totalExpectedReceive: 80000, // 4 x $20.000
      netBenefit: 40000, // $80.000 - $40.000
      senderTierLabel: '4 Usuarios Nivel 2 ($20.000 c/u)',
      receiverTierLabel: 'Líder Nivel 4 (VIP Diamante)'
    },
    4: {
      nextLevel: null,
      sendAmount: 0,
      receiveSlotAmount: 40000,
      totalExpectedReceive: 160000, // 4 x $40.000
      netBenefit: 160000,
      senderTierLabel: '4 Usuarios Nivel 3 ($40.000 c/u)',
      receiverTierLabel: 'Rango Máximo Alcanzado'
    }
  };

  const currentRule = MATRIX_RULES[currentLevel];

  // Identify assigned receiver for the next level upgrade
  const getAssignedReceiver = (): User => {
    if (!currentRule.nextLevel) {
      return currentUser;
    }
    const targetTier = currentRule.nextLevel;
    // Look for existing user in target tier that isn't current user
    const candidate = users.find(
      (u) => u.level === targetTier && u.id !== currentUser.id
    );
    if (candidate) return candidate;

    // Fallback default mock user
    if (targetTier === 2) {
      return {
        id: 'user-001',
        name: 'Usuario Uno (Líder Nivel 2)',
        email: 'usuario1@ganapro.com',
        phone: '312 456 7890',
        paymentMethod: 'Nequi',
        balance: 80000,
        acumulado: 80000,
        role: 'usuario',
        level: 2,
        referralCode: 'GP-UNO101',
        referralCount: 3,
        referralEarnings: 3000,
        surveysCompleted: [],
        tasksCompleted: [],
        withdrawn: 0,
        history: []
      };
    } else if (targetTier === 3) {
      return {
        id: 'user-005',
        name: 'Usuario Cinco (Líder Nivel 3)',
        email: 'usuario5@ganapro.com',
        phone: '310 987 6543',
        paymentMethod: 'Nequi',
        balance: 150000,
        acumulado: 150000,
        role: 'usuario',
        level: 3,
        referralCode: 'GP-CIN505',
        referralCount: 5,
        referralEarnings: 5000,
        surveysCompleted: [],
        tasksCompleted: [],
        withdrawn: 0,
        history: []
      };
    } else {
      return {
        id: 'admin-001',
        name: 'Administrador GanaPro (Nivel 4)',
        email: 'admin@ganapro.com',
        phone: '300 123 4567',
        paymentMethod: 'Nequi',
        balance: 35000,
        acumulado: 35000,
        role: 'admin',
        level: 4,
        referralCode: 'GP-ADMIN',
        referralCount: 6,
        referralEarnings: 6000,
        surveysCompleted: [],
        tasksCompleted: [],
        withdrawn: 0,
        history: []
      };
    }
  };

  const assignedReceiver = getAssignedReceiver();

  // Transfers received by current user (filtered to the relevant tier)
  const receivedTransfers = (currentUser.nequiTransfersReceived || []).filter(
    (t) => t.amount === currentRule.receiveSlotAmount
  );
  const slotsFilledCount = Math.min(4, receivedTransfers.length);
  const totalReceivedAmount = receivedTransfers.reduce((acc, t) => acc + t.amount, 0);

  // Generate mock reference
  const generateMockReference = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setReferenceInput(`M${randomNum}`);
  };

  // Submit proof to ascend
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRule.nextLevel) return;

    if (!referenceInput.trim()) {
      onErrorToast('Por favor ingresa el número o código de referencia de tu transferencia Nequi (ej: M849201)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onUploadTransferProof(
        currentUser.id,
        assignedReceiver.id,
        currentRule.sendAmount,
        currentRule.nextLevel!,
        referenceInput.trim(),
        senderPhoneInput.trim() || currentUser.phone || '312 000 0000'
      );
      setReferenceInput('');
      setIsSubmitting(false);
    }, 600);
  };

  // Save phone number
  const handleSavePhone = () => {
    if (onUpdatePhone) {
      onUpdatePhone(myPhone.trim());
      setIsEditingPhone(false);
      onSuccessToast('Número de Nequi guardado correctamente para recibir tus pagos.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Switcher for Demo Testing */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <span>Metodología de Ascenso Nequi 4x1</span>
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Nivel {currentLevel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            4 usuarios transfieren y suben comprobante ➔ pasan a Nivel 2 y la persona Nivel 2 recibe $40.000 COP para ascender a Nivel 3.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowExplanationModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>¿Cómo funciona?</span>
          </button>

          {/* Quick Demo Switcher */}
          {onSwitchUser && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-2">Probar Rol:</span>
              <button
                onClick={() => {
                  const u4 = users.find((u) => u.level === 1) || {
                    ...currentUser,
                    id: 'user-004',
                    name: 'Usuario Cuatro',
                    email: 'usuario4@ganapro.com',
                    level: 1,
                    balance: 10000,
                    acumulado: 10000
                  };
                  onSwitchUser(u4 as User);
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  currentLevel === 1 ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                Nivel 1
              </button>
              <button
                onClick={() => {
                  const u1 = users.find((u) => u.email === 'usuario1@ganapro.com') || users.find((u) => u.level === 2);
                  if (u1) onSwitchUser(u1);
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  currentLevel === 2 ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                Nivel 2
              </button>
              <button
                onClick={() => {
                  const u5 = users.find((u) => u.email === 'usuario5@ganapro.com') || users.find((u) => u.level === 3);
                  if (u5) onSwitchUser(u5);
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  currentLevel === 3 ? 'bg-yellow-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                Nivel 3
              </button>
              <button
                onClick={() => {
                  const adm = users.find((u) => u.role === 'admin') || users.find((u) => u.level === 4);
                  if (adm) onSwitchUser(adm);
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  currentLevel === 4 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                Nivel 4
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Methodology Roadmap Diagram */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl border border-slate-700 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              Ciclo Solidario de Niveles GanaPro (Cadena de 4 Usuarios)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-900/60 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-700">
            Regla: 4 a 1 vía Nequi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Phase 1: Nivel 1 -> Nivel 2 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentLevel === 1
              ? 'bg-emerald-900/50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Paso 1: Nivel 1 ➜ Nivel 2
              </span>
              {currentLevel > 1 && (
                <span className="text-emerald-400 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Superado
                </span>
              )}
            </div>
            <div className="text-sm font-black text-white">4 Usuarios Nivel 1</div>
            <div className="text-xs text-slate-300 mt-1">
              Envían <strong className="text-emerald-300 font-extrabold">$10.000 COP</strong> cada uno al Nivel 2.
            </div>
            <div className="mt-3 p-2.5 bg-black/30 rounded-xl border border-white/5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Nivel 2 Recibe:</span>
                <strong className="text-emerald-400 font-black">4 x $10.000 = $40.000 COP</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Al subir comprobante:</span>
                <span className="text-amber-300 font-bold">Pasan a Nivel 2</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Nivel 2 -> Nivel 3 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentLevel === 2
              ? 'bg-emerald-900/50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-slate-400/20 text-slate-200 border border-slate-400/30">
                Paso 2: Nivel 2 ➜ Nivel 3
              </span>
              {currentLevel > 2 && (
                <span className="text-emerald-400 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Superado
                </span>
              )}
            </div>
            <div className="text-sm font-black text-white">4 Usuarios Nivel 2</div>
            <div className="text-xs text-slate-300 mt-1">
              Envían <strong className="text-emerald-300 font-extrabold">$20.000 COP</strong> cada uno al Nivel 3.
            </div>
            <div className="mt-3 p-2.5 bg-black/30 rounded-xl border border-white/5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Nivel 3 Recibe:</span>
                <strong className="text-emerald-400 font-black">4 x $20.000 = $80.000 COP</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Ganancia neta Nivel 2:</span>
                <span className="text-emerald-300 font-bold">+$20.000 COP limpios</span>
              </div>
            </div>
          </div>

          {/* Phase 3: Nivel 3 -> Nivel 4 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            currentLevel === 3
              ? 'bg-emerald-900/50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                Paso 3: Nivel 3 ➜ Nivel 4
              </span>
              {currentLevel === 4 && (
                <span className="text-emerald-400 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VIP Diamante
                </span>
              )}
            </div>
            <div className="text-sm font-black text-white">4 Usuarios Nivel 3</div>
            <div className="text-xs text-slate-300 mt-1">
              Envían <strong className="text-emerald-300 font-extrabold">$40.000 COP</strong> cada uno al Nivel 4.
            </div>
            <div className="mt-3 p-2.5 bg-black/30 rounded-xl border border-white/5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Nivel 4 Recibe:</span>
                <strong className="text-emerald-400 font-black">4 x $40.000 = $160.000 COP</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Ganancia neta Nivel 3:</span>
                <span className="text-emerald-300 font-bold">+$40.000 COP limpios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Receiver Matrix Slots & Upgrade Task Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Reception Matrix Slots (Relevant for Levels 2, 3, 4) */}
        {currentLevel >= 2 ? (
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-md">
                    Tu Recepción Nequi
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Mis 4 Usuarios Asignados
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada usuario te transfiere <strong className="text-emerald-700 font-bold">${currentRule.receiveSlotAmount.toLocaleString('es-CO')} COP</strong> a tu Nequi.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>Total Recaudado:</span>
                <strong className="text-emerald-400 text-sm font-black">
                  ${totalReceivedAmount.toLocaleString('es-CO')} COP
                </strong>
              </div>
            </div>

            {/* My Nequi Number Quick View / Edit */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                  N
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Tu Nequi para recibir transferencias:
                  </span>
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={myPhone}
                        onChange={(e) => setMyPhone(e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="312 000 0000"
                      />
                      <button
                        onClick={handleSavePhone}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-black text-sm tracking-wide">
                        {currentUser.phone || myPhone}
                      </strong>
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="text-[11px] text-emerald-600 hover:underline font-bold cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activo</span>
              </span>
            </div>

            {/* 4 User Reception Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Progreso del Grupo:</span>
                <span className="text-emerald-700 font-black">
                  {slotsFilledCount} de 4 usuarios han completado su transferencia
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const proofItem = receivedTransfers[index];
                  const isFilled = !!proofItem;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border transition-all ${
                        isFilled
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-slate-50/80 border-dashed border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isFilled ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                        }`}>
                          Usuario #{index + 1}
                        </span>
                        {isFilled ? (
                          <span className="text-emerald-600 font-black text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Esperando
                          </span>
                        )}
                      </div>

                      {isFilled ? (
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {proofItem.senderName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Ref: <strong className="font-mono text-slate-800">{proofItem.referenceCode}</strong></span>
                            <span className="text-emerald-600 font-black">+${proofItem.amount.toLocaleString('es-CO')}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {proofItem.date} • Subió comprobante y ascendió
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-slate-400 py-1">
                          <div className="text-xs font-bold text-slate-600">
                            Cupo disponible
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Esperando envío de ${currentRule.receiveSlotAmount.toLocaleString('es-CO')} COP
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-500">
                ¿Deseas probar la recepción de los 4 usuarios?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSimulateIncomingTransfer(currentUser.id, currentLevel)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simular 1 Usuario (+${currentRule.receiveSlotAmount.toLocaleString('es-CO')})</span>
                </button>
                {slotsFilledCount < 4 && (
                  <button
                    type="button"
                    onClick={() => onCompleteFourSlots(currentUser.id, currentLevel)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Llenar los 4 Cupos</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Level 1: Explanatory Card on Left */
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl">
                1
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-300">
                  Rango Inicial Bronce
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Tu Tarea de Iniciación: Ascenso a Nivel 2
                </h3>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>¿Cómo funciona tu ascenso?</span>
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Formas parte del grupo de <strong>4 usuarios</strong> que impulsan al Líder Nivel 2.
                Realizas una transferencia de <strong>$10.000 COP</strong> a su Nequi y subes el comprobante en el formulario de la derecha.
              </p>
              <div className="p-3 bg-white/80 rounded-xl text-xs text-slate-700 space-y-1 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Al subir tu comprobante, <strong>pasas automáticamente a Nivel 2</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>En Nivel 2 tus encuestas pasan de $2.000 a <strong>$5.000 COP</strong> y tus tareas de $5.000 a <strong>$10.000 COP</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Se te asignarán 4 nuevos usuarios que te transferirán <strong>$10.000 COP cada uno ($40.000 COP en total)</strong> a tu propio Nequi.</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tu número Nequi registrado:</span>
                  <strong className="text-slate-900 font-black">{currentUser.phone || myPhone}</strong>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">
                Aquí recibirás tus $40.000 COP en Nivel 2
              </span>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Active Task Card (Make Transfer & Upload Proof) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between gap-5">
          {currentRule.nextLevel ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-black rounded-full border border-purple-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-700" />
                    <span>Tarea de Ascenso Activa</span>
                  </span>
                  <span className="text-xs font-black text-emerald-700">
                    Objetivo: Nivel {currentRule.nextLevel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    Transferir ${currentRule.sendAmount.toLocaleString('es-CO')} COP vía Nequi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Envía a la persona asignada en Nivel {currentRule.nextLevel} y sube la referencia para ascender de inmediato.
                  </p>
                </div>

                {/* Recipient Nequi Data Card */}
                <div className="p-4 bg-linear-to-br from-purple-900 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                    <span className="text-slate-300 font-medium">Receptor Asignado ({currentRule.receiverTierLabel})</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-200 rounded font-bold text-[10px]">
                      Nivel {currentRule.nextLevel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-300">Nombre:</span>
                      <strong className="text-xs font-bold text-white">{assignedReceiver.name}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-300">Número Nequi:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-mono font-black text-purple-300">
                          {assignedReceiver.phone || '312 456 7890'}
                        </strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(assignedReceiver.phone || '312 456 7890', 'phone')}
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copiar número Nequi"
                        >
                          {copiedField === 'phone' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-white/10">
                      <span className="text-xs text-slate-300">Monto exacto:</span>
                      <strong className="text-base font-black text-emerald-400">
                        ${currentRule.sendAmount.toLocaleString('es-CO')} COP
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Proof Submission Form */}
                <form onSubmit={handleSubmitProof} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Número de Referencia Nequi
                      </label>
                      <button
                        type="button"
                        onClick={generateMockReference}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Generar de prueba
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={referenceInput}
                        onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                        placeholder="Ej: M984123 o número de transacción"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Código que aparece en la pantalla final de comprobante en la app Nequi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tu Teléfono Nequi (Remitente)
                    </label>
                    <input
                      type="text"
                      value={senderPhoneInput}
                      onChange={(e) => setSenderPhoneInput(e.target.value)}
                      placeholder="Ej: 312 456 7890"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verificando comprobante...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Subir Comprobante y Pasar a Nivel {currentRule.nextLevel}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {currentLevel >= 2 && currentRule.netBenefit > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-900 font-medium">
                  💡 <strong>Beneficio Neto:</strong> Recibiste ${currentRule.totalExpectedReceive.toLocaleString('es-CO')} y envías ${currentRule.sendAmount.toLocaleString('es-CO')} COP. Te quedan <strong className="text-emerald-700 font-black">+${currentRule.netBenefit.toLocaleString('es-CO')} COP limpios</strong>.
                </div>
              )}
            </>
          ) : (
            /* Level 4 Reached */
            <div className="p-6 text-center space-y-3 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                ¡Has alcanzado el Nivel 4 (VIP Diamante)!
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Estás en el rango máximo del sistema. Tus encuestas pagan $20.000 COP y tareas $50.000 COP por validación.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
                Recaudas hasta $160.000 COP por cada grupo de 4 usuarios Nivel 3.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proofs and Transfers History Accordion / Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Historial de Comprobantes y Transferencias Nequi
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Auditado y respaldado en la red
          </span>
        </div>

        {((currentUser.nequiTransfersSent && currentUser.nequiTransfersSent.length > 0) ||
          (currentUser.nequiTransfersReceived && currentUser.nequiTransfersReceived.length > 0)) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sent Transfers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Transferencias Realizadas por Ti (Ascensos):
              </h4>
              {currentUser.nequiTransfersSent && currentUser.nequiTransfersSent.length > 0 ? (
                <div className="space-y-2">
                  {currentUser.nequiTransfersSent.map((tr) => (
                    <div
                      key={tr.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          Ascenso a Nivel {tr.targetLevel} ➜ {tr.receiverName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Ref: <span className="font-mono font-bold text-slate-700">{tr.referenceCode}</span> • {tr.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">
                          -${tr.amount.toLocaleString('es-CO')} COP
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {tr.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 text-center">
                  Aún no has enviado comprobantes de ascenso.
                </div>
              )}
            </div>

            {/* Received Transfers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Transferencias Recibidas de tus Usuarios:
              </h4>
              {currentUser.nequiTransfersReceived && currentUser.nequiTransfersReceived.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {currentUser.nequiTransfersReceived.map((tr) => (
                    <div
                      key={tr.id}
                      className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          De: {tr.senderName} ({tr.senderPhone || 'Nequi'})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Ref: <span className="font-mono font-bold text-slate-700">{tr.referenceCode}</span> • {tr.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 block">
                          +${tr.amount.toLocaleString('es-CO')} COP
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded">
                          {tr.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 text-center">
                  Aún no tienes transferencias recibidas de usuarios.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
            No hay registros de transferencias aún. Al realizar tu primera transferencia o simular usuarios aparecerán aquí.
          </div>
        )}
      </div>

      {/* Explanation Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-lg">
                  Metodología Solidaria Nequi
                </h3>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-950">
                <h4 className="font-black text-sm">1. Nivel 1 ➜ Nivel 2</h4>
                <p>
                  4 usuarios en Nivel 1 envían <strong>$10.000 COP</strong> cada uno al Nequi de la persona en Nivel 2.
                  La persona Nivel 2 recibe <strong>$40.000 COP</strong> en total.
                  Al realizar la transferencia y subir el comprobante, <strong>los 4 usuarios pasan automáticamente a Nivel 2</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-slate-800">
                <h4 className="font-black text-sm">2. Nivel 2 ➜ Nivel 3</h4>
                <p>
                  El usuario Nivel 2 envía <strong>$20.000 COP</strong> a la persona Nivel 3 asignada.
                  Al subir el comprobante pasa automáticamente a <strong>Nivel 3</strong>.
                  El Nivel 3 recibe transferencias de 4 usuarios Nivel 2 = <strong>$80.000 COP</strong> en total.
                  Al Nivel 2 le quedan <strong>$20.000 COP netos</strong> de ganancia.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-purple-950">
                <h4 className="font-black text-sm">3. Nivel 3 ➜ Nivel 4 (VIP)</h4>
                <p>
                  El usuario Nivel 3 envía <strong>$40.000 COP</strong> a la persona Nivel 4.
                  El usuario Nivel 4 recibe transferencias de 4 usuarios Nivel 3 = <strong>$160.000 COP</strong> en total.
                  Al Nivel 3 le quedan <strong>$40.000 COP netos</strong> de ganancia.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowExplanationModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
