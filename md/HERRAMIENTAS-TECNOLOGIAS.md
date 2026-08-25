# Herramientas y tecnologias de TiketsLinkear

Este documento explica las tecnologias utilizadas en TiketsLinkear, la funcion de cada una y la forma en que se relacionan dentro del proyecto.

## 1. Resumen de la arquitectura

TiketsLinkear utiliza una arquitectura full-stack compuesta por:

```text
Navegador movil o escritorio
        |
        | Frontend React + Vite + Tailwind CSS
        |
Servidor Wasp + Node.js
        |
        | Prisma ORM
        |
Base de datos PostgreSQL
```

Docker ejecuta de forma aislada los servicios necesarios y permite que Wasp funcione en un entorno Linux aunque el equipo del desarrollador utilice Windows.

## 2. Lenguajes utilizados

### TypeScript

TypeScript es el lenguaje principal del proyecto. Es una extension de JavaScript que agrega tipos estaticos.

Se utiliza para:

- Componentes de React.
- Operaciones del servidor.
- Configuracion de Wasp.
- Validacion de datos.
- Pruebas unitarias y de integracion.
- Scripts auxiliares.

Ejemplo:

```typescript
interface EventData {
  title: string;
  capacity: number;
  published: boolean;
}

const event: EventData = {
  title: "Cine ecuatoriano",
  capacity: 120,
  published: true,
};
```

Ventaja principal: detecta errores de tipos antes de ejecutar la aplicacion.

Validacion del codigo:

```powershell
cd template\app
npx tsc --noEmit -p tsconfig.src.json
```

### JavaScript

JavaScript es el lenguaje que ejecuta finalmente el navegador y Node.js. Aunque la mayor parte del codigo fuente esta escrito en TypeScript, TypeScript se transforma a JavaScript durante la compilacion.

Tambien se utiliza en:

- Scripts `.mjs`.
- Configuraciones de Vite.
- Salidas generadas por Wasp.
- Automatizaciones y pruebas.

### Prisma Schema Language

Prisma utiliza un lenguaje declarativo en `schema.prisma` para describir la base de datos.

Ejemplo:

```prisma
model Event {
  id          String       @id @default(uuid())
  title       String
  startsAt    DateTime
  ticketTypes EventTicketType[]
}
```

El esquema define tablas, relaciones, indices, valores por defecto y restricciones.

## 3. Entorno de ejecucion

### Node.js

Node.js permite ejecutar JavaScript y TypeScript del lado del servidor y las herramientas de desarrollo.

En este proyecto:

- Wasp utiliza Node.js para el servidor.
- npm administra las dependencias.
- Vite ejecuta el servidor de desarrollo del frontend.
- Prisma genera el cliente de acceso a PostgreSQL.

El `Dockerfile` utiliza Node 24:

```dockerfile
FROM node:24-bookworm
RUN npm install -g @wasp.sh/wasp-cli
```

Esto es importante porque la version actual del CLI de Wasp requiere una version moderna de Node.

### npm

npm es el gestor de paquetes de Node.js.

Se utiliza para:

- Instalar dependencias.
- Ejecutar scripts.
- Crear y actualizar el archivo `package-lock.json`.
- Ejecutar TypeScript, Prisma, Vitest y otras herramientas.

Comandos principales:

```powershell
npm install
npm audit
npm run lint
npx tsc --noEmit -p tsconfig.src.json
```

`npm install` lee `package.json` y deja las dependencias instaladas en `node_modules`.

## 4. Docker

### Docker

Docker ejecuta aplicaciones dentro de contenedores aislados. En TiketsLinkear se usa para evitar diferencias entre los equipos de los integrantes.

Beneficios:

- Todos utilizan una version similar de Node y Wasp.
- PostgreSQL se inicia sin instalarlo manualmente en Windows.
- La aplicacion puede compartir una configuracion comun.
- Los servicios se pueden iniciar y detener de manera reproducible.

Comprobar Docker:

```powershell
docker version
```

### Docker Desktop

