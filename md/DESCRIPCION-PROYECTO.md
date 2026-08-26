# TiketsLinkear

## 1. Que es el proyecto

TiketsLinkear es una aplicacion web responsive, pensada principalmente para dispositivos moviles, que centraliza la gestion de tickets para cuatro tipos de operacion: eventos, partidos, parqueaderos y buses interprovinciales.

El espacio OchoyMedio, ubicado en La Floresta, Quito, se utiliza unicamente como escenario de prueba para validar el modulo de eventos. No representa el alcance completo del producto ni limita la plataforma a un solo recinto.

El proyecto busca que cada operador gestione sus tickets, disponibilidad y accesos desde un solo lugar, mientras que el usuario pueda consultar y utilizar sus pases desde el movil. La aplicacion tambien conserva una arquitectura preparada para servicios complementarios de movilidad y atencion al usuario.

## 2. Para que fue creado

El objetivo principal es modernizar la experiencia completa alrededor de un evento:

- Gestionar tickets para eventos culturales y de entretenimiento.
- Gestionar tickets y accesos para partidos.
- Gestionar el acceso y los pagos de parqueaderos.
- Gestionar tickets y pasajeros de buses interprovinciales.
- Definir tipos de ticket, precios y cantidad de cupos.
- Consultar ventas, ocupacion, disponibilidad y estados de acceso.
- Entregar al usuario pases digitales con codigo QR.
- Reducir filas, errores de control y dependencia de tickets impresos.
- Preparar los flujos para operar con conectividad inestable o sin Internet.
- Centralizar los cuatro modulos en una sola aplicacion movil.

## 3.1 Los cuatro modulos principales

### Modulo de eventos

Permite crear y administrar funciones culturales, cine, teatro, cine foro y festivales. Para las pruebas iniciales se utiliza OchoyMedio como recinto de referencia, con funciones, tipos de entrada, cupos y ventas simuladas.

### Modulo de partidos

Permite gestionar tickets para partidos y otros eventos deportivos. Incluye la asignacion de zonas, filas y asientos, presentacion de QR, validacion en puertas y controles para evitar el uso duplicado de un ticket.

### Modulo de parqueaderos

Permite registrar vehiculos, controlar entradas y salidas y asociar el acceso a una placa o ticket de parqueadero. Puede integrarse con reconocimiento automatico de placas, calculo de tarifas y pago digital.

### Modulo de buses interprovinciales

Permite gestionar tickets de viaje, rutas, pasajeros y abordaje. Incluye manifiestos offline, validacion mediante cedula y seguimiento GPS del viaje para contactos autorizados.

Los servicios de pedidos al asiento, transferencias de tickets y QR dinamicos son capacidades transversales que pueden ser utilizadas por uno o varios de estos modulos.

## 4. Usuarios del sistema

### Operador o administrador

Gestiona el modulo que tenga asignado. En eventos puede crear funciones, definir categorias, publicar actividades y ajustar cupos. En partidos puede controlar zonas y asientos; en parqueaderos, vehiculos y sesiones; y en buses, rutas y pasajeros.

### Asistente

Consulta sus entradas, visualiza la funcion, el lugar y su ubicacion. Puede presentar el codigo QR, utilizar servicios del recinto y transferir una entrada a otra persona.

### Personal de acceso

Utiliza el escaner para validar entradas en la puerta. El sistema contempla validacion de tokens dinamicos y rechazo de capturas antiguas o entradas duplicadas.

### Conductor o usuario de parqueadero

Puede registrar una placa vehicular y usar un flujo de entrada y salida con reconocimiento de placas, conocido como LPR o ANPR.

### Chofer o personal de transporte

Puede consultar un manifiesto de pasajeros, verificar una identidad mediante cedula y registrar abordajes, incluso en escenarios sin conectividad.

### Personal de entrega

Gestiona pedidos de alimentos, bebidas o productos asociados a una ubicacion dentro del recinto.

## 5. Modulo de gestion de eventos

Este es el modulo que se esta validando inicialmente en OchoyMedio. La arquitectura debe permitir reutilizarlo para otros recintos y operadores.

### Funciones disponibles

- Catalogo de funciones de cine y teatro.
- Identificacion del recinto: `OchoyMedio - La Floresta`.
- Busqueda por titulo.
- Filtro por categoria.
- Estados de funcion: `Publicado` y `Borrador`.
- Indicador visual de entradas vendidas frente a cupos totales.
- Tipos de entrada por funcion.
- Precio por tipo de entrada.
- Cantidad vendida.
- Capacidad total.
- Ajuste de cupos con controles tactiles.
- Resumen de funciones activas, entradas vendidas, ocupacion e ingresos.
- Formulario responsive para crear nuevas funciones.
- Estado de venta movil habilitada.

### Experiencia responsive

La interfaz esta construida con Tailwind CSS y se adapta a pantallas pequenas y grandes:

