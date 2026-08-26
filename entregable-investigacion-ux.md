# Entregable de Investigación de UX y Análisis Competitivo

## 💻 1. Estado de Configuración del Notebook

El entorno de trabajo se encuentra configurado superando con creces los requerimientos establecidos:

- **Fuentes de campo:** Se encuentran cargadas **11 fuentes** en total (10 archivos de audio con sus respectivas transcripciones de entrevistas de campo que cubren estadios, eventos, parqueaderos y transportes, más el documento estratégico _Informe de Oportunidades.docx_). Esto supera el requisito mínimo de 8 entrevistas de campo.
- **Organización del proyecto:** Los hallazgos analizados a continuación se encuentran indexados de manera estructurada y cruzados analíticamente en la base del proyecto.

---

## 🔍 2. Resumen de Hallazgos: Los 5 Problemas UX Más Frecuentes

A partir del análisis cualitativo y cuantitativo de las transcripciones de las entrevistas, se identificaron, ordenaron de mayor a menor frecuencia las principales frustraciones de los usuarios y se plantearon las correspondientes oportunidades de mejora:

### Problema 1: Filas extensas, demoras operativas y cuellos de botella

- **Frecuencia:** Mencionado por **4 entrevistados** (Pamela, Raúl Fuente, Entrevistado de Estadios 2, e indirectamente en estadios 1).
- **Descripción:** Los usuarios experimentan un alto nivel de fricción por la ineficiencia del personal, la desorganización de los accesos físicos y la lentitud para emitir u obtener tickets.
- **Citas Textuales de Respaldo:**
  - **Pamela (Estadios - Pamela):** _"Lo que normalmente se hace es comprar los tickets en las ventanillas normal. El único problema es que mayormente se hace una fila superlarga y eso en parte es un problema."_
  - **Raúl Fuente (Estacionamientos):** _"A veces hay fila porque la persona de adelante tarda en sacar el ticket... sería bueno que hubiera menos pasos para salir del estacionamiento. Cuando hay mucha gente se forman filas y todo el proceso se vuelve muy lento."_
- **💡 Recomendación / Oportunidad de Mejora:** Implementar automatizaciones de acceso basadas en software, como el reconocimiento de patentes/placas (LPR) para eliminar por completo la necesidad de detenerse en tótems físicos de estacionamientos, e integrar flujos de auto-validación rápidos que reduzcan el tiempo de atención por persona a menos de 1 segundo en molinetes y accesos.

### Problema 2: Temor al fraude, falsificación y clonación de boletos digitales

- **Frecuencia:** Mencionado por **4 entrevistados** (Pamela, Ángela Bravo y Julián Lopera).
- **Descripción:** Existe una profunda desconfianza en la seguridad de los soportes electrónicos estáticos (QRs o PDFs), alimentada por el miedo a que el boleto no sea original, sea robado o falle en el control de acceso.
- **Citas Textuales de Respaldo:**
  - **Pamela (Estadios - Pamela):** _"Lo que más me da miedo en este momento es de que o la entrada sea falsa o el QR de plano no funciona... al momento de ingresar me digan que no está constando el número de código o el número de compra del boleto."_
  - **Ángela Bravo (Transporte):** _"¿Qué me genera desconfianza en que no sea real? Que no sea real el boleto, que sea falso."_
  - **Julián Lopera (Transporte):** _"Eh, tal vez que se pueda hackear, que haya otra persona que pueda sacar mi mismo boleto y se vaya llevando asiento."_
- **💡 Recomendación / Oportunidad de Mejora:** Diseñar un sistema de boletos digitales con códigos QR dinámicos y rotativos (HMAC-SHA256) que refresquen su carga criptográfica cada 30 segundos. Esto evita la reventa informal mediante capturas de pantalla, garantizando la autenticidad e impidiendo la clonación.

### Problema 3: Fricciones físicas y operativos de tickets de papel (Pérdida, daño y demoras)

