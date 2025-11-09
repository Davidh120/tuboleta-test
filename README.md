<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Tuboleta Test API</h1>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/features/actions" target="_blank"><img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white" alt="GitHub Actions" /></a>
  <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

## Descripción

API RESTful construida con NestJS para el manejo de eventos, catálogos, contactos y órdenes. Este proyecto sigue una arquitectura hexagonal y está diseñado para ser escalable y mantenible.

## Características

- Validación de datos con class-validator y class-transformer
- Configuración basada en variables de entorno
- Contenedorización con Docker
- Integración continua con GitHub Actions

## Estructura del Proyecto

```
src/
├── Catalog/           # Módulo de catálogo
│   ├── application/   # Lógica de aplicación
│   ├── domain/        # Entidades y reglas de negocio
│   └── infrastructure/# Implementaciones concretas
├── Contact/           # Módulo de contactos
├── Order/             # Módulo de órdenes
└── POS/               # Módulo de punto de venta
```

## Requisitos Previos

- Node.js (v18+)
- pnpm (gestor de paquetes)
- Docker y Docker Compose (opcional, para desarrollo con contenedores)

## Comenzando

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Davidh120/tuboleta-test.git
   cd tuboleta-test
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus configuraciones
   ```

### Ejecución

#### Desarrollo

```bash
# Modo desarrollo con recarga en caliente
$ pnpm run start:dev

# O ejecuta con Docker Compose (incluye la base de datos)
$ docker-compose up -d
```

#### Producción

```bash
# Construir la aplicación
$ pnpm run build

# Ejecutar en producción
$ pnpm run start:prod
```

## Docker

El proyecto incluye configuración para Docker:

```bash
# Construir la imagen
$ docker build -t tuboleta-api .

# Ejecutar el contenedor
$ docker run -p 3000:3000 tuboeta-api
```

O usa Docker Compose para un entorno completo:

```bash
docker-compose up -d
```

## Despliegue

El proyecto incluye un flujo de GitHub Actions para CI/CD. Los despliegues se pueden realizar manualmente o automáticamente al hacer pull request a la rama main.

