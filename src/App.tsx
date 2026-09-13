import React, { useState, useEffect } from 'react';
import {
  User,
  ViewTab,
  Survey,
  Task,
  PaymentMethod,
  Toast,
  SURVEY_REWARDS_BY_LEVEL,
  TASK_REWARDS_BY_LEVEL,
  REFERRAL_REWARD,
  UserLevel,
  NequiTransferProof,
  WithdrawalRequest
} from './types';
import { DEFAULT_ADMIN, INITIAL_USERS, INITIAL_SURVEYS, INITIAL_TASKS, INITIAL_WITHDRAWAL_REQUESTS } from './data/initialData';
import { syncToGoogleSheets, fetchUsersFromGoogleSheets, syncUserToGoogleSheets } from './utils/sheetsSync';

import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { SurveysView } from './components/SurveysView';
import { TasksView } from './components/TasksView';
import { ReferralsView } from './components/ReferralsView';
import { WithdrawalsView } from './components/WithdrawalsView';
import { SheetsView } from './components/SheetsView';
import { AdminView } from './components/AdminView';
import { AdminWithdrawalsView } from './components/AdminWithdrawalsView';

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('ganapro_users');
      if (stored) {
        const parsed: User[] = JSON.parse(stored);
        // Ensure initial preset users exist (admin, usuario1, usuario5)
        INITIAL_USERS.forEach((preset) => {
          const exists = parsed.some((u) => u.email.toLowerCase() === preset.email.toLowerCase());
          if (!exists) {
            parsed.push(preset);
          }
        });

        return parsed.map((u, i) => ({
          ...u,
          level: (u.level || 1) as UserLevel,
          acumulado: u.acumulado !== undefined ? u.acumulado : u.balance || 0,
          referralCode: u.referralCode || `GP-${(u.name || 'USR').slice(0, 3).toUpperCase()}${100 + i}`,
          referralCount: u.referralCount || 0,
          referralEarnings: u.referralEarnings || 0
        }));
      }
    } catch (e) {
      console.warn('Error reading ganapro_users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ganapro_current_user');
      if (stored) {
        const parsed: User = JSON.parse(stored);
        return {
          ...parsed,
          level: (parsed.level || 1) as UserLevel,
          acumulado: parsed.acumulado !== undefined ? parsed.acumulado : parsed.balance || 0,
          referralCode: parsed.referralCode || `GP-${(parsed.name || 'USR').slice(0, 3).toUpperCase()}${Date.now().toString().slice(-3)}`,
          referralCount: parsed.referralCount || 0,
          referralEarnings: parsed.referralEarnings || 0
        };
      }
    } catch (e) {
      console.warn('Error reading ganapro_current_user', e);
    }
    return null;
  });

  const [surveys, setSurveys] = useState<Survey[]>(() => {
    try {
      const stored = localStorage.getItem('ganapro_surveys');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return INITIAL_SURVEYS;
  });

  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    try {
      const stored = localStorage.getItem('ganapro_withdrawal_requests');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return INITIAL_WITHDRAWAL_REQUESTS;
  });

  // Sync users with Google Sheets (Fetches latest data from Sheets GET endpoint)
  const handleSyncSheets = async (silent = false) => {
    const url = localStorage.getItem('ganapro_sheets_url');
    if (!url || !url.startsWith('http')) {
      if (!silent) {
        addToast('Configura primero la URL de tu Web App en la pestaña Google Sheets.', 'info');
      }
      return;
    }

    setIsSyncingSheets(true);
    try {
      const res = await fetchUsersFromGoogleSheets();
      if (res.success && res.users && res.users.length > 0) {
        const nowStr = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

        setUsers((prevUsers) => {
          const updated = [...prevUsers];
          res.users!.forEach((sheetUser) => {
            const email = (sheetUser.Email || '').toLowerCase().trim();
            if (!email) return;

            const idx = updated.findIndex((u) => u.email.toLowerCase().trim() === email);
            const nequiPhone =
              (sheetUser['Número de Nequi'] as string) ||
              (sheetUser['Numero de Nequi'] as string) ||
              (sheetUser.NumeroNequi as string) ||
              (sheetUser.Telefono as string);

            // En Saldo de Google Sheets se muestra el saldo acumulado de cada usuario
            const sheetAcumulado = typeof sheetUser.Saldo === 'number'
              ? sheetUser.Saldo
              : typeof sheetUser.Acumulado === 'number'
              ? sheetUser.Acumulado
              : undefined;

            const sheetLevel = typeof sheetUser.Nivel === 'number' && [1, 2, 3, 4].includes(sheetUser.Nivel)
              ? (sheetUser.Nivel as UserLevel)
              : undefined;

            if (idx !== -1) {
              const cur = updated[idx];
              const effectiveAcumulado = sheetAcumulado !== undefined ? sheetAcumulado : (cur.acumulado !== undefined ? cur.acumulado : cur.balance);
              updated[idx] = {
                ...cur,
                phone: nequiPhone || cur.phone,
                balance: effectiveAcumulado,
                acumulado: effectiveAcumulado,
                level: sheetLevel !== undefined ? sheetLevel : cur.level,
                lastSheetsSync: nowStr
              };
            } else {
              // Add new user from Google Sheets
              const effectiveAcumulado = sheetAcumulado !== undefined ? sheetAcumulado : 0;
              const newUserFromSheet: User = {
                id: 'sheet-' + Date.now() + Math.random().toString(36).substring(2, 5),
                name: sheetUser.Nombre || email.split('@')[0],
                email: email,
                password: 'password123',
                phone: nequiPhone || '312 000 0000',
                paymentMethod: 'Llave Bre-B',
                balance: effectiveAcumulado,
                acumulado: effectiveAcumulado,
                role: (sheetUser.Rol && sheetUser.Rol.toLowerCase().includes('admin')) ? 'admin' : 'usuario',
                level: sheetLevel || 1,
                referralCode: `GP-${email.slice(0, 3).toUpperCase()}99`,
                referralCount: 0,
                referralEarnings: 0,
                surveysCompleted: [],
                tasksCompleted: [],
                withdrawn: 0,
                lastSheetsSync: nowStr,
                history: [
                  {
                    id: 'imp-' + Date.now(),
                    type: 'Bono',
                    description: 'Usuario importado desde Google Sheets',
                    amount: effectiveAcumulado,
                    date: new Date().toLocaleDateString('es-CO'),
                    status: 'Acreditado'
                  }
                ]
              };
              updated.push(newUserFromSheet);
            }
          });
          return updated;
        });

        // Keep active currentUser in sync with the sheet's new data
        setCurrentUser((prev) => {
          if (!prev) return null;
          const match = res.users!.find(
            (su) => (su.Email || '').toLowerCase().trim() === prev.email.toLowerCase().trim()
          );
          if (!match) return prev;

          const nequiPhone =
            (match['Número de Nequi'] as string) ||
            (match['Numero de Nequi'] as string) ||
            (match.NumeroNequi as string) ||
            (match.Telefono as string);

          const sheetAcumulado = typeof match.Saldo === 'number'
            ? match.Saldo
            : typeof match.Acumulado === 'number'
            ? match.Acumulado
            : prev.acumulado;

          const sheetLevel = typeof match.Nivel === 'number' && [1, 2, 3, 4].includes(match.Nivel)
            ? (match.Nivel as UserLevel)
            : prev.level;

          return {
            ...prev,
            phone: nequiPhone || prev.phone,
            balance: sheetAcumulado,
            acumulado: sheetAcumulado,
            level: sheetLevel !== undefined ? sheetLevel : prev.level,
            lastSheetsSync: nowStr
          };
        });

        if (!silent) {
          addToast('¡Datos vinculados desde Google Sheets actualizados correctamente!', 'success');
        }
      } else {
        if (!silent) {
          addToast(res.message || 'La hoja de cálculo respondió pero no contiene filas de usuarios aún.', 'info');
        }
      }
    } catch (err) {
      console.warn('Sync error:', err);
      if (!silent) {
        addToast('Error al conectar con Google Apps Script. Revisa que el script esté desplegado.', 'error');
      }
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Check and run background sync once on mount
  useEffect(() => {
    const url = localStorage.getItem('ganapro_sheets_url');
    if (url && url.startsWith('http')) {
      handleSyncSheets(true);
    }
  }, []);

  // Persist surveys when AI adds new ones
  useEffect(() => {
    try {
      localStorage.setItem('ganapro_surveys', JSON.stringify(surveys));
    } catch (e) {
      // ignore
    }
  }, [surveys]);

  // Persist users to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('ganapro_users', JSON.stringify(users));
  }, [users]);

  // Persist currentUser to localStorage whenever updated
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ganapro_current_user', JSON.stringify(currentUser));
      // Keep in sync in users array
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = currentUser;
          return clone;
        }
        return [...prev, currentUser];
      });
    } else {
      localStorage.removeItem('ganapro_current_user');
    }
  }, [currentUser]);

  // Persist withdrawalRequests to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('ganapro_withdrawal_requests', JSON.stringify(withdrawalRequests));
    } catch (e) {
      // ignore
    }
  }, [withdrawalRequests]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleLogin = (email: string, pass: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );

    if (found) {
      setCurrentUser(found);
      setCurrentTab('dashboard');
      addToast(`¡Bienvenido de nuevo, ${found.name}! Nivel ${found.level || 1}`, 'success');
    } else {
      addToast('Correo o contraseña incorrectos. Revisa las credenciales.', 'error');
    }
  };

  const handleRegister = (data: {
    name: string;
    email: string;
    password: string;
    paymentMethod: PaymentMethod;
    referralCode?: string;
  }) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      addToast('Este correo electrónico ya se encuentra registrado.', 'error');
      return;
    }

    const uniqueCode = `GP-${data.name.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      paymentMethod: data.paymentMethod,
      balance: 0,
      acumulado: 0,
      role: 'usuario',
      level: 1, // Start at Level 1
      referralCode: uniqueCode,
      referredBy: data.referralCode || undefined,
      referralCount: 0,
      referralEarnings: 0,
      surveysCompleted: [],
      tasksCompleted: [],
      withdrawn: 0,
      history: [
        {
          id: 'welcome-' + Date.now(),
          type: 'Bono',
          description: 'Apertura de cuenta GanaPro (Rango Nivel 1)',
          amount: 0,
          date: nowStr,
          status: 'Acreditado'
        }
      ]
    };

    // If registered using a valid referral code, credit the referrer $1.000 COP
    if (data.referralCode) {
      const codeClean = data.referralCode.trim().toUpperCase();
      const referrer = users.find((u) => u.referralCode && u.referralCode.toUpperCase() === codeClean);
      if (referrer) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === referrer.id) {
              const curAcum = u.acumulado !== undefined ? u.acumulado : u.balance;
              const updatedReferrer: User = {
                ...u,
                balance: u.balance + REFERRAL_REWARD,
                acumulado: curAcum + REFERRAL_REWARD,
                referralCount: (u.referralCount || 0) + 1,
                referralEarnings: (u.referralEarnings || 0) + REFERRAL_REWARD,
                history: [
                  {
                    id: 'ref-' + Date.now(),
                    type: 'Referido',
                    description: `Comisión por referido nuevo (${newUser.name})`,
                    amount: REFERRAL_REWARD,
                    date: nowStr,
                    status: 'Acreditado'
                  },
                  ...u.history
                ]
              };
              syncUserToGoogleSheets(updatedReferrer);
              return updatedReferrer;
            }
            return u;
          })
        );
      }
    }

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentTab('dashboard');

    // Async sync to Google Sheets
    syncToGoogleSheets({
      action: 'register',
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      paymentMethod: newUser.paymentMethod,
      role: 'Usuario'
    });

    addToast(`¡Cuenta creada con éxito en Nivel 1! Tu código de referido es ${uniqueCode}`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('dashboard');
    addToast('Has cerrado sesión correctamente.', 'info');
  };

  // Level Upgrade Handler
  const handleUpgradeLevel = () => {
    if (!currentUser) return;
    const current = currentUser.level || 1;
    if (current >= 4) {
      addToast('Ya te encuentras en el nivel máximo (Nivel 4 VIP Diamante).', 'info');
      return;
    }

    const nextLevel = (current + 1) as UserLevel;
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated: User = {
      ...currentUser,
      level: nextLevel,
      history: [
        {
          id: 'lvl-' + Date.now(),
          type: 'Bono',
          description: `Ascenso de rango a Nivel ${nextLevel}`,
          amount: 0,
          date: nowStr,
          status: 'Acreditado'
        },
        ...currentUser.history
      ]
    };

    setCurrentUser(updated);
    syncUserToGoogleSheets(updated);
    addToast(`¡Felicidades! Has subido a Nivel ${nextLevel}. Ahora tus encuestas pagan $${SURVEY_REWARDS_BY_LEVEL[nextLevel].toLocaleString('es-CO')} y tareas $${TASK_REWARDS_BY_LEVEL[nextLevel].toLocaleString('es-CO')} COP.`, 'success');
  };

  // Admin Change User Level
  const handleChangeUserLevel = (userId: string | number, newLevel: UserLevel) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, level: newLevel };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
          }
          syncUserToGoogleSheets(updated);
          return updated;
        }
        return u;
      })
    );
    addToast(`Nivel del usuario actualizado a Nivel ${newLevel} y transmitido a Google Sheets`, 'success');
  };

  // Update User Acumulado (Google Sheets linked balance)
  const handleUpdateUserAcumulado = (userId: string | number, newAcumulado: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            acumulado: newAcumulado,
            lastSheetsSync: new Date().toLocaleTimeString('es-CO')
          };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
          }
          syncUserToGoogleSheets(updated);
          return updated;
        }
        return u;
      })
    );
    addToast(`Saldo acumulado fijado en $${newAcumulado.toLocaleString('es-CO')} COP y transmitido a Google Sheets`, 'success');
  };

  // Add AI Survey to state
  const handleAddAISurvey = (newSurvey: Survey) => {
    setSurveys((prev) => [newSurvey, ...prev]);
  };

  // Survey Completion Handler (Tiered)
  const handleCompleteSurvey = (survey: Survey, earnedReward: number) => {
    if (!currentUser) return;

    const userLevel = (currentUser.level || 1) as UserLevel;
    const reward = earnedReward || SURVEY_REWARDS_BY_LEVEL[userLevel] || 2000;
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const currentAcumulado = currentUser.acumulado !== undefined ? currentUser.acumulado : currentUser.balance;
    const newAcumulado = currentAcumulado + reward;
    const newBalance = currentUser.balance + reward;

    const updated: User = {
      ...currentUser,
      balance: newBalance,
      acumulado: newAcumulado,
      surveysCompleted: [...currentUser.surveysCompleted, survey.id],
      history: [
        {
          id: 'surv-' + Date.now(),
          type: 'Encuesta',
          description: `${survey.title} (Nivel ${userLevel})`,
          amount: reward,
          date: nowStr,
          status: 'Acreditado'
        },
        ...currentUser.history
      ]
    };

    setCurrentUser(updated);

    // Sync to Google Sheets
    syncUserToGoogleSheets(updated);
    syncToGoogleSheets({
      action: 'submitSurvey',
      userEmail: currentUser.email,
      surveyTitle: survey.title
    });

    addToast(`¡Excelente! Has ganado $${reward.toLocaleString('es-CO')} COP correspondientes a tu Nivel ${userLevel}. Saldo acumulado actualizado.`, 'success');
  };

  // Task Completion Handler (Tiered)
  const handleCompleteTask = (task: Task, proof: string, earnedReward: number) => {
    if (!currentUser) return;

    const userLevel = (currentUser.level || 1) as UserLevel;
    const reward = earnedReward || TASK_REWARDS_BY_LEVEL[userLevel] || 5000;
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const currentAcumulado = currentUser.acumulado !== undefined ? currentUser.acumulado : currentUser.balance;
    const newAcumulado = currentAcumulado + reward;
    const newBalance = currentUser.balance + reward;

    const updated: User = {
      ...currentUser,
      balance: newBalance,
      acumulado: newAcumulado,
      tasksCompleted: [...currentUser.tasksCompleted, task.id],
      history: [
        {
          id: 'task-' + Date.now(),
          type: 'Tarea',
          description: `${task.title} (Nivel ${userLevel})`,
          amount: reward,
          date: nowStr,
          status: 'Acreditado'
        },
        ...currentUser.history
      ]
    };

    setCurrentUser(updated);

    // Sync to Google Sheets
    syncUserToGoogleSheets(updated);
    syncToGoogleSheets({
      action: 'submitTask',
      userEmail: currentUser.email,
      taskTitle: task.title,
      proof
    });

    addToast(`¡Felicidades! Tarea validada y $${reward.toLocaleString('es-CO')} COP (Nivel ${userLevel}) acreditados a tu saldo.`, 'success');
  };

  // Simulate or Add Referral ($1.000 COP)
  const handleSimulateReferral = (friendName: string) => {
    if (!currentUser) return;

    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const currentAcumulado = currentUser.acumulado !== undefined ? currentUser.acumulado : currentUser.balance;
    const newAcumulado = currentAcumulado + REFERRAL_REWARD;
    const newBalance = currentUser.balance + REFERRAL_REWARD;

    const updated: User = {
      ...currentUser,
      balance: newBalance,
      acumulado: newAcumulado,
      referralCount: (currentUser.referralCount || 0) + 1,
      referralEarnings: (currentUser.referralEarnings || 0) + REFERRAL_REWARD,
      history: [
        {
          id: 'ref-' + Date.now(),
          type: 'Referido',
          description: `Referido registrado: ${friendName}`,
          amount: REFERRAL_REWARD,
          date: nowStr,
          status: 'Acreditado'
        },
        ...currentUser.history
      ]
    };

    setCurrentUser(updated);
    syncUserToGoogleSheets(updated);
    addToast(`¡Nuevo referido! ${friendName} se unió con tu código. Ganaste +$1.000 COP directos.`, 'success');
  };

  // Withdrawal Handler
  const handleWithdraw = (amount: number, method: PaymentMethod, account: string) => {
    if (!currentUser) return;

    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated: User = {
      ...currentUser,
      balance: currentUser.balance - amount,
      withdrawn: (currentUser.withdrawn || 0) + amount,
      history: [
        {
          id: 'wd-' + Date.now(),
          type: 'Retiro',
          description: `Retiro vía ${method} (${account})`,
          amount: -amount,
          date: nowStr,
          status: 'Pendiente'
        },
        ...currentUser.history
      ]
    };

    setCurrentUser(updated);
    syncUserToGoogleSheets(updated);

    // Record withdrawal request for admin dashboard
    const newRequest: WithdrawalRequest = {
      id: 'wd-req-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      amount,
      method,
      account,
      date: nowStr,
      status: 'Pendiente'
    };
    setWithdrawalRequests((prev) => [newRequest, ...prev]);

    // Sync to Google Sheets
    syncToGoogleSheets({
      action: 'withdraw',
      userEmail: currentUser.email,
      amount,
      method,
      account
    });

    addToast(`Solicitud de retiro por $${amount.toLocaleString('es-CO')} COP vía Llave Bre-B enviada correctamente.`, 'success');
  };

  // Admin action: Approve withdrawal request
  const handleApproveWithdrawal = (requestId: string) => {
    let approvedReq: WithdrawalRequest | undefined;
    setWithdrawalRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          approvedReq = { ...r, status: 'Aprobado' };
          return approvedReq;
        }
        return r;
      })
    );

    if (approvedReq) {
      const targetUserEmail = approvedReq.userEmail;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.email.toLowerCase() === targetUserEmail.toLowerCase()) {
            return {
              ...u,
              history: u.history.map((h) =>
                h.type === 'Retiro' && h.status === 'Pendiente' ? { ...h, status: 'Aprobado' } : h
              )
            };
          }
          return u;
        })
      );

      if (currentUser && currentUser.email.toLowerCase() === targetUserEmail.toLowerCase()) {
        setCurrentUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            history: prev.history.map((h) =>
              h.type === 'Retiro' && h.status === 'Pendiente' ? { ...h, status: 'Aprobado' } : h
            )
          };
        });
      }

      addToast(
        `¡Retiro por $${approvedReq.amount.toLocaleString('es-CO')} COP para ${approvedReq.userName} aprobado con éxito!`,
        'success'
      );
    }
  };

  // Admin action: Reject withdrawal request
  const handleRejectWithdrawal = (requestId: string) => {
    setWithdrawalRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rechazado' } : r))
    );
    addToast('Solicitud de retiro marcada como rechazada.', 'info');
  };

  // Admin action: Add bonus
  const handleAddBonusToUser = (userId: string | number, amount: number) => {
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const curAcum = u.acumulado !== undefined ? u.acumulado : u.balance;
          const updatedUser: User = {
            ...u,
            balance: u.balance + amount,
            acumulado: curAcum + amount,
            history: [
              {
                id: 'bon-' + Date.now(),
                type: 'Bono',
                description: 'Bono administrativo directo',
                amount,
                date: nowStr,
                status: 'Aprobado'
              },
              ...u.history
            ]
          };

          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updatedUser);
          }
          syncUserToGoogleSheets(updatedUser);
          return updatedUser;
        }
        return u;
      })
    );

    addToast(`Se han acreditado $${amount.toLocaleString('es-CO')} COP como bono especial.`, 'success');
  };

  // 4x1 Nequi Matrix: User uploads transfer proof to ascend to next level
  const handleUploadTransferProof = (
    senderId: string | number,
    receiverId: string | number,
    amount: number,
    targetLevel: UserLevel,
    referenceCode: string,
    senderPhone?: string
  ) => {
    const nowStr = new Date().toLocaleDateString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const sender = users.find((u) => u.id === senderId) || currentUser;
    const receiver = users.find((u) => u.id === receiverId);

    if (!sender) return;

    const proofObj: NequiTransferProof = {
      id: 'tr-' + Date.now(),
      senderId,
      senderName: sender.name,
      senderPhone: senderPhone || sender.phone || '312 000 0000',
      receiverId,
      receiverName: receiver ? receiver.name : 'Usuario Destino',
      receiverPhone: receiver?.phone || '312 456 7890',
      amount,
      targetLevel,
      referenceCode,
      date: nowStr,
      status: 'Verificado'
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === senderId) {
          const sentList = u.nequiTransfersSent || [];
          const updatedSender: User = {
            ...u,
            level: targetLevel,
            phone: senderPhone || u.phone,
            nequiTransfersSent: [proofObj, ...sentList],
            history: [
              {
                id: 'asc-' + Date.now(),
                type: 'Bono',
                description: `Ascenso a Nivel ${targetLevel} por transferencia Nequi (Ref: ${referenceCode})`,
                amount: 0,
                date: nowStr,
                status: 'Acreditado'
              },
              ...u.history
            ]
          };
          if (currentUser && currentUser.id === senderId) {
            setCurrentUser(updatedSender);
          }
          syncUserToGoogleSheets(updatedSender);
          return updatedSender;
        }

        if (receiver && u.id === receiverId) {
          const recvList = u.nequiTransfersReceived || [];
          const curAcum = u.acumulado !== undefined ? u.acumulado : u.balance;
          const updatedReceiver: User = {
            ...u,
            balance: u.balance + amount,
            acumulado: curAcum + amount,
            nequiTransfersReceived: [proofObj, ...recvList],
            history: [
              {
                id: 'rec-' + Date.now(),
                type: 'Bono',
                description: `Transferencia Nequi recibida de ${sender.name} (+ $${amount.toLocaleString('es-CO')} COP)`,
                amount,
                date: nowStr,
                status: 'Acreditado'
              },
              ...u.history
            ]
          };
          if (currentUser && currentUser.id === receiverId) {
            setCurrentUser(updatedReceiver);
          }
          syncUserToGoogleSheets(updatedReceiver);
          return updatedReceiver;
        }

        return u;
      })
    );

    addToast(
      `¡Comprobante verificado con éxito! Has ascendido automáticamente a Nivel ${targetLevel}. Tus comisiones se han multiplicado.`,
      'success'
    );
  };

  // Simulate an incoming transfer for Level 2 or Level 3
  const handleSimulateIncomingTransfer = (receiverId: string | number, level: UserLevel) => {
    const senderNames = ['Daniela Morales', 'Sebastián Ruiz', 'Camila Restrepo', 'Andrés Vargas', 'Valentina Gómez', 'Mateo Ramírez'];
    const randomName = senderNames[Math.floor(Math.random() * senderNames.length)];
    const amount = level === 2 ? 10000 : level === 3 ? 20000 : 50000;
    const nowStr = new Date().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const randomRef = 'M' + Math.floor(100000 + Math.random() * 900000);
    const randomPhone = `31${Math.floor(10 + Math.random() * 89)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

    const receiver = users.find((u) => u.id === receiverId) || currentUser;
    if (!receiver) return;

    const proofObj: NequiTransferProof = {
      id: 'sim-' + Date.now(),
      senderId: 'sim-' + Math.floor(Math.random() * 9999),
      senderName: randomName,
      senderPhone: randomPhone,
      receiverId,
      receiverName: receiver.name,
      receiverPhone: receiver.phone || '312 456 7890',
      amount,
      targetLevel: level,
      referenceCode: randomRef,
      date: nowStr,
      status: 'Verificado'
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === receiverId) {
          const recvList = u.nequiTransfersReceived || [];
          const curAcum = u.acumulado !== undefined ? u.acumulado : u.balance;
          const updated: User = {
            ...u,
            balance: u.balance + amount,
            acumulado: curAcum + amount,
            nequiTransfersReceived: [proofObj, ...recvList],
            history: [
              {
                id: 'rec-' + Date.now(),
                type: 'Bono',
                description: `Transferencia Nequi recibida de ${randomName} (+ $${amount.toLocaleString('es-CO')} COP)`,
                amount,
                date: nowStr,
                status: 'Acreditado'
              },
              ...u.history
            ]
          };
          if (currentUser && currentUser.id === receiverId) {
            setCurrentUser(updated);
          }
          syncUserToGoogleSheets(updated);
          return updated;
        }
        return u;
      })
    );

    addToast(
      `¡Transferencia recibida! ${randomName} te envió $${amount.toLocaleString('es-CO')} COP vía Nequi (Ref: ${randomRef}). Tu acumulado ha aumentado.`,
      'success'
    );
  };

  // Complete all 4 slots for the current level (4 x 10k = 40k for L2, 4 x 20k = 80k for L3)
  const handleCompleteFourSlots = (receiverId: string | number, level: UserLevel) => {
    const receiver = users.find((u) => u.id === receiverId) || currentUser;
    if (!receiver) return;

    const amountPerSlot = level === 2 ? 10000 : level === 3 ? 20000 : 50000;
    const totalAmount = amountPerSlot * 4;
    const nowStr = new Date().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const simSenders = [
      { name: 'Daniela Morales', phone: '310 445 6789' },
      { name: 'Sebastián Ruiz', phone: '315 221 8890' },
      { name: 'Camila Restrepo', phone: '318 990 1234' },
      { name: 'Andrés Vargas', phone: '312 667 4321' }
    ];

    const newProofs: NequiTransferProof[] = simSenders.map((s, idx) => ({
      id: `sim-slot-${Date.now()}-${idx}`,
      senderId: `sim-user-${idx + 1}`,
      senderName: s.name,
      senderPhone: s.phone,
      receiverId,
      receiverName: receiver.name,
      receiverPhone: receiver.phone || '312 456 7890',
      amount: amountPerSlot,
      targetLevel: level,
      referenceCode: 'M' + Math.floor(100000 + Math.random() * 900000),
      date: nowStr,
      status: 'Verificado'
    }));

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === receiverId) {
          const recvList = u.nequiTransfersReceived || [];
          const curAcum = u.acumulado !== undefined ? u.acumulado : u.balance;
          const updated: User = {
            ...u,
            balance: u.balance + totalAmount,
            acumulado: curAcum + totalAmount,
            nequiTransfersReceived: [...newProofs, ...recvList],
            history: [
              {
                id: 'mat-' + Date.now(),
                type: 'Bono',
                description: `Ciclo 4x1 completado: Recibidos 4 envíos (+ $${totalAmount.toLocaleString('es-CO')} COP)`,
                amount: totalAmount,
                date: nowStr,
                status: 'Acreditado'
              },
              ...u.history
            ]
          };
          if (currentUser && currentUser.id === receiverId) {
            setCurrentUser(updated);
          }
          syncUserToGoogleSheets(updated);
          return updated;
        }
        return u;
      })
    );

    addToast(
      `¡Los 4 usuarios han sido completados! Recibiste $${totalAmount.toLocaleString('es-CO')} COP en total. Ya estás listo para ascender al siguiente nivel.`,
      'success'
    );
  };

  // Switch current user for easy testing of levels
  const handleSwitchUser = (selectedUser: User) => {
    setCurrentUser(selectedUser);
    addToast(`Cambiado a perfil: ${selectedUser.name} (Nivel ${selectedUser.level || 1})`, 'info');
  };

  // Update phone number
  const handleUpdatePhone = (newPhone: string) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, phone: newPhone };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    syncUserToGoogleSheets(updated);
    addToast(`Número Nequi actualizado a ${newPhone}`, 'success');
  };

  // If not logged in, show AuthScreen
  if (!currentUser) {
    return (
      <main>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onLogout={handleLogout}
        onSyncSheets={handleSyncSheets}
        isSyncingSheets={isSyncingSheets}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          currentUser={currentUser}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          withdrawalRequests={withdrawalRequests}
          onApproveWithdrawal={handleApproveWithdrawal}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-x-hidden min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              onNavigate={(tab) => setCurrentTab(tab)}
              onUpgradeLevel={handleUpgradeLevel}
              onSyncSheets={handleSyncSheets}
              isSyncingSheets={isSyncingSheets}
            />
          )}

          {currentTab === 'encuestas' && (
            <SurveysView
              surveys={surveys}
              currentUser={currentUser}
              onCompleteSurvey={handleCompleteSurvey}
              onAddAISurvey={handleAddAISurvey}
              onErrorToast={(msg) => addToast(msg, 'error')}
              onSuccessToast={(msg) => addToast(msg, 'success')}
            />
          )}

          {currentTab === 'tareas' && (
            <TasksView
              tasks={tasks}
              currentUser={currentUser}
              users={users}
              onCompleteTask={handleCompleteTask}
              onUploadTransferProof={handleUploadTransferProof}
              onSimulateIncomingTransfer={handleSimulateIncomingTransfer}
              onCompleteFourSlots={handleCompleteFourSlots}
              onSwitchUser={handleSwitchUser}
              onUpdatePhone={handleUpdatePhone}
              onSuccessToast={(msg) => addToast(msg, 'success')}
              onErrorToast={(msg) => addToast(msg, 'error')}
            />
          )}

          {currentTab === 'referidos' && (
            <ReferralsView
              currentUser={currentUser}
              onSimulateReferral={handleSimulateReferral}
              onSuccessToast={(msg) => addToast(msg, 'success')}
            />
          )}

          {currentTab === 'retiros' && (
            <WithdrawalsView
              currentUser={currentUser}
              onWithdraw={handleWithdraw}
              onErrorToast={(msg) => addToast(msg, 'error')}
            />
          )}

          {currentTab === 'sheets' && (
            <SheetsView
              users={users}
              onSuccessToast={(msg) => addToast(msg, 'success')}
              onErrorToast={(msg) => addToast(msg, 'error')}
              onSyncSheets={handleSyncSheets}
              isSyncingSheets={isSyncingSheets}
              onUpdateUserAcumulado={handleUpdateUserAcumulado}
            />
          )}

          {currentTab === 'solicitudes' && currentUser.role === 'admin' && (
            <AdminWithdrawalsView
              withdrawalRequests={withdrawalRequests}
              onApproveWithdrawal={handleApproveWithdrawal}
              onRejectWithdrawal={handleRejectWithdrawal}
              onSuccessToast={(msg) => addToast(msg, 'success')}
            />
          )}

          {currentTab === 'admin' && currentUser.role === 'admin' && (
            <AdminView
              users={users}
              currentUser={currentUser}
              onAddBonusToUser={handleAddBonusToUser}
              onChangeUserLevel={handleChangeUserLevel}
              onUpdateUserAcumulado={handleUpdateUserAcumulado}
              onSyncSheets={handleSyncSheets}
              isSyncingSheets={isSyncingSheets}
              withdrawalRequests={withdrawalRequests}
              onApproveWithdrawal={handleApproveWithdrawal}
              onNavigateToSolicitudes={() => setCurrentTab('solicitudes')}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                addToast(`Sesión cambiada a ${user.name} (Nivel ${user.level || 1})`, 'info');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
