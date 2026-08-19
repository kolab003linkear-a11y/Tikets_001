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
