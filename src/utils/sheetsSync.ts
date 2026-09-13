export async function syncToGoogleSheets(payload: Record<string, unknown>): Promise<{ success: boolean; message?: string }> {
  try {
    const url = localStorage.getItem('ganapro_sheets_url');
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'No hay URL configurada' };
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
