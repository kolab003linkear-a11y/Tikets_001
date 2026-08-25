# Guia de despliegue de TiketsLinkear

Esta guia explica como instalar dependencias, levantar PostgreSQL, aplicar migraciones Prisma, iniciar Wasp dentro de Docker y probar TiketsLinkear desde un navegador de escritorio o movil.

## 1. Requisitos previos

Instala o verifica lo siguiente:

- Windows 10 u 11.
- Docker Desktop.
- Git, si el proyecto se obtiene desde un repositorio.
- VS Code, recomendado para editar el proyecto.
- Conexion a Internet durante la primera instalacion.

### Versiones importantes

El contenedor utiliza `node:24-bookworm`, que es compatible con la version actual de Wasp usada por el proyecto. Wasp no debe ejecutarse directamente desde Windows porque el CLI utilizado por este proyecto requiere Linux o macOS. Por eso, los comandos de Wasp se ejecutan dentro del contenedor Linux de Docker.

## 2. Clonar el repositorio

Cada integrante debe clonar el repositorio en su propio equipo. La ruta local puede ser diferente para cada persona; no es necesario usar la ruta del equipo de otra persona.

En PowerShell, ve a la carpeta donde quieras guardar el proyecto y ejecuta el comando reemplazando `URL_DEL_REPOSITORIO` por la URL real:

```powershell
cd "$HOME\Documents"
git clone URL_DEL_REPOSITORIO TiketsLinkear
cd TiketsLinkear
```

Si el repositorio ya fue clonado anteriormente, entra en su carpeta y trae los cambios:

```powershell
cd RUTA_LOCAL_DEL_REPOSITORIO
git pull
```

No se debe ejecutar `git pull` si hay cambios locales sin guardar. Comprueba el estado primero:

```powershell
git status
```

Si hay cambios locales, guárdalos en un commit o utiliza temporalmente `git stash` antes de traer cambios.

Comprueba que estas en la raiz correcta del repositorio:

```powershell
Get-ChildItem
```

Debes ver archivos como:

- `docker-compose.yml`
- `Dockerfile`
- `template`
- `tools`

La aplicacion se encuentra en:

```text
template/app
```

## 3. Preparar las variables de entorno

La aplicacion utiliza `DATABASE_URL` para conectarse a PostgreSQL.

Para comandos ejecutados dentro de Docker, la URL debe utilizar el nombre del servicio de Compose:

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@db:5432/superapp
```

Para comandos Prisma ejecutados directamente desde Windows, el host seria `localhost`:

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/superapp
```

El archivo local de la aplicacion se encuentra en:

```text
template/app/.env.server
```

Los archivos `.env` pueden estar excluidos del repositorio porque contienen secretos. Si `template/app/.env.server` no existe, crea una copia del ejemplo:

```powershell
Copy-Item template/app/.env.server.example template/app/.env.server
```

Abre `template/app/.env.server` y revisa sus valores. Para desarrollo local, como minimo debe existir:

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/superapp
```

El archivo `.env.client.example` se utiliza de la misma forma si el proyecto requiere variables de cliente:

```powershell
Copy-Item template/app/.env.client.example template/app/.env.client
```

No subas `.env.server` ni `.env.client` al repositorio. Cada integrante debe crear sus propias copias locales.

No publiques este archivo en un repositorio si contiene credenciales reales. Las credenciales incluidas en este proyecto son valores de desarrollo.

## 4. Iniciar Docker Desktop

Abre Docker Desktop y espera a que indique que el motor esta ejecutandose.

Comprueba desde PowerShell:

```powershell
docker version
```

Si aparece un error relacionado con `dockerDesktopLinuxEngine`, Docker Desktop aun no termino de iniciar.

## 5. Levantar PostgreSQL

Desde la raiz del proyecto ejecuta:

```powershell
docker compose up -d db
```

Este comando:

- Descarga `postgres:15-alpine` si es necesario.
- Crea el contenedor `superapp-db`.
- Publica PostgreSQL en `localhost:5432`.
- Crea o reutiliza el volumen `pgdata`.

Comprueba el estado:

```powershell
docker compose ps
```

El servicio `db` debe aparecer como `Up`.

Comprueba la salud interna de PostgreSQL:

```powershell
docker exec superapp-db pg_isready -U postgres -d superapp
```

La respuesta esperada es similar a:

```text
/var/run/postgresql:5432 - accepting connections
```

## 6. Aplicar migraciones de Prisma

Como Wasp corre dentro de Docker, ejecuta Prisma dentro de la red de Compose. Desde la raiz del proyecto:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate dev --name add_events"
```