- En movil, los controles se organizan en una sola columna.
- El formulario de nueva funcion aparece como panel inferior para facilitar el uso con el pulgar.
- Los botones tienen una altura tactil minima.
- Las listas no dependen de tablas anchas.
- La informacion importante se presenta en tarjetas compactas y escaneables.
- En escritorio, el listado y el detalle se muestran en dos columnas.

## 6. Flujo de gestion de una funcion

1. El organizador entra a `Gestion de eventos`.
2. Consulta las funciones existentes de OchoyMedio.
3. Busca una funcion o filtra por categoria.
4. Selecciona una funcion para ver sus tipos de entrada.
5. Revisa precio, ventas y cupos disponibles.
6. Incrementa o reduce la capacidad con los botones de control.
7. Publica la funcion para habilitarla o la pasa a borrador.
8. Para una nueva funcion, selecciona `Nueva funcion`.
9. Completa titulo, fecha, hora y categoria.
10. Guarda la funcion como borrador y luego puede publicarla.

## 7. Gestion de tickets

El modelo de datos permite relacionar una funcion con varios tipos de entrada. Cada tipo puede tener:

- Nombre: General, Estudiante, Platea, Balcon, VIP u otro.
- Precio.
- Capacidad.
- Cantidad vendida.
- Relacion con su funcion.

Cuando una entrada se emite, el sistema puede asociarla a un usuario y guardar:

- Evento.
- Recinto.
- Fecha y hora.
- Zona o tipo de entrada.
- Fila y asiento, si aplica.
- Estado de la entrada.
- Secreto utilizado para generar el token dinamico.
- Historial de transferencia.
- Registro de entrada al recinto.

Los estados contemplados para una entrada son:

- `ACTIVE`: entrada activa.
- `TRANSFERRED`: entrada transferida.
- `USED`: entrada ya utilizada.
- `CANCELLED`: entrada cancelada.

## 8. Codigo QR dinamico y acceso offline

La billetera digital muestra la entrada activa y genera un codigo que cambia cada 30 segundos. El objetivo es dificultar la reutilizacion de capturas de pantalla o codigos estaticos.

El sistema incluye:

- Billetera digital de entradas.
- Actualizacion periodica del token.
- Cuenta regresiva de la ventana de renovacion.
- Presentacion del QR en alto contraste.
- Almacenamiento local de entradas para consulta offline.
- Simulacion de widget o actividad en pantalla bloqueada.
- Escaner para personal de puerta.
- Registro de escaneos autorizados y rechazados.
- Deteccion de token vencido.
- Deteccion de token duplicado en el escaner.

### Importante sobre la implementacion actual

La implementacion actual es una demostracion funcional. El archivo de tokens incluye una simulacion determinista de firma para el entorno de desarrollo; antes de produccion debe sustituirse por HMAC-SHA256 real mediante una libreria criptografica apropiada y una estrategia segura de manejo de secretos.

## 9. Transferencia de entradas

El asistente puede transferir una entrada a otra persona mediante correo electronico. El flujo contempla:

1. El propietario selecciona la entrada.
2. Introduce el correo del destinatario.
3. Se crea una transferencia pendiente.
4. El token del propietario debe quedar revocado al completar el proceso.
5. El destinatario acepta la invitacion.
6. Se genera una nueva entrada para su billetera.

La transferencia evita compartir capturas o archivos estaticos por mensajeria.

## 10. Modulo de parqueadero LPR

El modulo de parqueadero esta preparado para reconocer placas vehiculares mediante camaras LPR.

Funciones contempladas:

- Registro de placas.
- Seleccion de placa principal.
- Creacion de una sesion al entrar.
- Calculo de tiempo estacionado.
- Calculo de tarifa.
- Pago automatico al salir.
- Apertura de barrera.
- Registro de errores de pago.
- Flujo alternativo mediante QR.
- Monitor de camara y actuador de barrera.

LPR significa reconocimiento automatico de placas. La integracion real requiere camaras, controlador de barrera, red local y proveedor de pagos.

## 11. Modulo de buses interprovinciales y seguridad

El modulo de transporte esta pensado para viajes interprovinciales y operaciones de seguridad.

Funciones contempladas:

- Visualizacion de ubicacion GPS en vivo.
- Compartir un enlace de seguimiento con familiares.
- Consulta de ruta y puntos de control.
- Manifiesto offline de pasajeros.
- Busqueda por numero de cedula.
- Validacion de abordaje cuando el pasajero no tiene bateria.
- Registro local de abordajes.
- Sincronizacion posterior cuando vuelve la conectividad.

## 12. Modulo de pedidos dentro del recinto

El modulo de pedidos permite solicitar alimentos, bebidas o productos sin abandonar el asiento o la ubicacion asignada.

Funciones contempladas:

- Menu de productos.
- Cantidades por producto.
- Calculo del total.
- Asociacion del pedido a zona, fila y asiento.
- PIN de entrega.
- Estados de pedido.
- Panel del personal repartidor.
- Confirmacion de entrega.
- Cola local para escenarios de conectividad intermitente.

Aunque la idea original esta inspirada en recintos deportivos, el modelo puede adaptarse a funciones de cine, teatro y festivales.