- **Frecuencia:** Mencionado por **3 entrevistados** (Luis Borja, Raúl Fuente y Pamela).
- **Descripción:** El soporte analógico (boletos impresos o tickets térmicos de estacionamiento) representa un dolor logístico grave ante daños accidentales, mala calidad de impresión o extravíos que conllevan procesos manuales de penalización o verificación de datos.
- **Citas Textuales de Respaldo:**
  - **Luis Borja (Estacionamientos):** _"Sí, en una ocasión la máquina no imprimió bien el ticket y después tuve problemas para que lo leyera al salir... Sí, una vez perdí el ticket y tuve que ir a atención al cliente para que verificaran mi ingreso antes de poder salir."_
  - **Raúl Fuente (Estacionamientos):** _"La verdad casi nunca. Solo una vez el ticket salió arrugado y pensé que no iba a servir, pero al final sí funcionó... olvidé dónde lo había guardado dentro del carro y me tomó varios minutos encontrarlo para poder salir."_
- **💡 Recomendación / Oportunidad de Mejora:** Migrar todo el flujo transaccional y de acceso a un entorno digital offline nativo dentro del dispositivo del usuario (almacenado de forma segura en local storage cifrado), eliminando los consumibles de papel y permitiendo una recuperación inmediata del ticket desde la cuenta del usuario en caso de fallos del dispositivo.

### Problema 4: Ansiedad tecnológica por conectividad inestable, datos y batería baja

- **Frecuencia:** Mencionado por **3 entrevistados** (Entrevistado de Estadios 2, Ángela Bravo y Julián Lopera).
- **Descripción:** La dependencia absoluta de una red celular óptima en recintos masivos o carreteras abiertas genera pánico. Los usuarios temen verse imposibilitados de validar sus pases.
- **Citas Textuales de Respaldo:**
  - **Entrevistado de Estadios 2:** _"Me da pánico quedarme sin señal o sin datos justo ahí o que el brillo de la pantalla no deje leer el QR. También me molesta mucho cuando el lector falla y empieza a juntarse la gente atrás presionando."_
  - **Ángela Bravo (Transporte):** _"Si por alguna razón te quedas sin batería o sin datos... Sería que me vieran por medio de mi cédula de identidad, ¿sí? Que estoy constando en el en el como pasajera."_
- **💡 Recomendación / Oportunidad de Mejora:** Desarrollar soporte PWA robusto con Service Workers para garantizar el acceso al boleto en modo 100% offline. Asimismo, incorporar un widget en la pantalla de bloqueo para un acceso rápido sin necesidad de abrir la app y, como contingencia extrema de "batería muerta", proveer un manifiesto de pasajeros offline en los terminales de los conductores/operadores que permita la búsqueda y validación a través del documento nacional de identidad (cédula).

### Problema 5: Inestabilidad transaccional, caídas de plataforma y errores de app

- **Frecuencia:** Mencionado por **2 entrevistados** (Entrevistado de Eventos / Conciertos y Entrevistado de Ticket Shot).
- **Descripción:** Los picos de demanda durante preventas tumban los servidores de las ticketeras clásicas, y las apps de baja calidad de optimización (como Ticket Shot) se cierran solas o bloquean los inicios de sesión.
- **Citas Textuales de Respaldo:**
  - **Entrevistado de Eventos (20260807_114306):** _"Eh, sí, una vez la página, la verdad, se cayó por alta demanda y no pude comprar el ticket."_
  - **Entrevistado de Ticket Shot (20260807_114526):** _"Mala, porque la aplicación se cerraba y prácticamente no funciona bien... No podía iniciar sesión y a veces no cargaban los eventos de los conciertos... fallaba antes de poder pagar."_
- **💡 Recomendación / Oportunidad de Mejora:** Diseñar una arquitectura del lado del servidor elástica y basada en microservicios, optimizada para escalar automáticamente ante repuntes masivos de tráfico. Por el lado del cliente, implementar estados de carga interactivos y flujos optimistas que guarden las peticiones pendientes para reintentarse en segundo plano en caso de inestabilidad de red.

---

## 📊 3. Análisis de Brechas: Dolores del Usuario vs. Debilidades de la Competencia

### Introducción y Contexto