Docker Desktop es la aplicacion que ejecuta el motor Docker en Windows. Debe estar abierta antes de iniciar los contenedores.

Si aparece un error como:

```text
failed to connect to the docker API
```

Docker Desktop no esta iniciado o el motor Linux aun no esta listo.

### Dockerfile

El archivo `Dockerfile` define la imagen base del contenedor de desarrollo:

```text
Dockerfile
```

Actualmente:

1. Utiliza `node:24-bookworm`.
2. Instala globalmente el CLI de Wasp.

### Docker Compose

`docker-compose.yml` define los servicios del proyecto.

Actualmente contiene:

- `db`: base PostgreSQL.
- `app`: contenedor Linux para instalar dependencias y ejecutar Wasp.

Iniciar solo la base:

```powershell
docker compose up -d db
```

Ver los servicios:

```powershell
docker compose ps
```

Ver los contenedores activos:

```powershell
docker ps
```

Detener los servicios:

```powershell
docker compose down --remove-orphans
```

Detener y borrar tambien los datos persistidos:

```powershell
docker compose down --remove-orphans -v
```

La opcion `-v` debe utilizarse con cuidado porque elimina el volumen PostgreSQL `pgdata`.

### Volumen de Docker

El Compose monta el repositorio dentro del contenedor:

```yaml
volumes:
  - .:/workspace
```

Esto permite modificar el codigo desde VS Code y que el contenedor detecte los cambios.

## 5. Wasp

Wasp es el framework full-stack utilizado para conectar frontend, backend, autenticacion, rutas, operaciones y base de datos.

Wasp permite declarar operaciones y rutas con archivos `.wasp.ts`.

Ejemplo de una operacion:

```typescript
export const eventsSpec: Spec = [
  query(getEvents, { entities: ["Event", "EventTicketType"] }),
  action(createEvent, { entities: ["Event", "EventTicketType"] }),
];
```

En este proyecto Wasp se encarga de:

- Compilar la configuracion de la aplicacion.
- Generar el SDK tipado.
- Generar el servidor.
- Conectar las operaciones con Prisma.
- Preparar autenticacion.
- Ejecutar el frontend y backend durante desarrollo.
- Observar cambios y recompilar.

### Wasp en Windows

El CLI utilizado por la aplicacion no se ejecuta directamente en Windows. Por eso debe ejecutarse dentro del contenedor Linux:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

Los puertos son:

- `3000`: frontend Vite.
- `3001`: backend Wasp.

### Archivos principales de Wasp

- `main.wasp.ts`: registra la aplicacion y sus especificaciones.
- `src/events/events.wasp.ts`: registra queries y acciones de eventos.
- `src/auth/auth.wasp.ts`: configura autenticacion.
- Otros archivos `.wasp.ts`: registran modulos adicionales.

## 6. Prisma

Prisma es el ORM utilizado para comunicarse con PostgreSQL desde TypeScript.

ORM significa Object-Relational Mapping. Permite consultar tablas utilizando objetos y metodos tipados en vez de escribir SQL manualmente en cada operacion.

En TiketsLinkear Prisma gestiona:

- Modelos de datos.
- Relaciones entre usuarios, eventos, tickets y cupos.
- Migraciones.
- Cliente TypeScript generado.
- Validacion del esquema.

### Modelos principales

- `User`: usuario del sistema.
- `Event`: evento o funcion.
- `EventTicketType`: tipo de entrada, precio y capacidad.
- `Ticket`: entrada emitida.
- `DynamicToken`: token temporal del QR.
- `LPRVehicle`: vehiculo registrado.
- `ParkingSession`: sesion de parqueadero.
- `TransitRoute`: ruta interprovincial.
- `TransitTrip`: viaje programado.
- `PassengerManifestEntry`: pasajero del manifiesto.
- `ConcessionOrder`: pedido interno.
- `TicketTransfer`: transferencia de ticket.

### Validar el esquema

Dentro de Docker:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma validate"
```

### Crear una migracion

Cuando se modifica `schema.prisma`:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate dev --name descripcion_del_cambio"
```

