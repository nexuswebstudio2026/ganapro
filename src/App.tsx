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
  UserLevel
} from './types';
import { DEFAULT_ADMIN, INITIAL_SURVEYS, INITIAL_TASKS } from './data/initialData';
import { syncToGoogleSheets } from './utils/sheetsSync';

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

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('ganapro_users');
      if (stored) {
        const parsed: User[] = JSON.parse(stored);
        // Ensure default admin exists and has updated level and referral fields
        const adminIndex = parsed.findIndex((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());
        if (adminIndex === -1) {
          parsed.unshift(DEFAULT_ADMIN);
        } else {
          parsed[adminIndex] = {
            ...DEFAULT_ADMIN,
            ...parsed[adminIndex],
            level: parsed[adminIndex].level || 4,
            referralCode: parsed[adminIndex].referralCode || 'GP-ADMIN',
            referralCount: parsed[adminIndex].referralCount || 6,
            referralEarnings: parsed[adminIndex].referralEarnings || 6000
          };
        }
        // Ensure all users have level and referralCode
        return parsed.map((u, i) => ({
          ...u,
          level: (u.level || 1) as UserLevel,
          referralCode: u.referralCode || `GP-${(u.name || 'USR').slice(0, 3).toUpperCase()}${100 + i}`,
          referralCount: u.referralCount || 0,
          referralEarnings: u.referralEarnings || 0
        }));
      }
    } catch (e) {
      console.warn('Error reading ganapro_users from localStorage', e);
    }
    return [DEFAULT_ADMIN];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ganapro_current_user');
      if (stored) {
        const parsed: User = JSON.parse(stored);
        return {
          ...parsed,
          level: (parsed.level || 1) as UserLevel,
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
              return {
                ...u,
                balance: u.balance + REFERRAL_REWARD,
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
          return updated;
        }
        return u;
      })
    );
    addToast(`Nivel del usuario actualizado a Nivel ${newLevel}`, 'success');
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

    const updated: User = {
      ...currentUser,
      balance: currentUser.balance + reward,
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
    syncToGoogleSheets({
      action: 'submitSurvey',
      userEmail: currentUser.email,
      surveyTitle: survey.title
    });

    addToast(`¡Excelente! Has ganado $${reward.toLocaleString('es-CO')} COP correspondientes a tu Nivel ${userLevel}.`, 'success');
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

    const updated: User = {
      ...currentUser,
      balance: currentUser.balance + reward,
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

    const updated: User = {
      ...currentUser,
      balance: currentUser.balance + REFERRAL_REWARD,
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

    // Sync to Google Sheets
    syncToGoogleSheets({
      action: 'withdraw',
      userEmail: currentUser.email,
      amount,
      method,
      account
    });

    addToast(`Solicitud de retiro por $${amount.toLocaleString('es-CO')} COP enviada correctamente.`, 'success');
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
          const updatedUser: User = {
            ...u,
            balance: u.balance + amount,
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
          return updatedUser;
        }
        return u;
      })
    );

    addToast(`Se han acreditado $${amount.toLocaleString('es-CO')} COP como bono especial.`, 'success');
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
        />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-x-hidden min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              onNavigate={(tab) => setCurrentTab(tab)}
              onUpgradeLevel={handleUpgradeLevel}
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
              onCompleteTask={handleCompleteTask}
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
              onSuccessToast={(msg) => addToast(msg, 'success')}
              onErrorToast={(msg) => addToast(msg, 'error')}
            />
          )}

          {currentTab === 'admin' && currentUser.role === 'admin' && (
            <AdminView
              users={users}
              currentUser={currentUser}
              onAddBonusToUser={handleAddBonusToUser}
              onChangeUserLevel={handleChangeUserLevel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