Para generar disrupción en el mercado de ticketing y accesos, no basta con automatizar los procesos tradicionales; es fundamental alinear directamente los dolores de la experiencia de usuario (UX) con las ineficiencias y fallas tecnológicas de los operadores incumbentes. El análisis de las brechas comerciales e infraestructurales revela que los líderes actuales del sector sacrifican la tranquilidad y accesibilidad del usuario para priorizar sus márgenes operativos o evitar inversiones en tecnología moderna.

A continuación, se mapea esta discrepancia a través de un cuadro comparativo del sector y su posterior desglose analítico.

### Cuadro Competitivo de la Industria

| Competidor Analizado                                                             | Problema Principal que Resuelve                                            | Modelo de Precio / Tarifas                                                                                                    | 💪 Fortalezas de Mercado                                                                                                  | ⚠️ Debilidades y Fallas Críticas (Reseñas Reales)                                                                                                                                                                                                      |
| :------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Ticketeras Clásicas de Conciertos/Estadios** _(Líderes de Eventos Masivos)_ | Compra centralizada de boletos digitales y mapas interactivos de asientos. | **Tarifas Opacas:** Cargos por servicio (Service Fee) muy altos (10% al 20% del boleto) agregados al final de la transacción. | _ Alta madurez digital comercial.<br>_ Monopolio de exclusividad en grandes conciertos.<br>\* Catálogo amplio de eventos. | _ **Vulnerabilidad al Fraude:** Uso de QR estáticos clonables fácilmente.<br>_ **Inestabilidad Transaccional:** Caídas sistémicas en preventas masivas por alta demanda.<br>\* **Precios Engañosos:** Falta de desglose de cargos desde el inicio.     |
| **2. Sistemas Tradicionales de Parqueadero** _(Sipark / Proveedores Físicos)_    | Acceso y control vehicular mediante barreras físicas y cobros manuales.    | **Basado en OPEX de Hardware:** Tarifas por hora/fracción procesadas en tótems automáticos que requieren efectivo o tarjetas. | _ Estructuras físicas robustas ya instaladas.<br>_ Control físico total de los espacios de parqueo.                       | _ **Dolor de Ticket Físico:** El papel es propenso a daño, pérdida u olvidos.<br>_ **Flujo Lento:** Cuellos de botella graves en el ingreso por la toma manual del ticket.<br>\* **Fugas Financieras:** Fraude interno por manejo de efectivo.         |
| **3. Cooperativas de Buses Tradicionales** _(Ticketing de Transporte Terrestre)_ | Venta presencial y digital precaria para rutas interprovinciales.          | **Tarifa Fija Estatal:** Comisión de servicio nula o muy baja para el pasajero, pero sin infraestructura tecnológica.         | _ Cobertura geográfica nacional exhaustiva.<br>_ Monopolio de rutas terrestres interprovinciales.                         | _ **Precaria Digitalización:** Sin trazabilidad GPS, obligando a paradas informales.<br>_ **Nulo Soporte de Cancelación:** Trámites presenciales burocráticos para cambios.<br>\* **Inseguridad:** El pasajero teme el hackeo de datos y boleto falso. |

### Análisis de Brechas por Sector

- **Estacionamientos:** La brecha radica en la dependencia de la competencia de hardware físico y consumibles de papel (tótems expendedores, barreras analógicas), lo que dispara su OPEX y causa el calvario UX del usuario (tickets extraviados, filas para pagar en efectivo, tótems atascados). La propuesta de valor de nuestra Super-App radica en suprimir por completo los tótems mediante cámaras LPR (lectura automática de matrículas) conectadas a una pasarela de pago invisible e integrada.
- **Conciertos y Eventos:** Mientras la competencia utiliza sistemas rígidos propensos a caídas por demanda y formatos estáticos vulnerables a la clonación y reventa fraudulenta, el usuario expresa un pánico constante a ser estafado con entradas duplicadas. Nuestra propuesta introduce un motor de generación de QR dinámicos en un backend con auto-escalado horizontal, logrando seguridad absoluta y estabilidad sin fisuras.
- **Estadios:** Las plataformas heredadas se vuelven "inertes" tras cruzar el molinete debido a la saturación de datos móviles en eventos masivos. Los usuarios experimentan gran frustración al no poder ver sus ubicaciones o comprar alimentos. La Super-App resuelve esto mediante caché PWA offline local y un ecosistema de compras dentro del estadio con entrega directa al asiento (In-Seat Delivery) operado por transacciones asíncronas seguras.
- **Buses Interprovinciales:** Existe una desconexión crítica entre la precaria digitalización de las cooperativas y la necesidad de seguridad física de los viajeros. La brecha se cierra implementando un portal interactivo con GPS en tiempo real compartido para familiares y un flujo de contingencia que permita abordar el bus solo presentando la cédula nacional de identidad cuando el celular del pasajero está descargado.