Ejemplo:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate dev --name add_events"
```

### Aplicar migraciones existentes

Para aplicar migraciones ya creadas:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate deploy"
```

### Cliente Prisma

Despues de modificar el esquema, Prisma genera un cliente actualizado:

```powershell
npx prisma generate
```

En el flujo normal, `prisma migrate dev` tambien genera el cliente.

## 7. PostgreSQL

PostgreSQL es la base de datos relacional del proyecto.

El servicio se configura en `docker-compose.yml` con:

```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: mysecretpassword
POSTGRES_DB: superapp
```

En la red Docker, la aplicacion se conecta mediante:

```text
postgresql://postgres:mysecretpassword@db:5432/superapp
```

Desde Windows, si se ejecuta una herramienta fuera de Docker, el host es `localhost`:

```text
postgresql://postgres:mysecretpassword@localhost:5432/superapp
```

La diferencia es importante:

- `db` funciona dentro de la red de Docker Compose.
- `localhost` funciona desde Windows.

### Persistencia

PostgreSQL utiliza el volumen `pgdata`. Esto evita perder los datos al recrear el contenedor.

Para comprobar PostgreSQL:

```powershell
docker exec superapp-db pg_isready -U postgres -d superapp
```

## 8. React

React es la libreria utilizada para construir la interfaz.

En TiketsLinkear se utiliza para:

- Renderizar pantallas.
- Manejar formularios.
- Gestionar estados locales.
- Responder a eventos del usuario.
- Crear componentes reutilizables.

Ejemplo:

```tsx
const [showForm, setShowForm] = useState(false);

<button type="button" onClick={() => setShowForm(true)}>
  Nueva funcion
</button>
```

Los componentes principales se encuentran en `template/app/src`.

## 9. Vite

Vite es la herramienta de desarrollo y compilacion del frontend.

Se encarga de:

- Servir la aplicacion durante desarrollo.
- Recargar cambios rapidamente.
- Optimizar dependencias.
- Compilar los recursos para produccion.

La aplicacion se abre normalmente en:

```text
http://localhost:3000
```

Una primera compilacion puede tardar mas porque Vite optimiza dependencias. Mensajes como `dependencies optimized` son normales.

## 10. Tailwind CSS

Tailwind CSS es el sistema de estilos utilizado en los componentes.

En lugar de crear una clase CSS para cada elemento, se combinan clases utilitarias:

```tsx
<div className="grid gap-5 lg:grid-cols-2">
  Contenido responsive
</div>
```

Se utiliza para:

- Espaciado.
- Colores.
- Bordes.
- Tipografia.
- Grid y flexbox.
- Responsive design.
- Estados hover, focus y disabled.

Los breakpoints principales son:

- `sm`: pantallas pequenas.
- `md`: tabletas.
- `lg`: escritorio.
- `xl` y `2xl`: pantallas grandes.

La interfaz de TiketsLinkear prioriza movil, por eso normalmente se define primero el estilo de pantalla pequena y despues se agregan clases como `sm:`, `md:` o `lg:`.

## 11. Lucide React

Lucide React es la libreria de iconos utilizada en botones y paneles.

Ejemplo:

```tsx
import { CalendarDays } from "lucide-react";

<CalendarDays className="h-4 w-4" />
```

Los iconos se utilizan para:

- Identificar acciones.
- Mejorar la lectura de tarjetas.
- Acompanar botones.
- Mostrar categorias y estados.
- Mantener una interfaz consistente.

## 12. React Router

React Router administra la navegacion entre vistas del frontend. Wasp genera y mantiene parte de las rutas de la aplicacion.

En la superapp se utiliza tambien navegacion por modulos, por ejemplo:

- Entradas y QR.
- Eventos.
- Parqueadero.
- Buses y rutas.
- Servicios dentro del recinto.

## 13. Autenticacion

Wasp configura la autenticacion de usuarios. El proyecto tiene autenticacion por correo y contrasena, ademas de configuraciones preparadas para proveedores sociales.

