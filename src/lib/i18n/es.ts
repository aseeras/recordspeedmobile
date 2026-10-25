// Spanish for every t("…") in the app, keyed by the English text. Written in the formal "usted", matching the
// Spanish website. Anything missing here shows in English; `npm run i18n:check` lists what's missing.
// The State bar-number messages are translated by a rule in index.ts, not listed here.
export const ES: Record<string, string> = {
  // Common
  "Back": "Atrás",
  "Cancel": "Cancelar",
  "Close": "Cerrar",
  "Confirm": "Confirmar",
  "Details": "Detalles",
  "Next": "Siguiente",
  "None": "Ninguno",
  "Not now": "Ahora no",
  "Pending": "Pendiente",
  "Print": "Imprimir",
  "Read": "Leer",
  "Save": "Guardar",
  "Search": "Buscar",
  "Send": "Enviar",
  "Share": "Compartir",
  "Skip": "Omitir",
  "Summary": "Resumen",
  "Total": "Total",
  "From": "Desde",
  "To": "Hasta",
  "Language": "Idioma",
  "RecordSpeed": "RecordSpeed",
  "* Mandatory": "* Obligatorio",
  "Please try again.": "Inténtelo de nuevo.",
  "Please sign in again.": "Vuelva a iniciar sesión.",
  "Something went wrong: {error}": "Algo salió mal: {error}",
  "No results found": "No se encontraron resultados",
  "Nothing to see here!": "¡No hay nada aquí todavía!",
  "Nothing yet!": "¡Nada todavía!",
  "Pull down to refresh": "Deslice hacia abajo para actualizar",
  "Pull down to refresh in a minute.": "Deslice hacia abajo para actualizar en un minuto.",
  "We couldn't load this right now. Pull down to try again.": "No pudimos cargar esto ahora. Deslice hacia abajo para intentarlo de nuevo.",
  "Need help?": "¿Necesita ayuda?",
  "You can contact us at info@rec.speed.com": "Puede escribirnos a info@rec.speed.com",

  // Menu
  "Contacts": "Contactos",
  "Delete Account": "Eliminar cuenta",
  "Get records from MyChart": "Obtener expedientes de MyChart",
  "My Medical Requests": "Mis solicitudes médicas",
  "My Profile": "Mi perfil",
  "Shared With Me": "Compartido conmigo",
  "Shared with me": "Compartido conmigo",
  "Sign Out": "Cerrar sesión",
  "Who has seen my records": "Quién ha visto mis expedientes",
  "Ask RecordSpeed AI": "Preguntar a la IA de RecordSpeed",

  // Onboarding
  "Request your medical records": "Solicite sus expedientes médicos",
  "Pick your hospital or clinic and send a records request in minutes. No phone calls, forms or fax machines.":
    "Elija su hospital o clínica y envíe una solicitud de expedientes en minutos. Sin llamadas, formularios ni faxes.",
  "Track every request": "Siga cada solicitud",
  "See the status of each request at a glance and get notified as soon as your records are ready.":
    "Vea el estado de cada solicitud de un vistazo y reciba un aviso en cuanto sus expedientes estén listos.",
  "Share them securely": "Compártalos de forma segura",
  "Send your records to your attorney or anyone you trust, right from the app. You stay in control of who sees them.":
    "Envíe sus expedientes a su abogado o a quien usted confíe, desde la aplicación. Usted decide quién los ve.",
  "Get started": "Comenzar",
  "Request, track and share your medical records in one place.":
    "Solicite, siga y comparta sus expedientes médicos en un solo lugar.",
  "Sign in or sign up to start your request": "Inicie sesión o regístrese para empezar su solicitud",

  // Sign in / sign up
  "Hi there,": "Hola,",
  "let's sign in!": "¡iniciemos sesión!",
  "You can use these": "Puede usar estas opciones",
  "You can use this": "Puede usar esta opción",
  "Or use your email and password": "O use su correo electrónico y contraseña",
  "Or create an account": "O cree una cuenta",
  "Email": "Correo electrónico",
  "Password": "Contraseña",
  "Password should have at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
  "Log In": "Iniciar sesión",
  "Sign In": "Iniciar sesión",
  "Sign Up": "Registrarse",
  "Create account": "Crear cuenta",
  "Already have an account?": "¿Ya tiene una cuenta?",
  "Don't have an account yet?": "¿Aún no tiene una cuenta?",
  "Perfect,": "Perfecto,",
  "Let's sign up!": "¡Registrémonos!",
  "How are you": "¿Cómo piensa",
  "planning to use": "usar",
  "RecordSpeed?": "RecordSpeed?",
  "Personal Use": "Uso personal",
  "Attorney": "Abogado",
  "Insurance Company": "Compañía de seguros",
  "Welcome back {name}": "Bienvenido de nuevo, {name}",
  "Welcome {name}": "Bienvenido, {name}",
  "Welcome,": "Bienvenido,",
  "Sign-in failed": "No se pudo iniciar sesión",
  "Signed in, but the server did not return a session token.":
    "Inició sesión, pero el servidor no devolvió un token de sesión.",
  "You were signed out because you hadn't used the app for a while. Please sign in again.":
    "Se cerró su sesión porque no usó la aplicación durante un tiempo. Vuelva a iniciar sesión.",
  "Your session has ended. Please sign in again.": "Su sesión terminó. Vuelva a iniciar sesión.",

  // Two-step sign-in
  "Set up two-step sign-in": "Configure el inicio de sesión en dos pasos",
  "To protect your clients' records, signing in needs a code from an authenticator app as well as your password.":
    "Para proteger los expedientes de sus clientes, para iniciar sesión se necesita un código de una aplicación de autenticación además de su contraseña.",
  "1. Install an authenticator app if you don't have one, such as Google Authenticator, Microsoft Authenticator or 1Password.":
    "1. Instale una aplicación de autenticación si no tiene una, como Google Authenticator, Microsoft Authenticator o 1Password.",
  "2. Add RecordSpeed to it:": "2. Agregue RecordSpeed a la aplicación:",
  "3. Enter the 6-digit code the app shows for RecordSpeed:":
    "3. Ingrese el código de 6 dígitos que la aplicación muestra para RecordSpeed:",
  "Add to authenticator app": "Agregar a la aplicación de autenticación",
  "Or enter this key in the app:": "O ingrese esta clave en la aplicación:",
  "Copy key": "Copiar clave",
  "Key copied": "Clave copiada",
  "No authenticator app found": "No se encontró una aplicación de autenticación",
  "Install one from the App Store, or copy the key into it.":
    "Instale una desde la App Store o copie la clave en ella.",
  "Enter your code": "Ingrese su código",
  "Open your authenticator app and enter the 6-digit code for RecordSpeed.":
    "Abra su aplicación de autenticación e ingrese el código de 6 dígitos de RecordSpeed.",
  "That code isn't right.": "Ese código no es correcto.",
  "Lost your phone? Enter one of the recovery codes you saved when you set this up. If you don't have them, email support@recordspeed.com.":
    "¿Perdió su teléfono? Ingrese uno de los códigos de recuperación que guardó al configurar esto. Si no los tiene, escriba a support@recordspeed.com.",
  "Two-step sign-in is on": "El inicio de sesión en dos pasos está activado",
  "Save these recovery codes somewhere safe, like a password manager. If you lose your phone, each code lets you sign in once. They won't be shown again.":
    "Guarde estos códigos de recuperación en un lugar seguro, como un administrador de contraseñas. Si pierde su teléfono, cada código le permite iniciar sesión una vez. No se volverán a mostrar.",
  "Copy codes": "Copiar códigos",
  "Codes copied": "Códigos copiados",
  "Save or share codes": "Guardar o compartir códigos",
  "I've saved them, continue": "Ya los guardé, continuar",

  // Patient home and requests
  "You don't have any medical requests yet.": "Aún no tiene solicitudes médicas.",
  "Tap the": "Toque el botón",
  "button below to start your first one.": "de abajo para empezar la primera.",
  "New Medical Request": "Nueva solicitud médica",
  "Submit your Medical Request": "Envíe su solicitud médica",
  "Where do you receive medical care?": "¿Dónde recibe atención médica?",
  "Your hospital or clinic": "Su hospital o clínica",
  "Medical Institution": "Institución médica",
  "Medical institution": "Institución médica",
  "My Medical Institution": "Mi institución médica",
  "Choose your hospital or clinic first.": "Primero elija su hospital o clínica.",
  "Period of Request": "Período de la solicitud",
  "Select the historical time frame for which you would like to have access":
    "Seleccione el período de tiempo al que desea tener acceso",
  "Select Date": "Seleccionar fecha",
  "Send Request": "Enviar solicitud",
  "Your Medical Record Request was submitted successfully.":
    "Su solicitud de expedientes médicos se envió correctamente.",
  "The request couldn't be created.": "No se pudo crear la solicitud.",
  "Request #{id}": "Solicitud n.º {id}",
  "Certified By": "Certificado por",
  "Imported from MyChart": "Importado de MyChart",
  "Shared By": "Compartido por",
  "Pull down the screen to refresh your shared medical requests.":
    "Deslice la pantalla hacia abajo para actualizar las solicitudes médicas compartidas con usted.",
  "Share Your Medical Records": "Comparta sus expedientes médicos",
  "Record Speed Handle": "Usuario de Record Speed",
  "Copied Record Speed Handle to the clipboard!": "¡Usuario de Record Speed copiado al portapapeles!",

  // MyChart
  "Get these records now from your MyChart account": "Obtenga estos expedientes ahora desde su cuenta de MyChart",
  "Sign in to MyChart to bring in your records in minutes.":
    "Inicie sesión en MyChart para traer sus expedientes en minutos.",
  "Sign in to your MyChart account and RecordSpeed brings in your notes, test results, medications, allergies and immunizations from the last {years} years. Your MyChart password stays with MyChart.":
    "Inicie sesión en su cuenta de MyChart y RecordSpeed traerá sus notas, resultados de pruebas, medicamentos, alergias y vacunas de los últimos {years} años. Su contraseña de MyChart se queda en MyChart.",
  "MyChart connected": "MyChart conectado",
  "Importing your records…": "Importando sus expedientes…",
  "Your records will appear shortly.": "Sus expedientes aparecerán en breve.",
  "Your MyChart records are here": "Sus expedientes de MyChart ya están aquí",
  "Still importing from MyChart": "Todavía importando desde MyChart",
  "Couldn't import from MyChart": "No se pudo importar desde MyChart",
  "Couldn't open MyChart": "No se pudo abrir MyChart",
  "Couldn't start MyChart": "No se pudo iniciar MyChart",
  "MyChart didn't connect": "MyChart no se conectó",
  "MyChart isn't available right now.": "MyChart no está disponible en este momento.",
  "Please connect MyChart again.": "Vuelva a conectar MyChart.",
  "That took too long": "Tardó demasiado",

  // Who has seen my records
  "Everyone who opened, downloaded or worked on your records in the past year, and everyone you shared them with.":
    "Todas las personas que abrieron, descargaron o trabajaron con sus expedientes en el último año, y todas las personas con quienes los compartió.",
  "Nobody else has seen your records yet.": "Nadie más ha visto sus expedientes todavía.",
  "Couldn't load who has seen your records.": "No se pudo cargar quién ha visto sus expedientes.",
  "If something here looks wrong, contact us at contact@recordspeed.com.":
    "Si algo aquí parece incorrecto, escríbanos a contact@recordspeed.com.",

  // Profile
  "Personal Information": "Información personal",
  "Edit Profile Info": "Editar información del perfil",
  "First Name": "Nombre",
  "Middle Name": "Segundo nombre",
  "Last Name": "Apellido",
  "Full Name": "Nombre completo",
  "Suffix": "Sufijo",
  "Second": "II",
  "Third": "III",
  "Fourth": "IV",
  "First Name is required": "El nombre es obligatorio",
  "Last Name is required": "El apellido es obligatorio",
  "Date of Birth": "Fecha de nacimiento",
  "DOB": "F. de nac.",
  "DD": "DD",
  "MM": "MM",
  "YYYY": "AAAA",
  "Day is invalid": "El día no es válido",
  "Month is invalid": "El mes no es válido",
  "Year is invalid": "El año no es válido",
  "Social Security Number": "Número de Seguro Social",
  "Area number is invalid": "El número de área no es válido",
  "Group number is invalid": "El número de grupo no es válido",
  "Serial number is invalid": "El número de serie no es válido",
  "Your information has been updated successfully.": "Su información se actualizó correctamente.",
  "Something went wrong updating your profile.": "Algo salió mal al actualizar su perfil.",
  "Looking for assistance": "Busco asistencia",
  "Attorney at your disposal": "Abogado a su disposición",
  "Attorneys at your disposal": "Abogados a su disposición",
  "Record Speed will put you in contact with high-rated, licensed profesionals":
    "Record Speed le pondrá en contacto con profesionales con licencia y bien valorados",
  "for free, in no time.": "gratis y en poco tiempo.",
  "Here you'll be able to request attorneys to get in touch with you.":
    "Aquí podrá pedir que los abogados se pongan en contacto con usted.",
  "Just click on the toggle at the bottom of the screen to be added onto an public “Looking for Assistance” list within the app.":
    "Active el interruptor en la parte inferior de la pantalla para aparecer en la lista pública “Busco asistencia” de la aplicación.",
  "A little card holding your Record Speed Handle and a button for attorneys to reach out at you will be added to the list.":
    "Se agregará a la lista una pequeña tarjeta con su usuario de Record Speed y un botón para que los abogados se comuniquen con usted.",
  "At anytime you wish, turning the toggle off will remove your card from the list.":
    "Cuando lo desee, al desactivar el interruptor su tarjeta se quitará de la lista.",
  "Before your card is shown, we'll tell you exactly what attorneys can see and ask you to agree.":
    "Antes de mostrar su tarjeta, le explicaremos exactamente lo que los abogados pueden ver y le pediremos su consentimiento.",
  "You can also add a short description about your case. This will help attorneys better understand how they might assiste you.":
    "También puede agregar una breve descripción de su caso. Así los abogados entenderán mejor cómo pueden ayudarle.",
  "Once you engage with an attorney, all fee arrangements are your responsibility. Record Speed does not charge for any transactions between you and the third party.":
    "Una vez que contrate a un abogado, todos los acuerdos de honorarios son su responsabilidad. Record Speed no cobra por ninguna transacción entre usted y el tercero.",
  "Go ahead, give it a try!": "¡Adelante, pruébelo!",
  "My card is public": "Mi tarjeta es pública",
  "My card is not public": "Mi tarjeta no es pública",
  "Your card is hidden from attorneys until you agree to how it's shown. Turn the switch on to read and agree.":
    "Su tarjeta está oculta para los abogados hasta que acepte cómo se muestra. Active el interruptor para leer y aceptar.",
  "You agreed on {date}.": "Usted aceptó el {date}.",
  "Show my card to attorneys": "Mostrar mi tarjeta a los abogados",
  "I agree, show my card": "Acepto, mostrar mi tarjeta",
  "A short description of your case": "Una breve descripción de su caso",
  "Add a brief description of your case to help professionals better understand your situation.":
    "Agregue una breve descripción de su caso para que los profesionales entiendan mejor su situación.",
  "Edit Description": "Editar descripción",
  "Your case description has been updated successfully.": "La descripción de su caso se actualizó correctamente.",

  // Consent (src/lib/patient/consent.ts): the same agreement as the English, version 2026-10.
  "Show my card to attorneys?": "¿Mostrar mi tarjeta a los abogados?",
  "Attorneys who use RecordSpeed will see your name, your RecordSpeed handle, the hospital or clinic you chose, and your case description.":
    "Los abogados que usan RecordSpeed verán su nombre, su usuario de RecordSpeed, el hospital o la clínica que eligió y la descripción de su caso.",
  "They won't see your medical records, documents, Social Security number or date of birth.":
    "No verán sus expedientes médicos, documentos, número de Seguro Social ni fecha de nacimiento.",
  "Attorneys can send you their contact details through the app. RecordSpeed doesn't choose, endorse or pay attorneys, and any arrangement with one is between you and them.":
    "Los abogados pueden enviarle sus datos de contacto a través de la aplicación. RecordSpeed no elige, recomienda ni paga a los abogados, y cualquier acuerdo con uno de ellos es entre usted y el abogado.",
  "Your case description is visible to every attorney on RecordSpeed, so leave out anything you don't want them to read.":
    "Todos los abogados de RecordSpeed pueden ver la descripción de su caso, así que no incluya nada que no quiera que lean.",
  "You can turn your card off at any time here in My Profile. It leaves the list right away; attorneys who already contacted you keep what they sent.":
    "Puede desactivar su tarjeta en cualquier momento aquí en Mi perfil. Sale de la lista de inmediato; los abogados que ya le contactaron conservan lo que enviaron.",
  "We keep a record of when you agreed and to which version of this text.":
    "Guardamos un registro de cuándo aceptó y de qué versión de este texto.",

  // Contacts from attorneys
  "Hello {name},": "Hola, {name}:",
  "Please find my contact information here.": "Aquí tiene mi información de contacto.",
  "Get in touch": "Contactar",
  "Your contact information was sent to {name}.": "Su información de contacto se envió a {name}.",
  "We couldn't send your contact information to {name}. Please try again later.":
    "No pudimos enviar su información de contacto a {name}. Inténtelo de nuevo más tarde.",

  // Attorney
  "Professional Service Email": "Correo electrónico profesional",
  "Professional Service Phone": "Teléfono profesional",
  "A professional service phone is required": "El teléfono profesional es obligatorio",
  "State Bar Number": "Número de colegiado",
  "A state bar number is required": "El número de colegiado es obligatorio",
  "Select a state": "Seleccione un estado",
  "SBN:": "N.º de colegiado:",
  "Website": "Sitio web",
  "My Prospects List": "Mi lista de posibles clientes",
  "Prospects are waiting!": "¡Hay posibles clientes esperando!",
  "A prospect is waiting!": "¡Hay un posible cliente esperando!",
  "Be the first to assist them with professional advice!": "¡Sea el primero en asesorarles profesionalmente!",
  "Record Speed brings clients in": "Record Speed le acerca clientes que están en",
  "active search": "búsqueda activa",
  "for leagal counselling right at your phone.": "de asesoría legal, directamente en su teléfono.",
  "Record Speed brings clients in active search for leagal counselling right at your phone.":
    "Record Speed le acerca clientes que buscan activamente asesoría legal, directamente en su teléfono.",
  "Subscribe": "Suscríbase",
  "Subscribe!": "¡Suscríbase!",
  "to access this feature.": "para acceder a esta función.",
  "Select your plan": "Seleccione su plan",
  "Current Plan": "Plan actual",
  "Edit My Plan": "Editar mi plan",
  "Edit My Plan (Free)": "Editar mi plan (Gratis)",
  "Edit My Plan ({plan})": "Editar mi plan ({plan})",
  "+ Everything in Basic": "+ Todo lo del plan Basic",
  "Monthly": "Mensual",
  "Yeraly": "Anual",
  "Checkout": "Pagar",
  "Cancel Subscription": "Cancelar suscripción",
  "Error creating the subscription": "Error al crear la suscripción",
  "Payment sheet failed": "Falló la hoja de pago",
  "Payment sheet unknown": "Estado de la hoja de pago desconocido",
  "Your order is confirmed!": "¡Su pedido está confirmado!",
  "Unlock Read Feature for:": "Desbloquear la función de lectura para:",
  "{name}'s records from {from} to {to}": "Expedientes de {name} del {from} al {to}",
  "Cost per page:": "Costo por página:",
  "Document Pages:": "Páginas del documento:",

  // Delete account
  "This can't be undone": "Esto no se puede deshacer",
  "Deleting your account permanently removes {what}. Any subscription is cancelled.":
    "Al eliminar su cuenta se borran de forma permanente {what}. Cualquier suscripción se cancela.",
  "your profile, your medical record requests and documents, what you've shared, and your MyChart connections":
    "su perfil, sus solicitudes y documentos médicos, lo que ha compartido y sus conexiones con MyChart",
  "your profile, the records shared with you, your contacts and your purchases":
    "su perfil, los expedientes compartidos con usted, sus contactos y sus compras",
  "Copies that people have already downloaded aren't affected.":
    "Las copias que otras personas ya descargaron no se ven afectadas.",
  "Type {word} to confirm": "Escriba {word} para confirmar",
  "Account not deleted": "No se eliminó la cuenta",
  "Your account has been deleted.": "Su cuenta se eliminó.",
  "Your account couldn't be deleted. Please try again.": "No se pudo eliminar su cuenta. Inténtelo de nuevo.",

  // Assistant
  "RecordSpeed assistant": "Asistente de RecordSpeed",
  "Ask the RecordSpeed assistant": "Preguntar al asistente de RecordSpeed",
  "AI · can look up your account, read-only": "IA · puede consultar su cuenta, solo lectura",
  "Hi! I can explain how RecordSpeed works and look things up in your account. What can I help with?":
    "¡Hola! Puedo explicarle cómo funciona RecordSpeed y consultar datos de su cuenta. ¿En qué puedo ayudarle?",
  "AI can make mistakes. It can't make changes to your account.":
    "La IA puede cometer errores. No puede hacer cambios en su cuenta.",
  "Ask a question…": "Haga una pregunta…",
  "Your question": "Su pregunta",
  "Thinking…": "Pensando…",
  "Talk": "Hablar",
  "Talk to us": "Hable con nosotros",
  "🎙️ Talk": "🎙️ Hablar",
  "Ask out loud. What you say is turned into text on this iPhone.": "Pregunte en voz alta. Lo que diga se convierte en texto en este iPhone.",
  "Getting ready…": "Preparando…",
  "Listening…": "Escuchando…",
  "Speaking…": "Hablando…",
  "Microphone off": "Micrófono apagado",
  "Mute": "Silenciar",
  "Unmute": "Activar micrófono",
  "End": "Terminar",
  "Talking needs the microphone. You can turn it on in Settings, or type your question instead.": "Para hablar se necesita el micrófono. Puede activarlo en Configuración, o escribir su pregunta.",
  "Talking isn't available on this iPhone right now. You can type your question instead.": "No se puede hablar en este iPhone en este momento. Puede escribir su pregunta.",
  "Read replies aloud": "Leer las respuestas en voz alta",
  "Not read aloud: it includes details from your account.": "No se lee en voz alta: incluye datos de su cuenta.",
  "💬 Ask": "💬 Preguntar",
  "The assistant is unavailable right now.": "El asistente no está disponible en este momento.",

  // Notifications
  "Must use physical device for push notifications":
    "Las notificaciones push requieren un dispositivo físico",
  "Permission not granted to get push token for push notification!":
    "¡No se otorgó permiso para las notificaciones push!",
  "Project ID not found": "No se encontró el ID del proyecto",
};