---

## 🧠 4. Análisis de Discrepancias y Contrastes de Opinión: La Voz del Usuario en Tensión

### Introducción

Para diseñar una experiencia de usuario robusta y flexible, es crucial comprender que los usuarios no se comportan como un bloque homogéneo. Existen discrepancias significativas y tensiones de comportamiento entre las expectativas de los usuarios, sus temores situacionales y los contextos bajo los cuales interactúan con las tecnologías de acceso. El análisis cualitativo de las entrevistas reveló 5 contradicciones clave que guían el desarrollo de flujos híbridos en nuestra Super-App.

### Contradicciones Clave en la Experiencia de Usuario

<<<<<<< HEAD

#### A. Control e Independencia vs. Pánico Operativo

- **La Tensión:** Algunos usuarios valoran la total independencia de llevar su ticket digital en el móvil y gestionar su ingreso por sí mismos de forma rápida. Sin embargo, este deseo se estrella directamente con el "pánico tecnológico" de quedarse sin señal, que la batería se agote justo antes de entrar, o que el brillo de la pantalla impida la lectura del lector físico, generando colas y presión de la gente detrás.
- **Evidencia:** Mientras Raúl Fuente prefiere procesos automatizados rápidos ("menos pasos para salir"), Ángela Bravo y los entrevistados de estadios verbalizan un miedo paralizante a quedar atrapados en el acceso por causas ajenas a ellos.

#### B. Coordinación Física Colectiva vs. Transferencia Autónoma Digital

- **La Tensión:** En eventos grupales, existe la tradición de nombrar a un "líder de grupo" que compra y custodia todas las entradas, obligando a los acompañantes a reunirse físicamente afuera del recinto antes de ingresar. Por otro lado, surge la frustración de quienes prefieren la autonomía de ingresar a horas distintas, recurriendo a la peligrosa práctica informal de enviarse capturas de pantalla de los tickets por WhatsApp.
- **Evidencia:** Las entrevistas de estadios y eventos demuestran cómo la rigidez de no poder compartir entradas de forma segura fomenta el fraude y la ineficiencia logística en los accesos físicos.

#### C. Entretenimiento e Hiper-conectividad vs. Necesidad de Seguridad y Emergencias

- **La Tensión:** Dentro del estadio o recinto, los usuarios demandan utilidades post-ingreso dinámicas (compartir fotos en redes, pedir snacks a su asiento). No obstante, el contexto de red congestionado hace que los usuarios prioricen la seguridad: temen perder el rastro de sus acompañantes en caso de emergencias médicas o desastres, donde la falta de comunicación celular genera situaciones de alto riesgo.
- **Evidencia:** Los entrevistados del sector estadios enfatizaron la necesidad de saber qué hacer o cómo comunicarse en una emergencia dentro del recinto masivo, donde el internet celular es nulo.

#### D. Validación de Identidad Híbrida vs. Infraestructura Técnica Precaria (Buses)

- **La Tensión:** Los pasajeros de transporte terrestre interprovincial desean el respaldo de poder abordar usando su número de cédula en caso de perder el celular. Sin embargo, dudan de la capacidad de los choferes y cooperativas para portar dispositivos confiables que sincronicen esa información en tiempo real en carreteras sin señal.
- **Evidencia:** Ángela Bravo sugiere el uso de su cédula de identidad como contingencia, mientras que Julián Lopera expresa desconfianza sobre la ciberseguridad y la estabilidad de los registros digitales de los choferes.

#### E. Automatización "Invisible" de Parking vs. Desconfianza en los Procesos de Reclamación