La autenticacion permite:

- Identificar al usuario actual.
- Proteger operaciones del servidor.
- Asociar eventos a un organizador.
- Asociar tickets a un usuario.
- Restringir cambios de cupos al propietario de la funcion.

Las operaciones de eventos verifican que exista una sesion autenticada antes de leer o modificar datos.

## 14. Variables de entorno

Las variables de entorno permiten configurar servicios sin escribir secretos directamente en el codigo.

Archivos principales:

- `template/app/.env.server`: variables del servidor.
- `template/app/.env.client`: variables disponibles para el cliente.
- `template/app/.env.server.example`: plantilla compartible.
- `template/app/.env.client.example`: plantilla compartible.

Ejemplo minimo del servidor:

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/superapp
```

Dentro de Docker, Compose define la URL con el host `db`.

Nunca deben subirse contrasenas reales, tokens, claves de proveedores o secretos de produccion al repositorio.

## 15. Git

Git controla las versiones del codigo y permite que el equipo comparta cambios.

Flujo habitual:

```powershell
git clone URL_DEL_REPOSITORIO TiketsLinkear
cd TiketsLinkear
git pull
git status
git add .
git commit -m "Descripcion del cambio"
git push
```

Antes de traer cambios:

```powershell
git status
```

Antes de subir cambios es recomendable ejecutar validaciones de TypeScript y pruebas.

## 16. PowerShell

PowerShell es la terminal recomendada para los comandos en Windows.

Se utiliza para:

- Navegar por carpetas.
- Ejecutar Docker.
- Definir variables de entorno temporales.
- Ejecutar npm y Prisma.
- Revisar puertos.
- Consultar procesos.

Ejemplo de variable temporal:

```powershell
$env:DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/superapp"
```

Ejemplo para revisar un puerto:

```powershell
Test-NetConnection 127.0.0.1 -Port 3000
```

## 17. Prettier

Prettier formatea automaticamente el codigo para mantener un estilo comun entre todos los integrantes.

Configuracion principal:

```text
prettier.config.ts
```

Comandos habituales desde la raiz del repositorio:

```powershell
npm run prettier:check
npm run prettier:format
```

Si el script no esta disponible en el `package.json` de la aplicacion, se puede ejecutar directamente:

```powershell
npx prettier --check .
npx prettier --write .
```

No se deben reformatear archivos generados dentro de `.wasp/out`, porque Wasp los vuelve a crear.

## 18. ESLint

ESLint analiza el codigo para encontrar problemas comunes y aplicar reglas de calidad.

Configuracion principal:

```text
eslint.config.js
```

Comandos:

```powershell
npm run lint
npm run lint:fix
```

ESLint ayuda a detectar:

- Variables no utilizadas.
- Errores comunes de JavaScript o TypeScript.
- Problemas de React.
- Problemas de hooks.
- Inconsistencias de estilo configuradas por el equipo.

## 19. Vitest

Vitest es el framework usado para pruebas unitarias y de comportamiento.

Se utiliza para validar funciones como:

- Generacion y verificacion de tokens dinamicos.
- Calculo de tarifas.
- Operaciones de parqueadero.
- Cola offline de pedidos.
- Manifiestos de transporte.

Comandos habituales:

```powershell
npx vitest run
npx vitest
```

Una prueba normalmente se encuentra junto al modulo que valida y utiliza la extension `.test.ts` o `.test.tsx`.

## 20. Playwright

Playwright ejecuta pruebas end-to-end en un navegador real.

Se utiliza para comprobar flujos completos, por ejemplo:

- Ver la billetera de entradas.
- Cambiar al rol de operador de puerta.
- Validar un QR.
- Probar parqueadero LPR.
- Consultar el manifiesto de transporte.
- Crear un pedido y confirmar su entrega.

La configuracion esta en:

```text
e2e-tests/playwright.config.ts
```

Las pruebas estan en:

```text
e2e-tests/tests
```

Ejemplo de ejecucion:

```powershell
cd e2e-tests
npm install
npx playwright test
```

## 21. Service Worker y funcionamiento offline

El proyecto incluye un Service Worker para apoyar el funcionamiento sin conectividad.

Se utiliza para:

- Guardar recursos del frontend.
- Mantener disponibles datos de tickets en cache.
- Permitir la presentacion de entradas con conectividad limitada.
- Preparar colas locales para operaciones que deben sincronizarse luego.

El Service Worker se encuentra en:

```text
template/app/src/client/serviceWorker.ts
```

El almacenamiento local de tickets se maneja en:

```text
template/app/src/ticketing/offlineVault.ts
```

## 22. Estructura de herramientas por responsabilidad

| Responsabilidad | Herramienta |
| --- | --- |
| Lenguaje principal | TypeScript |
| Ejecucion del servidor | Node.js |
| Gestion de paquetes | npm |
| Framework full-stack | Wasp |
| Frontend | React |
| Desarrollo frontend | Vite |
| Estilos responsive | Tailwind CSS |
| Iconos | Lucide React |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Contenedores | Docker |
| Orquestacion local | Docker Compose |
| Control de versiones | Git |
| Terminal Windows | PowerShell |
| Formateo | Prettier |
| Calidad estatica | ESLint |
| Pruebas unitarias | Vitest |
| Pruebas navegador | Playwright |
| Funcionamiento offline | Service Worker y LocalStorage |

## 23. Flujo completo de una modificacion

Cuando un integrante modifica una funcionalidad, el flujo recomendado es:

1. Traer los cambios recientes:

```powershell
git pull
```

2. Crear o activar los archivos `.env` desde los ejemplos.
3. Levantar Docker Desktop.
4. Iniciar PostgreSQL:

```powershell
docker compose up -d db
```

5. Si se cambio `schema.prisma`, crear una migracion:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate dev --name descripcion_del_cambio"
```