## 13. Arquitectura tecnica

### Frontend

- React 19.
- TypeScript.
- Vite.
- Tailwind CSS.
- Lucide React para iconos.
- React Router mediante Wasp.
- Componentes responsive reutilizables.

### Backend

- Wasp como framework full-stack.
- Node.js dentro del contenedor Linux.
- Operaciones de consulta y acciones declaradas en archivos `.wasp.ts`.
- Prisma como ORM.
- PostgreSQL como base de datos.

### Base de datos

Los modelos principales incluyen:

- `User`: usuarios y perfiles.
- `Event`: funciones y eventos organizados.
- `EventTicketType`: tipos de entrada, precios y cupos.
- `Ticket`: entradas emitidas.
- `DynamicToken`: ventanas de tokens dinamicos.
- `LPRVehicle`: placas registradas.
- `ParkingFacility`: instalaciones de parqueadero.
- `ParkingSession`: sesiones de estacionamiento.
- `TransitRoute`: rutas de transporte.
- `TransitTrip`: viajes programados.
- `PassengerManifestEntry`: manifiesto de pasajeros.
- `InStadiumVenue`: recinto para servicios internos.
- `ConcessionOrder`: pedidos de productos.
- `TicketTransfer`: transferencias de entradas.

## 14. Estructura principal de carpetas

```text
.
├── docker-compose.yml       # PostgreSQL y contenedor de desarrollo
├── Dockerfile               # Imagen Linux con Node 24 y Wasp CLI
├── template/app              # Aplicacion principal
│   ├── main.wasp.ts         # Configuracion y registro de modulos Wasp
│   ├── schema.prisma        # Modelos de base de datos
│   ├── src/client            # Navegacion y pantallas principales
│   ├── src/events            # Gestion de eventos y operaciones persistentes
│   ├── src/ticketing         # Billetera, QR, escaner y transferencias
│   ├── src/parking           # Parqueadero y reconocimiento LPR
│   ├── src/transit           # GPS, rutas y manifiesto de pasajeros
│   ├── src/concessions       # Menu, pedidos y entregas
│   ├── src/auth              # Autenticacion
│   ├── src/admin             # Panel administrativo base
│   └── migrations             # Migraciones Prisma
├── template/blog              # Blog/documentacion Astro de la plantilla
├── e2e-tests                  # Pruebas end-to-end con Playwright
├── specs                       # Especificaciones, contratos y plan de la funcionalidad
├── tools                       # Scripts auxiliares, incluido wrapper de Wasp
└── GUIA-DESPLIEGUE.md         # Instalacion, Docker, migraciones y arranque
```

## 15. Servicios externos previstos

La base del proyecto incluye integraciones preparadas o configurables para:

- Stripe, Polar o Lemon Squeezy: pagos y suscripciones.
- OpenAI: ejemplo de funcionalidad con inteligencia artificial.
- AWS S3: almacenamiento de archivos.
- SendGrid, Mailgun o SMTP: envio de correos.
- Google Analytics o Plausible: analitica.
- PostgreSQL: persistencia de datos.

Para el funcionamiento local de la demo no es necesario activar todos estos servicios. Las credenciales reales deben configurarse solo mediante variables de entorno y secretos del proveedor.

## 16. Estado actual del proyecto

### Disponible

- Aplicacion responsive.
- Arquitectura de cuatro modulos: eventos, partidos, parqueaderos y buses interprovinciales.
- Branding TiketsLinkear.
- Gestion visual de eventos de OchoyMedio.
- Flujos de tickets deportivos que sirven como base para el modulo de partidos.
- Modelos Prisma para eventos y tipos de entrada.
- Operaciones Wasp para consultar, crear, publicar y actualizar cupos.
- Migracion Prisma de eventos.
- Billetera digital de entradas de demostracion.
- QR dinamico de demostracion.
- Escaner de acceso de demostracion.
- Flujos demostrativos de parqueadero, transporte y pedidos.
- Ejecucion local mediante Docker Desktop.

### Pendiente antes de produccion

- Conectar la interfaz de eventos a `useQuery` y `useAction` generados por Wasp.
- Completar una vista operativa independiente para el modulo de partidos.
- Implementar venta real y emision de entradas desde un proveedor de pagos.
- Reemplazar datos mock por datos persistentes en todos los modulos.
- Implementar HMAC-SHA256 real y manejo seguro de secretos.
- Implementar widgets nativos para iOS y Android.
- Configurar roles y permisos de organizador en backend.
- Integrar hardware real de escaneo, LPR y barreras.
- Configurar correo transaccional real.
- Añadir backups, monitoreo y logs de produccion.
- Revisar vulnerabilidades de dependencias.
- Completar pruebas end-to-end del flujo de eventos y compra.

## 17. Proposito resumido

TiketsLinkear es una plataforma movil para gestionar tickets de eventos, partidos, parqueaderos y buses interprovinciales. OchoyMedio es el escenario de prueba del modulo de eventos, mientras que el producto completo esta pensado para varios tipos de operadores y situaciones de acceso, movilidad y control.
