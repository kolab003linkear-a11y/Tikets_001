# Bitácora de Prompts: Experiencia de Usuario (UX) - Ticket Shot

Este documento registra los mejores prompts diseñados y utilizados durante las sesiones de análisis con Gemini Notebook para el proyecto **"The Failures of the Ticket Shot User Experience"**. Cada prompt está estructurado para resolver un problema de investigación, diseño o estrategia de producto específico.

---

## 📋 Registro de Prompts de Alto Impacto

### 1. Informe de Problemas UX Recurrentes

- **Problema que resuelve:** Consolida de manera cuantitativa y cualitativa los dolores más recurrentes de los usuarios recopilados en las entrevistas de campo, ordenándolos por frecuencia para priorizar el backlog de desarrollo.
- **Prompt utilizado:**
  ```text
  Genera un informe profesional detallado que analice los 5 problemas y frustraciones de experiencia de usuario (UX) más recurrentes expresados por los usuarios en las entrevistas de campo. El informe debe estructurarse de mayor a menor frecuencia de la siguiente manera:
  1. Filas extensas, demoras operativas y cuellos de botella (4 menciones: Pamela, Raúl Fuente, Estadios 2).
  2. Temor al fraude, falsificación y duplicidad de boletos digitales (4 menciones: Pamela, Ángela Bravo, Julián David Lopera).
  3. Fricciones físicas con los tickets de papel (3 menciones: Luis Borja, Raúl Fuente, Pamela).
  4. Ansiedad por conectividad, falta de señal móvil o batería baja en el acceso (3 menciones: Estadios 2, Ángela Bravo, Julián David Lopera).
  5. Caídas del sistema, errores y fallos de la plataforma al comprar en línea (2 menciones: usuarios de eventos y app Ticket Shot).
  Incluye recomendaciones u oportunidades de mejora basadas en cada problema.
  ```

---

### 2. Análisis de Brechas: Dolores del Usuario vs. Competencia

- **Problema que resuelve:** Cruza las deficiencias técnicas de las empresas competidoras (del _Informe de Oportunidades_) con los testimonios reales de los usuarios para identificar "puntos ciegos" en el mercado y definir propuestas de valor disruptivas.
- **Prompt utilizado:**

  ```text
  Genera un informe estratégico y profesional titulado 'Análisis de Brechas: Dolores del Usuario vs. Debilidades de la Competencia' en español. El informe debe contrastar detalladamente los hallazgos de las entrevistas de campo (los dolores de los usuarios de estadios, parqueaderos, eventos y transporte) con el análisis de debilidades de los competidores detallado en el 'Informe de Oportunidades.docx'. Estructura el informe en las siguientes secciones clave:

  1. **Introducción y Contexto**: Explicar la importancia de alinear las necesidades del usuario con los fallos tecnológicos del mercado actual para generar disrupción.
  2. **Análisis de Brechas por Sector**:
     - **Estacionamientos**: Contraste entre el alto costo operativo (OPEX) por dependencia de hardware físico de la competencia y el calvario del ticket físico del usuario (pérdidas, atascos, daño). Propuesta: Eliminación de tickets por LPR (reconocimiento de placas).
     - **Conciertos y Eventos**: Contraste entre las caídas de plataformas por alta demanda y vulnerabilidad al fraude de los competidores con el 'pánico al fraude' y fallos de estabilidad de Ticket Shot reportados por los usuarios. Propuesta: QRs dinámicos e infraestructura elástica.
     - **Estadios**: Contraste entre aplicaciones inertes post-ingreso y dependencia de internet de la competencia con la ansiedad por falta de señal móvil e inoperabilidad dentro de los recintos que sufren los usuarios. Propuesta: Validación offline (caché local) y billetera de servicios para compras dentro del estadio.
     - **Buses Interprovinciales**: Contraste entre la precaria digitalización y falta de trazabilidad de los transportistas con los temores de seguridad y pérdida de pasajes de los viajeros. Propuesta: Portal de seguridad integrado con tracking en tiempo real y validaciones de respaldo por cédula.
  3. **La Oportunidad de Disrupción (Super-App)**: Exponer cómo una plataforma única que resuelva estos dolores transversales mediante tecnología ágil, confiable y con excelente experiencia de usuario (UX) puede dominar el mercado.
  4. **Recomendaciones Estratégicas**: Hoja de ruta para el desarrollo de producto priorizando el valor para el usuario y el operador técnico.

  Mantén un tono ejecutivo, analítico y sumamente estructurado, asegurando que cada sección profundice en la brecha técnica y operativa.
  ```

