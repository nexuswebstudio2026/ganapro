import { Survey, Task, User } from '../types';

export const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  name: 'Administrador GanaPro',
  email: 'admin@ganapro.com',
  password: 'admin',
  paymentMethod: 'Nequi',
  balance: 35000,
  role: 'admin',
  level: 4,
  referralCode: 'GP-ADMIN',
  referralCount: 6,
  referralEarnings: 6000,
  surveysCompleted: [],
  tasksCompleted: [],
  withdrawn: 0,
  history: [
    {
      id: 'h-admin-01',
      type: 'Bono',
      description: 'Bono de bienvenida Administrador Nivel 4',
      amount: 29000,
      date: '12/09/2026, 08:00',
      status: 'Acreditado'
    },
    {
      id: 'h-admin-02',
      type: 'Referido',
      description: 'Comisión por referido activo (carlos.m)',
      amount: 1000,
      date: '12/09/2026, 09:30',
      status: 'Acreditado'
    }
  ]
};

export const INITIAL_SURVEYS: Survey[] = [
  {
    id: 1,
    title: 'Hábitos de Consumo Digital 2026',
    category: 'Tecnología',
    duration: '3 mins',
    reward: 2000,
    questions: [
      {
        question: '¿Qué tipo de dispositivos utilizas con mayor frecuencia al día?',
        options: [
          'Teléfono Smartphone',
          'Computador de Escritorio/Laptop',
          'Tablet',
          'Consola de Videojuegos'
        ]
      },
      {
        question: '¿Cuántas horas al día pasas interactuando en redes sociales?',
        options: [
          'Menos de 1 hora',
          'Entre 1 y 3 horas',
          'Entre 3 y 5 horas',
          'Más de 5 horas'
        ]
      },
      {
        question: '¿Has realizado compras por internet en los últimos 30 días?',
        options: [
          'Sí, frecuentemente',
          'Sí, ocasionalmente',
          'No, prefiero compras físicas'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Preferencias de Compras y E-Commerce',
    category: 'E-Commerce',
    duration: '4 mins',
    reward: 2000,
    questions: [
      {
        question: '¿Cuál es tu plataforma de comercio electrónico preferida?',
        options: [
          'Mercado Libre',
          'Amazon',
          'Shopee',
          'Tiendas locales de Instagram/WhatsApp'
        ]
      },
      {
        question: '¿Qué método de pago prefieres utilizar para compras web?',
        options: [
          'Nequi / Daviplata',
          'Tarjeta de Crédito',
          'Tarjeta de Débito / PSE',
          'Pago Contra Entrega'
        ]
      },
      {
        question: '¿Qué factor influye más en tu decisión de compra?',
        options: [
          'Precio bajo',
          'Envío rápido / gratis',
          'Buenas calificaciones y fotos',
          'Garantía del producto'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Bebidas y Estilo de Vida Saludable',
    category: 'Estilo de Vida',
    duration: '2 mins',
    reward: 2000,
    questions: [
      {
        question: '¿Con qué frecuencia consumes bebidas hidratantes o energizantes?',
        options: [
          'Diariamente',
          '3 a 4 veces por semana',
          'Ocasionalmente',
          'Nunca'
        ]
      },
      {
        question: '¿Prefieres consumir marcas locales o internacionales?',
        options: [
          'Marcas locales / nacionales',
          'Marcas internacionales reconocidas',
          'Indiferente'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Servicios Financieros y Billeteras Digitales',
    category: 'Finanzas',
    duration: '3 mins',
    reward: 2000,
    questions: [
      {
        question: '¿Cuál es tu billetera digital principal de uso diario?',
        options: [
          'Nequi',
          'Daviplata',
          'Dale / Movii',
          'Bancolombia a la Mano'
        ]
      },
      {
        question: '¿Qué función consideras más importante en una app de dinero?',
        options: [
          'Transferencias inmediatas sin costo',
          'Pagos mediante código QR',
          'Bolsillos de ahorro y metas',
          'Disponibilidad sin caídas del sistema'
        ]
      }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 101,
    title: 'Dejar Reseña Positiva en Google Maps',
    category: 'Micro-Influencia',
    reward: 5000,
    instructions: "Visita el perfil de Google Maps de nuestro negocio patrocinado 'Café Gourmet Central', deja una reseña de 5 estrellas con un comentario amigable sobre la atención y adjunta una foto si es posible. Pega el enlace de tu reseña o tu nombre de usuario de Google."
  },
  {
    id: 102,
    title: 'Seguir Cuenta de Instagram y Comentar',
    category: 'Redes Sociales',
    reward: 5000,
    instructions: 'Sigue a la cuenta @tienda_ganapro en Instagram, dale me gusta a la última publicación y deja un comentario positivo con al menos 4 palabras. Pega tu nombre de usuario de Instagram como comprobante.'
  },
  {
    id: 103,
    title: 'Probar App Móvil y Calificar con 5 Estrellas',
    category: 'Descarga de Apps',
    reward: 5000,
    instructions: "Descarga la aplicación 'FinanzasPro' desde la Play Store o App Store, ábrela por 2 minutos, califícala con 5 estrellas en la tienda y escribe una breve opinión. Escribe tu usuario de la tienda de apps."
  },
  {
    id: 104,
    title: 'Unirse al Canal Oficial de Telegram',
    category: 'Comunidad',
    reward: 5000,
    instructions: 'Únete a nuestro canal informativo en Telegram @GanaProOficial para recibir alertas de nuevas encuestas diarias y promociones especiales. Pega tu @alias de Telegram para validar tu entrada.'
  }
];

export const APPS_SCRIPT_TEMPLATE = `// CÓDIGO COMPLETO GOOGLE APPS SCRIPT
// HOJA 1 = TABLA "Usuarios" CON USUARIO ADMIN CREADO

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var usuariosSheet = setupUsuariosSheet(sheet);
  var data = usuariosSheet.getDataRange().getValues();
  return responseJSON({ 
    success: true, 
    message: "Conexión exitosa con GanaPro", 
    totalUsuarios: Math.max(0, data.length - 1) 
  });
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var usuariosSheet = setupUsuariosSheet(sheet);
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === "register") {
      var role = data.role || "Usuario";
      usuariosSheet.appendRow([new Date(), data.name, data.email, data.password, data.paymentMethod, 0, role]);
      return responseJSON({ success: true, message: "Usuario registrado en Hoja 1 (Usuarios)" });
    }

    if (action === "submitSurvey") {
      var surveysSheet = getOrCreateSheet(sheet, "Encuestas_Completadas", ["Fecha", "Email", "Encuesta", "Monto"]);
      surveysSheet.appendRow([new Date(), data.userEmail, data.surveyTitle, 2000]);
      return responseJSON({ success: true, reward: 2000 });
    }

    if (action === "submitTask") {
      var tasksSheet = getOrCreateSheet(sheet, "Tareas_Completadas", ["Fecha", "Email", "Tarea", "Prueba", "Monto"]);
      tasksSheet.appendRow([new Date(), data.userEmail, data.taskTitle, data.proof, 5000]);
      return responseJSON({ success: true, reward: 5000 });
    }

    if (action === "withdraw") {
      var withdrawSheet = getOrCreateSheet(sheet, "Solicitudes_Retiro", ["Fecha", "Email", "Monto", "Metodo", "Cuenta", "Estado"]);
      withdrawSheet.appendRow([new Date(), data.userEmail, data.amount, data.method, data.account, "Pendiente"]);
      return responseJSON({ success: true, message: "Solicitud registrada" });
    }

    return responseJSON({ success: false, message: "Acción no reconocida" });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function setupUsuariosSheet(ss) {
  var sheet = ss.getSheetByName("Usuarios");
  if (!sheet) {
    var firstSheet = ss.getSheets()[0];
    if (firstSheet.getName() === "Hoja 1" || firstSheet.getName() === "Sheet1") {
      firstSheet.setName("Usuarios");
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet("Usuarios");
    }
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Fecha", "Nombre", "Email", "Password", "MetodoPago", "Saldo", "Rol"]);
    sheet.appendRow([new Date(), "Administrador GanaPro", "admin@ganapro.com", "admin", "Nequi", 0, "Admin"]);
  }
  return sheet;
}

function getOrCreateSheet(ss, name, headers) {
  var s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (headers) s.appendRow(headers);
  }
  return s;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;
