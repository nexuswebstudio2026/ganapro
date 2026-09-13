import { Survey, Task, User, WithdrawalRequest } from '../types';

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: 'wd-req-001',
    userId: 'user-001',
    userName: 'Usuario Uno',
    userEmail: 'usuario1@ganapro.com',
    userPhone: '312 456 7890',
    amount: 40000,
    method: 'Llave Bre-B',
    account: '312 456 7890',
    date: '12/09/2026, 11:45',
    status: 'Pendiente'
  },
  {
    id: 'wd-req-002',
    userId: 'user-005',
    userName: 'Usuario Cinco',
    userEmail: 'usuario5@ganapro.com',
    userPhone: '310 987 6543',
    amount: 60000,
    method: 'Llave Bre-B',
    account: '310 987 6543',
    date: '12/09/2026, 12:15',
    status: 'Pendiente'
  },
  {
    id: 'wd-req-003',
    userId: 'user-004',
    userName: 'Usuario Cuatro',
    userEmail: 'usuario4@ganapro.com',
    userPhone: '314 555 1234',
    amount: 10000,
    method: 'Llave Bre-B',
    account: '314 555 1234',
    date: '12/09/2026, 12:40',
    status: 'Pendiente'
  },
  {
    id: 'wd-req-004',
    userId: 'user-sim-1',
    userName: 'Mateo Gómez',
    userEmail: 'mateo.gomez@gmail.com',
    userPhone: '315 444 8899',
    amount: 25000,
    method: 'Llave Bre-B',
    account: '315 444 8899',
    date: '11/09/2026, 17:30',
    status: 'Aprobado'
  }
];

export const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  name: 'Administrador GanaPro',
  email: 'admin@ganapro.com',
  password: 'admin',
  phone: '300 123 4567',
  paymentMethod: 'Llave Bre-B',
  balance: 35000,
  acumulado: 35000,
  role: 'admin',
  level: 4,
  referralCode: 'GP-ADMIN',
  referralCount: 6,
  referralEarnings: 6000,
  surveysCompleted: [1, 2],
  tasksCompleted: [101],
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
  ],
  nequiTransfersReceived: [
    {
      id: 'tr-rec-adm-1',
      senderId: 'user-005',
      senderName: 'Usuario Cinco',
      senderPhone: '310 987 6543',
      receiverId: 'admin-001',
      receiverName: 'Administrador GanaPro',
      receiverPhone: '300 123 4567',
      amount: 40000,
      targetLevel: 4,
      referenceCode: 'M741289',
      date: '12/09/2026, 12:10',
      status: 'Verificado'
    }
  ]
};