La primera ejecucion puede construir la imagen `superapp-app:latest` e instalar dependencias. Es normal que tarde varios minutos.

La salida correcta debe indicar que la migracion fue creada y aplicada, por ejemplo:

```text
Applying migration `..._add_events`
Your database is now in sync with your schema.
Generated Prisma Client
```

Si la migracion `add_events` ya existe, Prisma puede indicar que no hay cambios nuevos. Eso tambien es correcto.

Para validar el esquema sin aplicar cambios:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma validate"
```

## 7. Instalar dependencias de la aplicacion

El servicio `app` utiliza el volumen:

```text
.:/workspace
```

Esto permite que el contenedor vea el codigo local. La instalacion recomendada es:

```powershell
docker compose run --rm app sh -c "cd /workspace/template/app && npm install"
```

La primera instalacion puede mostrar advertencias de `npm audit` o de scripts pendientes. Una advertencia no significa necesariamente que la instalacion haya fallado.

## 8. Iniciar Wasp en modo desarrollo

No ejecutes el wrapper `tools/wasp.ps1` directamente en Windows para iniciar Wasp. En este proyecto el CLI se ejecuta dentro de Linux mediante Docker.

Desde la raiz del proyecto ejecuta:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

`--service-ports` publica los puertos del servicio:

- Frontend Vite: `3000`.
- Servidor Wasp: `3001`.

Mantén abierta esta terminal mientras trabajas. Wasp observa los cambios y recompila el proyecto cuando modificas los archivos fuente.

### Arranque completo en un solo comando

Si es la primera ejecucion o quieres instalar dependencias y arrancar todo:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && npm install && wasp start"
```

## 9. Confirmar que el servidor inicio

En la salida de la terminal deben aparecer mensajes similares a:

```text
Your wasp project has successfully compiled.
VITE ready
Local: http://localhost:3000/
Server listening on port 3001
```

Tambien puedes comprobar los puertos desde otra ventana de PowerShell:

```powershell
Test-NetConnection 127.0.0.1 -Port 3000
Test-NetConnection 127.0.0.1 -Port 3001
```

El valor esperado es:

```text
TcpTestSucceeded : True
```

Comprueba los contenedores:

```powershell
docker ps
```

El contenedor de desarrollo y `superapp-db` deben estar activos.

## 10. Abrir la aplicacion

En el mismo equipo abre:

```text
http://localhost:3000
```

Para probar la gestion de eventos:

1. Abre la aplicacion.
2. Actualiza la pagina con `Ctrl + F5` si venias de una compilacion anterior.
3. Abre el selector de roles.
4. Selecciona `Gestion de eventos`.
5. Verifica el panel de OchoyMedio.
6. Prueba crear una nueva funcion.
7. Prueba publicar o pasar a borrador.
8. Ajusta los cupos con los botones `+` y `-`.

## 11. Probar desde un movil en la misma red

Para acceder desde un movil, el ordenador y el movil deben estar conectados a la misma red Wi-Fi.

Obtén la direccion IPv4 del ordenador:

```powershell
ipconfig
```

Busca el valor `IPv4 Address`, por ejemplo `192.168.1.25`.

Desde el movil abre:

```text
http://192.168.1.25:3000
```

Si no carga:

- Comprueba que ambos dispositivos estan en la misma red.
- Permite Docker Desktop y Node en el Firewall de Windows.
- Verifica que el puerto `3000` sigue publicado.
- Comprueba que el servidor fue iniciado con `--service-ports`.

## 12. Revisar logs

Lista los contenedores activos:

```powershell
docker ps
```

Revisa los logs de PostgreSQL:

```powershell
docker compose logs --tail=100 db
```

Revisa los logs del contenedor de desarrollo. Sustituye el nombre por el que aparezca en `docker ps`:

