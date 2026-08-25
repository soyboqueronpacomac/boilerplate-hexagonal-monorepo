# boilerplate-hexagonal-monorepo

![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.23.0-F69220?style=flat-square&logo=pnpm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1.11-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2.5.10-60A5FA?style=flat-square&logo=biome&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-17.4.2-ECD53F?style=flat-square&logo=dotenv&logoColor=black)
![env--var](https://img.shields.io/badge/env--var-7.5.0-4B32C3?style=flat-square)

Plantilla de monorepo con **pnpm workspaces** que aplica **arquitectura hexagonal** (puertos y adaptadores) tanto en el backend como en el frontend, compartiendo tipos entre ambos a través de un paquete de contratos.

## Arquitectura

Cada app se organiza en tres capas, de dentro hacia afuera:

```
domain            → conceptos de negocio puros, sin dependencias externas
application/ports  → interfaces que la aplicación necesita del exterior
application/use-cases → orquestación: combina el dominio con los puertos
infrastructure     → adaptadores concretos (HTTP, UI, persistencia...)
```

Las dependencias siempre apuntan hacia adentro: `infrastructure` conoce `application`, `application` conoce `domain`, nunca al revés. Un caso de uso no sabe si el puerto que recibe está implementado con `fetch`, con una base de datos o con un valor en memoria.

Ejemplo real en este repo — el mismo flujo implementado en ambos lados:

| Capa | `src/apps/api` | `src/apps/web` |
|---|---|---|
| Puerto | `application/ports/system-state-provider.ts` | `application/ports/health-checker-api.ts` |
| Caso de uso | `application/use-cases/check-system-state.ts` | `application/use-cases/health-checker.ts` |
| Adaptador *driven* (secundario) | `infrastructure/system-state/system-state-provider-in-memory.ts` | `infrastructure/http/health-checker-api-http.ts` |
| Adaptador *driving* (primario) | `infrastructure/routes/api/api.route.ts` (registra `GET /state`) | `infrastructure/components/state-api.ts` (Custom Element) |

El caso de uso traduce entre el modelo de dominio (`@boilerplate-hexagonal-monorepo/domain`) y el contrato externo (`@boilerplate-hexagonal-monorepo/api-contracts`) — el dominio nunca habla el formato de la API.

## Estructura del repo

```
src/
├── apps/
│   ├── api/      → backend Express
│   └── web/      → frontend con Vite + Custom Elements
└── packages/
    ├── domain/            → modelo de negocio compartido
    ├── api-contracts/     → tipos del contrato HTTP compartidos entre api y web
    └── typescript-config/ → tsconfig base compartido (node.json, navegador.json)
```

Los paquetes de `src/packages/*` se consumen desde las apps como dependencias de workspace (`workspace:*`) y exponen su `dist/` compilado, nunca su código fuente directamente.

`src/apps/api` organiza además sus rutas HTTP en `infrastructure/routes/`: cada recurso tiene su propio router (p. ej. `routes/api/api.route.ts`), y `routes/app.route.ts` los compone en uno solo que `createApp.ts` monta sin saber qué rutas contiene. `createApp.ts` es un punto de composición puro — recibe el `Router` ya ensamblado desde `main.ts`, nunca importa Express en la capa de aplicación.

## Crear un proyecto nuevo a partir de esta plantilla

Funciona igual en Windows, macOS y Linux — ambas opciones solo necesitan Node instalado.

**Opción 1 — botón de GitHub.** Este repositorio es un [*template repository*](https://github.com/soyboqueronpacomac/boilerplate-hexagonal-monorepo/generate): entra y pulsa **Use this template → Create a new repository**. Te crea un repo nuevo, sin el historial de commits de la plantilla.

**Opción 2 — un comando, sin usar GitHub.** Con [degit](https://github.com/Rich-Harris/degit) (vía `npx`, no hace falta instalarlo):

```sh
npx degit soyboqueronpacomac/boilerplate-hexagonal-monorepo mi-proyecto
cd mi-proyecto
pnpm install
```

Después de clonar por cualquiera de las dos vías, busca y reemplaza `boilerplate-hexagonal-monorepo` por el nombre de tu proyecto en los `package.json` (raíz y cada paquete/app) y en los imports que usan `@boilerplate-hexagonal-monorepo/*`.

## Requisitos

- Node 24
- pnpm — la versión exacta está fijada en `packageManager` (`package.json`); con [Corepack](https://nodejs.org/api/corepack.html) habilitado (`corepack enable`) no hace falta instalarlo aparte.

## Variables de entorno

`api` lee su configuración de `process.env` a través de [`env-var`](https://github.com/evanshortiss/env-var), y [`dotenv`](https://github.com/motdotla/dotenv) carga un archivo `.env` si existe. Antes de arrancar, crea `src/apps/api/.env` a partir de `src/apps/api/.env.example`:

```sh
cp src/apps/api/.env.example src/apps/api/.env
```

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | Sí | Puerto en el que escucha `api`. Sin ella, el servidor no arranca — falla rápido con un error claro en vez de arrancar a medias. |

`.env` está en `.gitignore`; solo `.env.example` se versiona. Si añades una variable nueva, decláralo en `env-config-provider.ts` (`infrastructure/config/`) y documéntala también en `.env.example`.

## Puesta en marcha

```sh
pnpm install
pnpm dev
```

`pnpm install` compila automáticamente `domain` y `api-contracts` mediante un hook `postinstall` — sin ese paso, `api` y `web` no podrían resolver esos paquetes. `pnpm dev` levanta `api` en el `PORT` de tu `.env` y `web` en `http://localhost:5173` (con proxy de `/api` hacia el backend).

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | Arranca todas las apps (`src/apps/*`) en modo desarrollo, en paralelo |
| `pnpm build` | Compila paquetes y apps en orden topológico (paquetes antes que apps) |
| `pnpm typecheck` | Verifica tipos en todo el workspace, incluyendo los tests |
| `pnpm test` | Corre los tests de todas las apps |

Cada script puede acotarse a un proyecto con `--filter`, p. ej. `pnpm --filter "@boilerplate-hexagonal-monorepo/api" test`.

## Tests

La arquitectura hexagonal permite una pirámide de tests natural, ya usada en ambas apps:

- **Casos de uso** → dobles de prueba escritos a mano contra el puerto (sin librerías de mocking, sin red, sin DOM).
- **Adaptadores *driven*** → test aislado contra su tecnología real (`fetch` global stubbeado, memoria).
- **Adaptadores *driving*** → test de punta a punta (`supertest` contra Express, `jsdom` para el Custom Element).

## Cómo añadir algo nuevo

**Una app nueva** en `src/apps/<nombre>`: necesita su propio `package.json` (con `name: "@boilerplate-hexagonal-monorepo/<nombre>"`) y `tsconfig.json` extendiendo de `../../packages/typescript-config/node.json` o `navegador.json` según corresponda. `pnpm-workspace.yaml` ya la detecta automáticamente por estar bajo `src/apps/*`.

**Un paquete compartido nuevo** en `src/packages/<nombre>`: mismo patrón, y decláralo como dependencia (`"@boilerplate-hexagonal-monorepo/<nombre>": "workspace:*"`) en cada app que lo consuma para que pnpm cree el symlink en `node_modules`.

**Una ruta HTTP nueva en `api`**: crea un `Router` de Express en `infrastructure/routes/<recurso>/<recurso>.route.ts` (mismo patrón que `routes/api/api.route.ts`) y móntalo en `routes/app.route.ts`. `createApp.ts` no cambia — solo conoce el `Router` final, nunca rutas individuales.

## CI

`.github/workflows/ci.yml` corre `typecheck`, `build` y `test` en cada push y pull request a `main`.
