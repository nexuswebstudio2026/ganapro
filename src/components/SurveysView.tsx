import React, { useState } from 'react';
import { Survey, User, SURVEY_REWARDS_BY_LEVEL, UserLevel } from '../types';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  Check,
  X,
  Bot,
  Compass,
  Trophy,
  Landmark,
  Shuffle,
  Loader2,
  TrendingUp,
  Award
} from 'lucide-react';

interface SurveysViewProps {
  surveys: Survey[];
  currentUser: User;
  onCompleteSurvey: (survey: Survey, earnedReward: number) => void;
  onAddAISurvey: (survey: Survey) => void;
  onErrorToast: (msg: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const SurveysView: React.FC<SurveysViewProps> = ({
  surveys,
  currentUser,
  onCompleteSurvey,
  onAddAISurvey,
  onErrorToast,
  onSuccessToast
}) => {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<'Cultura' | 'Deporte' | 'Historia' | 'Azar'>('Azar');
  const [showLevelTable, setShowLevelTable] = useState(false);

  const userLevel = (currentUser.level || 1) as UserLevel;
  const currentCommission = SURVEY_REWARDS_BY_LEVEL[userLevel] || 2000;

  const handleStartSurvey = (survey: Survey) => {
    setActiveSurvey(survey);
    setQuestionIndex(0);
    setSelectedOption(survey.questions[0]?.options[0] || '');
  };

  const handleGenerateAISurvey = async (customTopic?: 'Cultura' | 'Deporte' | 'Historia' | 'Azar') => {
    const topicToUse = customTopic || selectedTopic;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse === 'Azar' ? undefined : topicToUse
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con el motor de IA');
      }

      const data = await response.json();
      if (data && data.survey) {
        const newSurvey: Survey = {
          ...data.survey,
          reward: currentCommission,
          isAIGenerated: true
        };

        onAddAISurvey(newSurvey);
        onSuccessToast(`¡Encuesta sobre ${newSurvey.category} generada con éxito por la Inteligencia Artificial!`);
        // Start survey immediately
        handleStartSurvey(newSurvey);
      } else {
        throw new Error('Formato inválido de encuesta');
      }
    } catch (err) {
      console.error(err);
      onErrorToast('Hubo un inconveniente al generar la encuesta. Se activó el catálogo temático.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!activeSurvey) return;

    if (questionIndex < activeSurvey.questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setSelectedOption(activeSurvey.questions[nextIndex]?.options[0] || '');
    } else {
      // Completed!
      onCompleteSurvey(activeSurvey, currentCommission);
      setActiveSurvey(null);
    }
  };

  const closeModal = () => {
    setActiveSurvey(null);
  };

  const levelBadges: Record<UserLevel, { label: string; bg: string; text: string; border: string }> = {
    1: { label: 'Nivel 1 (Bronce)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    2: { label: 'Nivel 2 (Plata)', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
    3: { label: 'Nivel 3 (Oro)', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300' },
    4: { label: 'Nivel 4 (Diamante)', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300' },
  };

  return (
    <div className="space-y-6">
      {/* Level & Commission Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Encuestas Remuneradas
            </h2>
            <span className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${levelBadges[userLevel].bg} ${levelBadges[userLevel].text} ${levelBadges[userLevel].border}`}>
              {levelBadges[userLevel].label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Tu comisión actual es de <strong className="text-indigo-600 font-black">${currentCommission.toLocaleString('es-CO')} COP</strong> por cada encuesta completada.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setShowLevelTable(!showLevelTable)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Ver Tabla de Niveles</span>
          </button>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Paga: ${currentCommission.toLocaleString('es-CO')} COP</span>
          </div>
        </div>
      </div>

      {/* Levels Explanatory Dropdown / Card */}
      {showLevelTable && (
        <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h4 className="font-bold text-sm text-white">Escala de Comisiones por Nivel en Encuestas</h4>
            </div>
            <button
              onClick={() => setShowLevelTable(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${userLevel === 1 ? 'bg-indigo-700/80 border-indigo-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
              <div className="text-slate-300 font-bold">Nivel 1</div>
              <div className="text-base font-black text-yellow-300">$2.000 COP</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Inicial / Bronce</div>
            </div>
            <div className={`p-3 rounded-xl border ${userLevel === 2 ? 'bg-indigo-700/80 border-indigo-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
              <div className="text-slate-300 font-bold">Nivel 2</div>
              <div className="text-base font-black text-yellow-300">$5.000 COP</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Rango Plata</div>
            </div>
            <div className={`p-3 rounded-xl border ${userLevel === 3 ? 'bg-indigo-700/80 border-indigo-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
              <div className="text-slate-300 font-bold">Nivel 3</div>
              <div className="text-base font-black text-yellow-300">$10.000 COP</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Rango Oro</div>
            </div>
            <div className={`p-3 rounded-xl border ${userLevel === 4 ? 'bg-indigo-700/80 border-indigo-400 shadow-sm' : 'bg-white/5 border-white/10'}`}>
              <div className="text-slate-300 font-bold">Nivel 4</div>
              <div className="text-base font-black text-yellow-300">$20.000 COP</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Rango VIP Diamante</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Survey Generator Box (Mandated by user) */}
      <div className="bg-linear-to-r from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden border border-indigo-900/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generador de Encuestas con Inteligencia Artificial</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ¿Deseas iniciar una encuesta nueva? Genera una al azar con IA
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Nuestra IA genera preguntas en tiempo real sobre <strong>cultura</strong>, <strong>deporte</strong> e <strong>historia</strong>. Elige un tema específico o deja que la IA seleccione uno al azar y gana tu comisión de <strong>${currentCommission.toLocaleString('es-CO')} COP</strong> al responderla.
          </p>

          {/* Topic Selector Chips */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Selecciona el tema de la encuesta:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTopic('Azar')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTopic === 'Azar'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Al Azar (Cualquiera)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTopic('Cultura')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTopic === 'Cultura'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 border border-pink-500'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Cultura y Tradición</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTopic('Deporte')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTopic === 'Deporte'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-500'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Deporte y Rendimiento</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTopic('Historia')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTopic === 'Historia'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-500'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Historia y Acontecimientos</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => handleGenerateAISurvey()}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>La Inteligencia Artificial está redactando tu encuesta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Iniciar Encuesta con Inteligencia Artificial</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <Bot className="w-72 h-72 text-white/5 absolute -right-12 -bottom-12 pointer-events-none" />
      </div>

      {/* Available Surveys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Encuestas Disponibles ({surveys.length})
          </h3>
          <span className="text-xs text-slate-500">
            Comisión por encuesta: <strong className="text-slate-800">${currentCommission.toLocaleString('es-CO')} COP</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surveys.map((survey) => {
            const isDone = currentUser.surveysCompleted.includes(survey.id);

            return (
              <div
                key={survey.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:border-indigo-200 transition-all relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                        {survey.category}
                      </span>
                      {survey.isAIGenerated && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-md flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          <span>IA</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {survey.duration}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {survey.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {survey.questions.length} preguntas interactivas. Comisión correspondiente a tu Nivel {userLevel}.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Recompensa</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      +${currentCommission.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  {isDone ? (
                    <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completada</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartSurvey(survey)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Iniciar Encuesta</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Survey Modal */}
      {activeSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold text-xs rounded-full">
                  {activeSurvey.category}
                </span>
                {activeSurvey.isAIGenerated && (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Generada con IA
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {activeSurvey.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comisión acreditada al completar (Nivel {userLevel}):{' '}
                <strong className="text-emerald-600 font-extrabold text-sm">
                  +${currentCommission.toLocaleString('es-CO')} COP
                </strong>
              </p>
            </div>

            {/* Current Question */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-800 flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-black">
                  {questionIndex + 1}
                </span>
                <span className="leading-snug">
                  {activeSurvey.questions[questionIndex]?.question}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {activeSurvey.questions[questionIndex]?.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs font-medium ${
                      selectedOption === option
                        ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-indigo-50/40 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="survey_option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                      className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer / Progression */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                Pregunta {questionIndex + 1} de {activeSurvey.questions.length}
              </span>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                {questionIndex === activeSurvey.questions.length - 1 ? (
                  <>
                    <span>Finalizar y Cobrar ${currentCommission.toLocaleString('es-CO')}</span>
                    <Check className="w-4 h-4 text-emerald-300" />
                  </>
                ) : (
                  <>
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