```powershell
docker logs --tail=100 NOMBRE_DEL_CONTENEDOR
```

Mensajes normales:

- `Database successfully set up.`
- `SDK built successfully.`
- `Your wasp project has successfully compiled.`
- `VITE ready.`
- `Server listening on port 3001.`
- `spawn xdg-open ENOENT`: Docker intento abrir un navegador Linux. En Windows se puede ignorar; abre la URL manualmente.

## 13. Problemas frecuentes

### Docker no responde

Mensaje habitual:

```text
failed to connect to the docker API
```

Solucion:

1. Abre Docker Desktop.
2. Espera a que el motor Linux este listo.
3. Ejecuta `docker version`.
4. Repite el comando de Compose.

### `DATABASE_URL` no encontrada

Mensaje habitual:

```text
Environment variable not found: DATABASE_URL
```

Solucion desde la raiz:

```powershell
$env:DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/superapp"
cd template\app
npx prisma validate --schema schema.prisma
```

Si ejecutas Prisma dentro de Docker, utiliza el comando de la seccion 6 y el host `db`.

### Prisma no alcanza `localhost:5432`

Verifica PostgreSQL:

```powershell
docker compose ps
docker exec superapp-db pg_isready -U postgres -d superapp
```

Si el contenedor esta activo pero Windows no conecta, usa Prisma dentro del contenedor de la aplicacion, donde `db` es el hostname correcto.

### Wasp no funciona desde Windows

El error puede indicar que el paquete no soporta `win32`.

Solucion:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

### Pantalla blanca o timeout de Vite

Revisa los logs. Si aparece `transport invoke timed out`, espera a que termine la primera optimizacion y reinicia sin reinstalar dependencias:

```powershell
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

Despues actualiza el navegador con `Ctrl + F5`.

### El terminal intenta entrar en una ruta duplicada

Si ya estas dentro de `template\app`, no ejecutes otra vez:

```powershell
Set-Location template\app
```

Comprueba la ubicacion actual:

```powershell
Get-Location
```

## 14. Detener los servicios

Para detener PostgreSQL y eliminar los contenedores del proyecto:

```powershell
docker compose down --remove-orphans
```

Este comando no elimina el volumen `pgdata`, por lo que los datos permanecen guardados.

Para detener y eliminar tambien la base de datos persistida, utiliza esta variante solo si quieres borrar todos los datos locales:

```powershell
docker compose down --remove-orphans -v
```

No ejecutes la variante `-v` si necesitas conservar usuarios, eventos o migraciones de desarrollo.

## 15. Reiniciar desde cero sin borrar datos

```powershell
docker compose down --remove-orphans

docker compose up -d db

docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate deploy"

docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && wasp start"
```

## 16. Comandos utiles de calidad

Desde `template/app` puedes validar TypeScript:

```powershell
cd template\app
npx tsc --noEmit -p tsconfig.src.json
```

Puedes validar el esquema Prisma dentro de Docker:

```powershell
cd ..\..
docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma validate"
```

## 17. Notas para produccion

Esta configuracion de Docker esta preparada principalmente para desarrollo y demostracion local. Antes de publicar TiketsLinkear en Internet debes:

- Cambiar todas las contrasenas de desarrollo.
- Usar una base PostgreSQL administrada o protegida.
- Configurar `DATABASE_URL` mediante secretos del proveedor.
- Configurar dominios y HTTPS.
- Revisar las credenciales de pagos, correo, OpenAI y almacenamiento.
- Ejecutar migraciones con un proceso controlado.
- No exponer PostgreSQL publicamente si no es necesario.
- Revisar las vulnerabilidades de npm antes del despliegue.
- Crear backups y un procedimiento de restauracion.

## Resumen rapido

Desde la raiz del proyecto:

```powershell
# Iniciar Docker Desktop primero

docker compose up -d db

docker compose run --rm app sh -c "cd /workspace/template/app && npx prisma migrate dev --name add_events"
docker compose run --rm --service-ports app sh -c "cd /workspace/template/app && npm install && wasp start"
```

Aplicacion:

```text
http://localhost:3000
```

API:

```text
http://localhost:3001
```

Apagar:

```powershell
docker compose down --remove-orphans
```
