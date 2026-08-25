# boilerplate-hexagonal-monorepo

![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.23.0-F69220?style=flat-square&logo=pnpm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1.11-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2.5.10-60A5FA?style=flat-square&logo=biome&logoColor=white)

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
| Adaptador *driving* (primario) | `infrastructure/http/createApp.ts` (Express) | `infrastructure/components/state-api.ts` (Custom Element) |

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

## Requisitos

- Node 24
- pnpm — la versión exacta está fijada en `packageManager` (`package.json`); con [Corepack](https://nodejs.org/api/corepack.html) habilitado (`corepack enable`) no hace falta instalarlo aparte.

## Puesta en marcha

```sh
pnpm install
pnpm dev
```

`pnpm install` compila automáticamente `domain` y `api-contracts` mediante un hook `postinstall` — sin ese paso, `api` y `web` no podrían resolver esos paquetes. `pnpm dev` levanta `api` en `http://localhost:3000` (configurable con la variable de entorno `PORT`) y `web` en `http://localhost:5173` (con proxy de `/api` hacia el backend).

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

## CI

`.github/workflows/ci.yml` corre `typecheck`, `build` y `test` en cada push y pull request a `main`.