- **La Tensión:** Los conductores adoran el concepto de "pago invisible" y flujo continuo (entrar y salir sin tickets). Sin embargo, existe una enorme resistencia ante la idea de no tener un soporte físico de reclamo en caso de que el sistema cometa un error en el cobro de la tarifa o cuando la barrera física falla.
- **Evidencia:** Luis Borja detalla su calvario al tener que realizar trámites manuales engorrosos en atención al cliente para resolver fallos de lectura, demostrando que la falta de un respaldo físico de contingencia genera rechazo hacia lo 100% digital.

### Implicaciones para el Diseño de Producto (UX)

Para resolver estas tensiones, el diseño de la Super-App no debe forzar al usuario a un único comportamiento digital ideal. En su lugar, el sistema implementará flujos de trabajo UX redundantes:

1.  **Redundancia de Acceso:** Ofrecer widgets persistentes y carga en caché PWA offline para el usuario digital pragmático, pero habilitar la validación manual por documento de identidad (cédula) en el manifest local del operador como red de seguridad para el usuario ansioso.
2.  **Traspaso Seguro de Custodia:** Diseñar un flujo de transferencia P2P integrado en la app que invalide criptográficamente el token del emisor y emita un nuevo QR dinámico al receptor, eliminando las capturas estáticas por WhatsApp.
3.  **Auditoría de Sesión de Parking:** Proporcionar notificaciones automáticas inmediatas con el desglose exacto del tiempo de estacionamiento y cobro, acompañado de un botón de reclamo directo con un clic dentro de la app para combatir la desconfianza del cobro automático.

### Conclusión y Propuesta de Arquetipos

El diseño final de la plataforma debe satisfacer de forma simultánea a dos arquetipos de usuario claramente diferenciados:

- **Arquetipo A: "El Pragmático Conectado" (Raúl / Julián)**
  - _Objetivo:_ Velocidad y fricción cero.
  - _Comportamiento:_ Configura cobros invisibles, transfiere boletos digitalmente por anticipado y prefiere autogestionar su ingreso mediante widgets en su pantalla de bloqueo.
- **Arquetipo B: "El Precavido Vulnerable" (Ángela / Pamela / Luis)**
  - _Objetivo:_ Respaldo, seguridad y certidumbre.
  - _Comportamiento:_ Teme fallos del sistema, busca confirmaciones visuales constantes y necesita la tranquilidad de saber que hay alternativas físicas (cédula de identidad, personal de apoyo con datos locales) si la tecnología falla.

---

## 🚀 5. Conclusión: La Gran Oportunidad de Disrupción (Super-App)

La brecha de mercado identificada en la investigación de UX es abismal. La solución disruptiva ideal consiste en una **Super-App unificada** que trascienda la mera emisión de entradas y ataque de manera frontal las debilidades estructurales analizadas:

1.  **En Estacionamientos:** Integrar **LPR (Reconocimiento Automático de Placas)** para erradicar el ticket físico y el OPEX del hardware tradicional, habilitando el pago invisible automático y un panel de aclaraciones inmediato en el móvil para infundir confianza al conductor.
2.  **En Conciertos y Estadios:** Implementar de manera obligatoria el **QR dinámico (anti-reventa y clonación)**, garantizando además una arquitectura elástica que soporte preventas y un **modo offline confiable (PWA y caché IndexedDB)** para validación sin internet móvil en puertas.
3.  **En Concesiones In-Stadium:** Minimizar el tiempo de espera mediante pedidos dirigidos a las coordenadas del boleto físico (Sección, Fila, Asiento), optimizando el flujo de runners a través de validación por PIN offline.
4.  **En Transporte Terrestre:** Ofrecer un portal con **GPS en tiempo real compartido** para la seguridad del usuario y un sistema de validación de respaldo (por cédula de identidad en la terminal offline del chofer) para erradicar el estrés del teléfono sin batería.

---

Angelo Vera — 5to A  
Pamela Baño — 2do B
=======
Angelo Vera 5to A
Josue Guallisaca 2do B
Pamela Baño 2doB
Mathew Constante 1ro A

> > > > > > > 3d699050c2b237ad1184762a8a12e4400e6370f4
