export async function syncToGoogleSheets(payload: Record<string, unknown>): Promise<{ success: boolean; message?: string }> {
  try {
    const url = localStorage.getItem('ganapro_sheets_url');
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'No hay URL de Google Apps Script configurada' };
    }

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return { success: true, message: 'Datos transmitidos a Google Apps Script' };
  } catch (err) {
    console.warn('Error sincronizando con Google Sheets:', err);
    return { success: false, message: 'Error de conexión con el script' };
  }
}

export interface SheetsUserData {
  Nombre?: string;
  Email?: string;
  Saldo?: number;
  Rol?: string;
  Nivel?: number;
  Acumulado?: number;
  'Número de Nequi'?: string;
  'Numero de Nequi'?: string;
  NumeroNequi?: string;
  Telefono?: string;
  [key: string]: unknown;
}

export async function fetchUsersFromGoogleSheets(): Promise<{
  success: boolean;
  users?: SheetsUserData[];
  message?: string;
}> {
  try {
    const url = localStorage.getItem('ganapro_sheets_url');
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'No hay URL de Google Apps Script configurada' };
    }

    // Perform GET request
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return { success: false, message: `Error HTTP ${response.status}` };
    }

    const json = await response.json();
    if (json && json.success && Array.isArray(json.users)) {
      return {
        success: true,
        users: json.users,
        message: 'Usuarios sincronizados con Google Sheets'
      };
    }

    return { success: false, message: json.message || 'Respuesta inválida del script' };
  } catch (err) {
    console.warn('Error obteniendo usuarios de Google Sheets:', err);
    return { success: false, message: 'No se pudo leer la hoja en línea (verifique permisos o CORS)' };
  }
}

export async function syncUserToGoogleSheets(user: {
  email: string;
  name: string;
  balance: number;
  level: number;
  acumulado: number;
  phone?: string;
  paymentMethod?: string;
  role?: string;
}): Promise<{ success: boolean; message?: string }> {
  // En Saldo de Google Sheets se muestra el saldo acumulado de cada usuario
  const userAcumulado = user.acumulado !== undefined ? user.acumulado : user.balance;
  const nequiNumber = user.phone || '';

  return syncToGoogleSheets({
    action: 'syncUser',
    userEmail: user.email,
    email: user.email,
    name: user.name,
    phone: nequiNumber,
    numeroNequi: nequiNumber,
    'Número de Nequi': nequiNumber,
    balance: userAcumulado, // En Saldo se muestra el acumulado
    saldo: userAcumulado,
    level: user.level,
    acumulado: userAcumulado,
    paymentMethod: user.paymentMethod,
    role: user.role
  });
}