6. Instalar dependencias si es necesario:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npm install"
```

7. Iniciar Wasp:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

8. Validar TypeScript:

```powershell
cd template\app
npx tsc --noEmit -p tsconfig.src.json
```

9. Ejecutar pruebas relevantes.
10. Revisar el resultado en `http://localhost:3000`.
11. Formatear y analizar el codigo.
12. Crear commit y subir los cambios.

## 24. Relacion con los cuatro modulos

### Eventos

Wasp, Prisma, React y Tailwind permiten crear funciones, tipos de entrada, cupos y estados de publicacion. OchoyMedio se utiliza como escenario de prueba para este modulo.

### Partidos

React y los componentes de ticketing presentan zonas, filas, asientos y QR. Prisma permite persistir tickets y estados de acceso.

### Parqueaderos

Node.js, Wasp, Prisma y PostgreSQL gestionan vehiculos y sesiones. Una integracion real tambien requiere camaras LPR y un controlador de barrera.

### Buses interprovinciales

React muestra rutas y estados; Prisma almacena viajes y manifiestos; el Service Worker y el almacenamiento local permiten preparar operaciones offline.

## 25. Nota sobre desarrollo y produccion

La configuracion actual esta enfocada en desarrollo y demostracion. Antes de produccion se deben revisar:

- Versiones soportadas de Node y Wasp.
- Secretos y variables de entorno.
- Seguridad de tokens QR.
- HMAC-SHA256 real para los tokens.
- Roles y permisos del backend.
- Integraciones de pagos.
- Integraciones LPR y hardware de acceso.
- Backups de PostgreSQL.
- HTTPS y dominios.
- Logs, monitoreo y alertas.
- Vulnerabilidades de npm.

## Resumen

TiketsLinkear combina TypeScript, React, Wasp, Prisma, PostgreSQL, Docker y herramientas de calidad para construir una plataforma movil de tickets. Wasp conecta el frontend y el backend, Prisma conecta el backend con PostgreSQL, Docker estandariza el entorno y las herramientas como Prettier, ESLint, Vitest y Playwright ayudan a mantener la calidad del proyecto.