---

### 3. Análisis de Discrepancias y Contrastes de Opinión

- **Problema que resuelve:** Revela que los usuarios no son un grupo homogéneo; identifica tensiones en sus comportamientos, temores y contingencias de uso, permitiendo al equipo diseñar flujos UX flexibles en lugar de rígidos.
- **Prompt utilizado:**

  ```text
  Genera un informe detallado y profesional en español titulado 'Análisis de Discrepancias y Contrastes de Opinión: La Voz del Usuario en Tensión'. El informe debe analizar a profundidad las contradicciones, diferencias de comportamiento y prioridades divergentes encontradas en las entrevistas de campo sobre estadios, eventos, parqueaderos y transporte. Estructura el informe en las siguientes secciones clave:

  1. **Introducción**: Contextualizar la importancia de entender las discrepancias de comportamiento de los usuarios (tensiones) para diseñar una solución UX flexible que no asuma un arquetipo único.
  2. **Contradicciones Clave**:
     - *Control vs. Pánico Operativo*: Comparación entre quienes ingresan sin problemas y quienes sufren ansiedad por fallas de señal, batería o lectores lentos.
     - *Coordinación Grupal*: Coordinación rígida física (punto de encuentro) frente a transferencia digital autónoma de boletos e informalidades por WhatsApp.
     - *Funciones post-ingreso en estadios*: Foco en el entretenimiento y consumo (pedir comida) frente a la seguridad y gestión de emergencias médicas por inestabilidad de red.
     - *Contingencias de viaje (Buses)*: Validación de identidad mediante cédula offline versus infraestructura técnica propia de las unidades (Wi-Fi a bordo).
     - *Estacionamientos*: Experiencias fluidas o incidentes menores vs. fallos mecánicos y pérdida de tickets que exigen trámites engorrosos.
  3. **Implicaciones para el Diseño de Producto (UX)**: Cómo estructurar funcionalidades híbridas que resuelvan tanto al usuario ansioso como al usuario pragmático.
  4. **Conclusión y Propuesta de Arquetipos**: Recomendaciones de diseño inclusivas y robustas.

  Mantén un tono profesional, analítico y rigurosamente estructurado, asegurando que se destaquen las citas implícitas o las visiones de los distintos entrevistados (Pamela, Raúl, Luis, Ángela, Julián, Estadios 1 y 2).
  ```

---

## 💡 Consejos de Prácticas para Futuros Prompts

1.  **Contextualización Cuantitativa:** Indicar siempre la cantidad de menciones o entrevistas asociadas a una conclusión para dar peso real a los argumentos.
2.  **Estructura de Secciones Clara:** Definir de antemano el índice o los pilares conceptuales del informe para asegurar una redacción equilibrada en cada apartado.
3.  **Mantener Perspectivas Reales (No Generalizar):** Solicitar explícitamente el contraste de puntos de vista individuales (por ejemplo, comparar a _Raúl_ con _Luis_ o a _Ángela_ con _Julián_) para evitar que el modelo asuma una homogeneidad falsa en el comportamiento de los clientes.

# Bitácora de Prompts - Semana 2 (Proyecto Ticketing App)

## 1. Especificaciones de Producto (Spec Kit)

- **Fecha:** [Fecha]
- **Herramienta:** ChatGPT / Claude
- **Prompt:** "Actúa como un Lead Product Manager Senior. Necesito definir la especificación funcional y técnica..."
- **Resultado:** Generación de `specs/001-mvp/spec.md`.
- **Aprobado por Mentor:** Sí [x] No [ ]

## 2. Plan Técnico (Open SaaS)

- **Fecha:** [Fecha]
- **Herramienta:** ChatGPT / Claude
- **Prompt:** "Actúa como un Arquitecto de Software Fullstack especialista en Open SaaS..."
- **Resultado:** Generación de `plan.md`.
- **Aprobado por Mentor:** Sí [x] No [ ]