export const INITIAL_USERS: User[] = [
  DEFAULT_ADMIN,
  {
    id: 'user-001',
    name: 'Usuario Uno',
    email: 'usuario1@ganapro.com',
    password: '1234',
    phone: '312 456 7890',
    paymentMethod: 'Llave Bre-B',
    balance: 80000,
    acumulado: 80000, // $80.000 COP vinculados a Google Sheets
    role: 'usuario',
    level: 2,
    referralCode: 'GP-UNO101',
    referralCount: 3,
    referralEarnings: 3000,
    surveysCompleted: [1, 3],
    tasksCompleted: [101, 102],
    withdrawn: 0,
    nequiTransfersSent: [
      {
        id: 'tr-sent-u1',
        senderId: 'user-001',
        senderName: 'Usuario Uno',
        senderPhone: '312 456 7890',
        receiverId: 'user-002',
        receiverName: 'Líder Nivel 2',
        receiverPhone: '311 222 3344',
        amount: 10000,
        targetLevel: 2,
        referenceCode: 'M981023',
        date: '12/09/2026, 09:00',
        status: 'Verificado'
      }
    ],
    nequiTransfersReceived: [
      {
        id: 'tr-u1-rec-1',
        senderId: 'user-sim-1',
        senderName: 'Mateo Gómez',
        senderPhone: '315 444 8899',
        receiverId: 'user-001',
        receiverName: 'Usuario Uno',
        receiverPhone: '312 456 7890',
        amount: 10000,
        targetLevel: 2,
        referenceCode: 'M492019',
        date: '12/09/2026, 10:30',
        status: 'Verificado'
      },
      {
        id: 'tr-u1-rec-2',
        senderId: 'user-sim-2',
        senderName: 'Valentina Ríos',
        senderPhone: '317 665 4433',
        receiverId: 'user-001',
        receiverName: 'Usuario Uno',
        receiverPhone: '312 456 7890',
        amount: 10000,
        targetLevel: 2,
        referenceCode: 'M810293',
        date: '12/09/2026, 11:15',
        status: 'Verificado'
      }
    ],
    history: [
      {
        id: 'h-u1-01',
        type: 'Encuesta',
        description: 'Hábitos de Consumo Digital (Nivel 2)',
        amount: 5000,
        date: '12/09/2026, 10:15',
        status: 'Acreditado'
      },
      {
        id: 'h-u1-02',
        type: 'Tarea',
        description: 'Dejar Reseña en Google Maps (Nivel 2)',
        amount: 10000,
        date: '12/09/2026, 11:00',
        status: 'Acreditado'
      },
      {
        id: 'h-u1-03',
        type: 'Bono',
        description: 'Saldo acumulado sincronizado desde Google Sheets',
        amount: 65000,
        date: '12/09/2026, 11:30',
        status: 'Acreditado'
      }
    ]
  },
  {
    id: 'user-005',
    name: 'Usuario Cinco',
    email: 'usuario5@ganapro.com',
    password: '1234',
    phone: '310 987 6543',
    paymentMethod: 'Llave Bre-B',
    balance: 150000,
    acumulado: 150000, // $150.000 COP vinculados a Google Sheets
    role: 'usuario',
    level: 3,
    referralCode: 'GP-CIN505',
    referralCount: 5,
    referralEarnings: 5000,
    surveysCompleted: [1, 2, 4],
    tasksCompleted: [101, 103],
    withdrawn: 0,
    nequiTransfersSent: [
      {
        id: 'tr-sent-u5',
        senderId: 'user-005',
        senderName: 'Usuario Cinco',
        senderPhone: '310 987 6543',
        receiverId: 'admin-001',
        receiverName: 'Administrador GanaPro',
        receiverPhone: '300 123 4567',
        amount: 20000,
        targetLevel: 3,
        referenceCode: 'M551982',
        date: '12/09/2026, 08:30',
        status: 'Verificado'
      }
    ],
    nequiTransfersReceived: [
      {
        id: 'tr-u5-rec-1',
        senderId: 'user-001',
        senderName: 'Usuario Uno',
        senderPhone: '312 456 7890',
        receiverId: 'user-005',
        receiverName: 'Usuario Cinco',
        receiverPhone: '310 987 6543',
        amount: 20000,
        targetLevel: 3,
        referenceCode: 'M991823',
        date: '12/09/2026, 09:45',
        status: 'Verificado'
      },
      {
        id: 'tr-u5-rec-2',
        senderId: 'user-sim-3',
        senderName: 'Camilo Torres',
        senderPhone: '318 777 9900',
        receiverId: 'user-005',
        receiverName: 'Usuario Cinco',
        receiverPhone: '310 987 6543',
        amount: 20000,
        targetLevel: 3,
        referenceCode: 'M334455',
        date: '12/09/2026, 10:15',
        status: 'Verificado'
      }
    ],
    history: [
      {
        id: 'h-u5-01',
        type: 'Encuesta',
        description: 'Servicios Financieros Digitales (Nivel 3)',
        amount: 10000,
        date: '12/09/2026, 09:10',
        status: 'Acreditado'
      },
      {
        id: 'h-u5-02',
        type: 'Tarea',
        description: 'Probar App Móvil y Calificar (Nivel 3)',
        amount: 20000,
        date: '12/09/2026, 10:00',
        status: 'Acreditado'
      },
      {
        id: 'h-u5-03',
        type: 'Bono',
        description: 'Saldo acumulado sincronizado desde Google Sheets',
        amount: 120000,
        date: '12/09/2026, 10:45',
        status: 'Acreditado'
      }
    ]
  },
  {
    id: 'user-004',
    name: 'Usuario Cuatro',
    email: 'usuario4@ganapro.com',
    password: '1234',
    phone: '314 555 1234',
    paymentMethod: 'Llave Bre-B',
    balance: 10000,
    acumulado: 10000,
    role: 'usuario',
    level: 1, // Nivel 1 listo para ascender a Nivel 2 enviando $10.000 COP
    referralCode: 'GP-CUA404',
    referralCount: 1,
    referralEarnings: 1000,
    surveysCompleted: [],
    tasksCompleted: [],
    withdrawn: 0,
    history: [
      {
        id: 'h-u4-01',
        type: 'Bono',
        description: 'Bono inicial de registro en Nivel 1',
        amount: 10000,
        date: '12/09/2026, 08:00',
        status: 'Acreditado'
      }
    ]
  }
];

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
// HOJA 1 = TABLA "Usuarios" CON COLUMNAS: Número de Nequi, Saldo (Acumulado), Rol, Nivel, Acumulado

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var usuariosSheet = setupUsuariosSheet(sheet);
  var data = usuariosSheet.getDataRange().getValues();
  var headers = data[0];
  var users = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var u = {};
    for (var h = 0; h < headers.length; h++) {
      u[headers[h]] = row[h];
    }
    // Normalizar campos numéricos
    u.Saldo = Number(u.Saldo) || 0;
    u.Nivel = Number(u.Nivel) || 1;
    // En Saldo se muestra el saldo acumulado
    u.Acumulado = Number(u.Acumulado) || u.Saldo || 0;
    // Número o Llave de Nequi
    u["Número de Nequi"] = u["Número de Nequi"] || u["Numero de Nequi"] || u.NumeroNequi || u.Telefono || "";
    users.push(u);
  }
  
  var targetEmail = (e && e.parameter && e.parameter.email) ? e.parameter.email.toLowerCase() : null;
  var matchedUser = null;
  if (targetEmail) {
    for (var k = 0; k < users.length; k++) {
      if (users[k].Email && String(users[k].Email).toLowerCase() === targetEmail) {
        matchedUser = users[k];
        break;
      }
    }
  }

  return responseJSON({ 
    success: true, 
    message: "Conexión exitosa con GanaPro y lectura de usuarios", 
    totalUsuarios: users.length,
    users: users,
    user: matchedUser
  });
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var usuariosSheet = setupUsuariosSheet(sheet);
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // Registrar nuevo usuario con columna Número de Nequi y Saldo Acumulado
    if (action === "register") {
      var role = data.role || "Usuario";
      var level = Number(data.level) || 1;
      var acumulado = Number(data.acumulado !== undefined ? data.acumulado : data.balance) || 0;
      var numeroNequi = data.phone || data.numeroNequi || data["Número de Nequi"] || "";
      usuariosSheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.password,
        data.paymentMethod || "Llave Bre-B",
        numeroNequi,
        acumulado, // En Saldo se muestra el saldo acumulado
        role,
        level,
        acumulado
      ]);
      return responseJSON({ success: true, message: "Usuario registrado con columna Número de Nequi y Saldo Acumulado" });
    }

    // Actualizar Saldo (Acumulado), Nivel y Número de Nequi de un usuario
    if (action === "syncUser" || action === "updateAcumulado") {
      var userEmail = (data.userEmail || data.email || "").toLowerCase();
      var sheetData = usuariosSheet.getDataRange().getValues();
      var headers = sheetData[0];
      var foundRow = -1;
      
      for (var r = 1; r < sheetData.length; r++) {
        if (String(sheetData[r][2]).toLowerCase() === userEmail) {
          foundRow = r + 1; // 1-indexed
          break;
        }
      }

      // Mapear dinámicamente columnas por nombre
      var colNequi = -1;
      var colSaldo = -1;
      var colNivel = -1;
      var colAcumulado = -1;
      for (var c = 0; c < headers.length; c++) {
        var hn = String(headers[c]).trim().toLowerCase();
        if (hn.indexOf("nequi") > -1) colNequi = c + 1;
        if (hn === "saldo") colSaldo = c + 1;
        if (hn === "nivel") colNivel = c + 1;
        if (hn === "acumulado") colAcumulado = c + 1;
      }

      var userAcumulado = Number(data.acumulado !== undefined ? data.acumulado : (data.balance !== undefined ? data.balance : data.saldo)) || 0;
      var userNequi = data.phone || data.numeroNequi || data["Número de Nequi"] || "";

      if (foundRow > -1) {
        // En Saldo muestra el saldo acumulado de cada usuario
        if (colSaldo > -1) usuariosSheet.getRange(foundRow, colSaldo).setValue(userAcumulado);
        if (colAcumulado > -1) usuariosSheet.getRange(foundRow, colAcumulado).setValue(userAcumulado);
        if (colNivel > -1 && data.level !== undefined) usuariosSheet.getRange(foundRow, colNivel).setValue(Number(data.level));
        if (colNequi > -1 && userNequi) usuariosSheet.getRange(foundRow, colNequi).setValue(String(userNequi));
        return responseJSON({ success: true, message: "Usuario y Saldo Acumulado actualizados en Google Sheets" });
      } else {
        // Si no existe, agregarlo con la fila estructurada
        usuariosSheet.appendRow([
          new Date(),
          data.name || "Usuario",
          data.email,
          "***",
          data.paymentMethod || "Llave Bre-B",
          userNequi,
          userAcumulado, // En Saldo se muestra el saldo acumulado
          data.role || "Usuario",
          Number(data.level) || 1,
          userAcumulado
        ]);
        return responseJSON({ success: true, message: "Usuario creado en Google Sheets" });
      }
    }

    // Registrar encuesta completada y actualizar saldo acumulado
    if (action === "submitSurvey") {
      var surveysSheet = getOrCreateSheet(sheet, "Encuestas_Completadas", ["Fecha", "Email", "Encuesta", "Monto"]);
      var surveyReward = Number(data.reward) || 2000;
      surveysSheet.appendRow([new Date(), data.userEmail, data.surveyTitle, surveyReward]);
      updateUserSheetBalance(usuariosSheet, data.userEmail, surveyReward, true);
      return responseJSON({ success: true, reward: surveyReward });
    }

    // Registrar tarea completada y actualizar saldo acumulado
    if (action === "submitTask") {
      var tasksSheet = getOrCreateSheet(sheet, "Tareas_Completadas", ["Fecha", "Email", "Tarea", "Prueba", "Monto"]);
      var taskReward = Number(data.reward) || 5000;
      tasksSheet.appendRow([new Date(), data.userEmail, data.taskTitle, data.proof, taskReward]);
      updateUserSheetBalance(usuariosSheet, data.userEmail, taskReward, true);
      return responseJSON({ success: true, reward: taskReward });
    }

    // Registrar retiro (el Acumulado y Saldo acumulado se preservan como récord histórico)
    if (action === "withdraw") {
      var withdrawSheet = getOrCreateSheet(sheet, "Solicitudes_Retiro", ["Fecha", "Email", "Monto", "Metodo", "Cuenta", "Estado"]);
      withdrawSheet.appendRow([new Date(), data.userEmail, data.amount, data.method || "Llave Bre-B", data.account, "Pendiente"]);
      return responseJSON({ success: true, message: "Solicitud de retiro registrada en Google Sheets" });
    }

    return responseJSON({ success: false, message: "Acción no reconocida" });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function updateUserSheetBalance(sheet, email, amountChange, addToAcumulado) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colSaldo = -1;
  var colAcumulado = -1;
  for (var c = 0; c < headers.length; c++) {
    var hn = String(headers[c]).trim().toLowerCase();
    if (hn === "saldo") colSaldo = c + 1;
    if (hn === "acumulado") colAcumulado = c + 1;
  }
  if (colSaldo === -1) colSaldo = 7;
  if (colAcumulado === -1) colAcumulado = 10;

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][2]).toLowerCase() === String(email).toLowerCase()) {
      if (addToAcumulado && amountChange > 0) {
        var currentAcumulado = Number(data[r][colAcumulado - 1]) || Number(data[r][colSaldo - 1]) || 0;
        var newAcumulado = currentAcumulado + amountChange;
        sheet.getRange(r + 1, colAcumulado).setValue(newAcumulado);
        // En Saldo se muestra el saldo acumulado
        sheet.getRange(r + 1, colSaldo).setValue(newAcumulado);
      }
      break;
    }
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
    // Encabezados con columna "Número de Nequi" y columna "Saldo" mostrando el Saldo Acumulado
    sheet.appendRow(["Fecha", "Nombre", "Email", "Password", "MetodoPago", "Número de Nequi", "Saldo", "Rol", "Nivel", "Acumulado"]);
    // Admin precreado
    sheet.appendRow([new Date(), "Administrador GanaPro", "admin@ganapro.com", "admin", "Llave Bre-B", "300 123 4567", 35000, "Admin", 4, 35000]);
    // Usuario 1 (ejemplo $80.000 COP acumulado en Saldo y llave Nequi)
    sheet.appendRow([new Date(), "Usuario Uno", "usuario1@ganapro.com", "1234", "Llave Bre-B", "312 456 7890", 80000, "Usuario", 2, 80000]);
    // Usuario 5 (ejemplo $150.000 COP acumulado en Saldo y llave Nequi)
    sheet.appendRow([new Date(), "Usuario Cinco", "usuario5@ganapro.com", "1234", "Llave Bre-B", "310 987 6543", 150000, "Usuario", 3, 150000]);
    // Usuario 4
    sheet.appendRow([new Date(), "Usuario Cuatro", "usuario4@ganapro.com", "1234", "Llave Bre-B", "314 555 1234", 10000, "Usuario", 1, 10000]);
  } else {
    // Si la hoja ya existía pero le falta la columna "Número de Nequi", insertarla antes de Saldo
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var hasNequiCol = false;
    var saldoColIdx = -1;
    for (var h = 0; h < headers.length; h++) {
      var hname = String(headers[h]).toLowerCase();
      if (hname.indexOf("nequi") > -1) {
        hasNequiCol = true;
        break;
      }
      if (hname === "saldo") {
        saldoColIdx = h + 1;
      }
    }
    if (!hasNequiCol) {
      if (saldoColIdx > -1) {
        sheet.insertColumnBefore(saldoColIdx);
        sheet.getRange(1, saldoColIdx).setValue("Número de Nequi");
      } else {
        sheet.insertColumnAfter(sheet.getLastColumn());
        sheet.getRange(1, sheet.getLastColumn()).setValue("Número de Nequi");
      }
    }
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
