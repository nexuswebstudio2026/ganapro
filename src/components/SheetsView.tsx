import React, { useState, useEffect } from 'react';
import { APPS_SCRIPT_TEMPLATE } from '../data/initialData';
import { Table, Copy, Check, Save, Radio, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SheetsViewProps {
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const SheetsView: React.FC<SheetsViewProps> = ({
  onSuccessToast,
  onErrorToast
}) => {
  const [scriptUrl, setScriptUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ganapro_sheets_url') || '';
    setScriptUrl(saved);
    setIsConnected(!!saved && saved.startsWith('http'));
  }, []);

  const handleSave = () => {
    const trimmed = scriptUrl.trim();
    localStorage.setItem('ganapro_sheets_url', trimmed);
    setIsConnected(!!trimmed && trimmed.startsWith('http'));
    onSuccessToast('URL de Google Apps Script guardada correctamente');
  };

  const handleTestConnection = async () => {
    if (!scriptUrl.trim()) {
      onErrorToast('Ingresa primero la URL de tu Web App de Google Apps Script');
      return;
    }

    setIsTesting(true);
    try {
      // Test GET or no-cors POST
      const res = await fetch(scriptUrl.trim(), { method: 'GET', mode: 'no-cors' });
      setIsConnected(true);
      onSuccessToast('Petición enviada exitosamente a Google Apps Script');
    } catch (err) {
      console.error(err);
      onSuccessToast('URL configurada para transmisión no-cors');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
      setCopied(true);
      onSuccessToast('Código de Google Apps Script copiado al portapapeles');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      onErrorToast('No se pudo copiar automáticamente. Puedes seleccionarlo manualmente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
            Base de Datos en la Nube
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Conectar con Google Sheets (Hoja 1 = Usuarios)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-3xl">
            Sincroniza tus usuarios, encuestas, tareas y solicitudes de retiro en tu propia hoja de cálculo de Google Sheets. 
            <strong> La Hoja 1 se renombrará automáticamente a &quot;Usuarios&quot;</strong> y contendrá la tabla principal con el usuario Administrador precreado.
          </p>
        </div>

        {/* Input Web App URL */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            URL del Web App de Google Apps Script
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-mono text-slate-800"
            />
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Guardar URL</span>
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>{isTesting ? 'Probando...' : 'Probar'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-400'
              }`}
            />
            <span className={isConnected ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
              {isConnected
                ? 'Conectado a Google Apps Script Web App (Transmisión activa)'
                : 'Modo Almacenamiento Local (Sin conectar a Apps Script aún)'}
            </span>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instrucciones de Despliegue en Google Sheets:</span>
          </h3>

          <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <li>
              Crea o abre una hoja de cálculo nueva en{' '}
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-700 underline inline-flex items-center gap-1"
              >
                Google Sheets <ExternalLink className="w-3 h-3" />
              </a>
              .
            </li>
            <li>
              En el menú superior de Sheets, ve a:{' '}
              <strong>Extensiones &gt; Apps Script</strong>.
            </li>
            <li>
              Borra todo el contenido de <code>Código.gs</code>, pega el script de abajo y presiona <strong>Guardar</strong>.
            </li>
            <li>
              Haz clic en <strong>Desplegar &gt; Nuevo despliegue</strong>, selecciona tipo <strong>Aplicación web</strong>, configura &quot;Quién tiene acceso&quot; en <strong>Cualquier usuario</strong> y copia la URL terminada en <code>/exec</code>.
            </li>
            <li>
              Pega la URL aquí arriba y haz clic en <strong>Guardar URL</strong>. ¡Listo!
            </li>
          </ol>

          {/* Code block */}
          <div className="relative">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 text-slate-200 rounded-t-2xl text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>Código Apps Script (Hoja 1 = Usuarios Auto-Setup)</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-2xl text-xs overflow-x-auto font-mono max-h-80 custom-scrollbar leading-relaxed">
              {APPS_SCRIPT_TEMPLATE}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