## 3. Identidad Visual (DESIGN.md)

- **Fecha:** [Fecha]
- **Herramienta:** ChatGPT / Claude
- **Prompt:** "Actúa como un Lead UI/UX Designer. Genera el documento DESIGN.md..."
- **Resultado:** Definición de paleta de colores, tipografía y UI components.

## 4. Generación de Prototipos en Stitch

- **Pantalla 1 (Búsqueda):** [Inserte prompt utilizado]
- **Pantalla 2 (Mapa de Asientos):** [Inserte prompt utilizado]
- **Pantalla 3 (Ticket QR):** [Inserte prompt utilizado]
- **Enlace/Exportación Antigravity:** [Link o confirmación de exportación]

# Bitácora de Prompts - Sesión de Implementación TiketsLinkear

Esta sección registra los prompts utilizados durante la adaptación técnica del proyecto. El objetivo es que otro integrante pueda entender qué se solicitó, qué se implementó y qué decisiones se tomaron.

## 1. Adaptación del módulo de eventos

- **Prompt utilizado:**

  ```text
  Adapta la parte del módulo de eventos para que permita gestionar tickets para OchoyMedio en Quito, Ecuador. La interfaz debe ser responsive y estar pensada principalmente para una app móvil.
  ```

- **Resultado:** Se creó una vista de gestión de eventos con cartelera, búsqueda, filtros, tipos de entrada, precios, cupos, ventas, ocupación, publicación y creación de nuevas funciones.

## 2. Persistencia de eventos y tickets

- **Prompt utilizado:**

  ```text
  Convierte la demo local del módulo de eventos en una gestión persistente. Agrega entidades para eventos y tipos de entrada, operaciones para listarlos, crearlos, publicarlos y actualizar cupos, respetando el patrón Wasp y Prisma del proyecto.
  ```

- **Resultado:** Se agregaron los modelos `Event`, `EventTicketType` y `EventStatus` en Prisma, junto con operaciones Wasp para consultar eventos, crear funciones, publicar eventos y actualizar cupos.

## 3. Configuración de base de datos

- **Prompt utilizado:**

  ```text
  Revisa cómo solucionar el problema de DATABASE_URL. Comprueba Docker Compose, PostgreSQL, las variables de entorno y la diferencia entre ejecutar Prisma desde Windows y ejecutarlo dentro de Docker.
  ```

- **Resultado:** Se documentó que `db` es el host para contenedores y `localhost` es el host para comandos ejecutados directamente desde Windows. Se configuró PostgreSQL con Docker Compose y se aplicó la migración de eventos.

## 4. Instalación de dependencias

- **Prompt utilizado:**

  ```text
  Instala las dependencias necesarias del proyecto para recuperar los ejecutables locales, incluido Prisma, y valida el esquema después de la instalación.
  ```

- **Resultado:** Se ejecutó `npm install`, se recuperó Prisma 5.19.1 y se validó el esquema utilizando una URL PostgreSQL de desarrollo.

## 5. Inicio de Docker y Wasp en Windows

- **Prompt utilizado:**

  ```text
  Inicia la aplicación y mantente revisando el terminal para detectar si Wasp, Docker, PostgreSQL, Vite o el servidor API no se ejecutan correctamente.
  ```

- **Resultado:** Se comprobó que Wasp no debe ejecutarse directamente en Windows con este CLI. El proyecto se inició dentro de un contenedor Linux usando `docker compose run --service-ports`, con el frontend en el puerto `3000` y el backend en `3001`.

## 6. Diagnóstico de compilación y pantalla blanca

- **Prompt utilizado:**

  ```text
  Revisa los logs y determina si la demora es normal, si el proceso está bloqueado, si la pantalla blanca se debe a la compilación o si existe un error real de Vite o del servidor.
  ```

- **Resultado:** Se identificó y corrigió un error de tipado en las operaciones de eventos. También se identificó un timeout inicial de Vite durante la optimización de dependencias. Después, Wasp compiló el SDK y el servidor quedó escuchando correctamente.

## 7. Detención de servicios

- **Prompt utilizado:**

  ```text
  Detén todos los servicios y contenedores del proyecto y confirma que los puertos de la aplicación quedaron cerrados.
  ```

- **Resultado:** Se ejecutó `docker compose down --remove-orphans`. Se detuvieron los contenedores del proyecto y los puertos `3000` y `3001`. Se detectó aparte un proceso PostgreSQL instalado directamente en Windows en el puerto `5432`.

## 8. Renombrado del producto

- **Prompt utilizado:**

  ```text
  Cambia el nombre del proyecto y del producto a TiketsLinkear en todos los lugares afectados, incluyendo títulos, branding, metadatos, correos, documentación y configuración.
  ```

- **Resultado:** Se actualizó el nombre visible de la aplicación, la configuración Wasp, el branding de navegación, metadatos SEO, correos, documentación y nombre del paquete npm. Los archivos generados por Wasp se dejaron sin editar porque se regeneran automáticamente.

## 9. Corrección del alcance funcional

- **Prompt utilizado:**

  ```text
  La aplicación gestiona tickets de cuatro módulos: eventos, partidos, parqueaderos y buses interprovinciales. OchoyMedio solo será el escenario de prueba del módulo de eventos. Corrige la descripción del proyecto para reflejar ese alcance.
  ```

- **Resultado:** La documentación se corrigió para separar el producto completo de su escenario de pruebas. Se documentaron los cuatro módulos y se aclaró que OchoyMedio no limita el uso de la plataforma.

## 10. Documentación de despliegue

- **Prompt utilizado:**

  ```text
  Crea un archivo Markdown detallado que explique cómo clonar el repositorio, traer cambios, instalar dependencias, configurar variables de entorno, levantar Docker y PostgreSQL, aplicar migraciones, iniciar Wasp, probar desde móvil, revisar logs y detener los servicios. La guía debe ser portable y no depender de rutas personales.
  ```

- **Resultado:** Se creó `md/GUIA-DESPLIEGUE.md` con instrucciones portables para cualquier integrante del equipo.

## 11. Documentación general del proyecto

- **Prompt utilizado:**

  ```text
  Crea un archivo Markdown que detalle qué hace el proyecto, para qué fue creado, quiénes lo utilizan, cuáles son sus módulos, cuál es su arquitectura, qué está implementado y qué queda pendiente antes de producción.
  ```

- **Resultado:** Se creó `md/DESCRIPCION-PROYECTO.md` con la visión funcional y técnica de TiketsLinkear.

## 12. Documentación de herramientas y lenguajes

- **Prompt utilizado:**

  ```text
  Crea un archivo Markdown que explique todas las herramientas utilizadas: Docker, Docker Compose, Prisma, Wasp, Node.js, npm, React, Vite, Tailwind, Git, Prettier, ESLint, Vitest, Playwright, PostgreSQL, los lenguajes y sus herramientas correspondientes. Incluye la función y ejemplos de uso.
  ```

- **Resultado:** Se creó `md/HERRAMIENTAS-TECNOLOGIAS.md` con la función de cada tecnología, comandos, relaciones entre herramientas y flujo de trabajo.

## 13. Organización de documentación

- **Prompt utilizado:**

  ```text
  Crea una carpeta llamada md y coloca dentro los tres archivos Markdown de documentación recién creados.
  ```

- **Resultado:** Se creó la carpeta `md` y se organizaron allí la guía de despliegue, la descripción del proyecto y la documentación técnica.

## 14. Publicación en el repositorio

- **Prompt utilizado:**

  ```text
  Sube todos los cambios pendientes al repositorio remoto, incluyendo la implementación, migraciones, renombrado y documentación.
  ```

- **Resultado:** Los cambios se publicaron en la rama `main` del repositorio remoto mediante el commit `e2fcfdf`.

## 15. Convenciones para futuros prompts

Para continuar el proyecto se recomienda que cada prompt incluya:

1. El módulo afectado: eventos, partidos, parqueaderos o buses interprovinciales.
2. El tipo de usuario: administrador, asistente, operador, conductor o personal de acceso.
3. El comportamiento esperado en móvil.
4. Si el cambio requiere base de datos, API, interfaz o pruebas.
5. Si OchoyMedio se utiliza como escenario de prueba o como requisito del producto.
6. El comando o validación que debe ejecutarse después del cambio.
