# AgroTrack — Web Application

Aplicación web funcional de AgroTrack, la plataforma que permite a agricultores y personal agrícola registrar sus parcelas, monitorear las condiciones del suelo, gestionar cultivos y recibir alertas climáticas para tomar decisiones de riego basadas en datos reales.

Web Application: [https://agro-track.vitaltrek.workers.dev/login](https://agro-track.vitaltrek.workers.dev/login)

---

## Descripción

Este repositorio contiene el Frontend Web Application de AgroTrack, construido sobre Angular. La aplicación consume el Web Service (API REST) de AgroTrack y ofrece a los usuarios una experiencia adaptable a las dimensiones del dispositivo (responsive), permitiéndoles gestionar sus parcelas, dar seguimiento a sus cultivos, revisar el monitoreo del suelo y recibir alertas relacionadas con las condiciones climáticas.

---

## Tecnología

- **Angular** — framework principal de la aplicación.
- **TypeScript** — lenguaje de programación para la lógica de la aplicación.
- **Angular Material** — biblioteca de componentes de UI, basada en Material Design.
- **SCSS / CSS** — estilos y tematización de la aplicación (`material-theme.scss`, `styles.css`).
- **Vitest** — ejecución de pruebas unitarias.
- **Cloudflare Workers (Wrangler)** — plataforma de despliegue de la aplicación.

---

## Arquitectura del proyecto

La aplicación está organizada siguiendo un enfoque orientado a dominios (Domain-Driven Design), donde cada bounded context vive en su propio módulo dentro de `src/app`, y a su vez cada módulo respeta una arquitectura por capas:

- **application** — casos de uso y orquestación de la lógica del módulo.
- **domain** — entidades, modelos y reglas de negocio del módulo.
- **infrastructure** — servicios, comunicación con el API REST y detalles técnicos.
- **presentation** — componentes visuales, vistas y elementos de interacción con el usuario.

### Bounded contexts implementados

| Módulo | Descripción |
|---|---|
| `dashboard` | Vista general y resumen de la información relevante para el usuario. |
| `farming` | Gestión de parcelas y cultivos. |
| `soil-monitoring` | Monitoreo de las condiciones del suelo. |
| `alerts` | Alertas climáticas y notificaciones relacionadas al cultivo. |
| `iam` / `identity` | Autenticación, autorización y gestión de identidad del usuario. |
| `support` | Soporte y ayuda al usuario dentro de la aplicación. |
| `shared` | Elementos de infraestructura y presentación reutilizados entre módulos. |

---

## Estructura del repositorio

```
WebApplication/
├── public/                      # Archivos públicos estáticos
├── src/
│   ├── app/
│   │   ├── alerts/               # Bounded context: alertas
│   │   ├── dashboard/            # Bounded context: dashboard
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── farming/               # Bounded context: gestión de parcelas y cultivos
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── iam/                   # Bounded context: gestión de accesos
│   │   ├── identity/              # Bounded context: identidad de usuario
│   │   ├── shared/                # Elementos compartidos entre módulos
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── soil-monitoring/       # Bounded context: monitoreo del suelo
│   │   ├── support/                # Bounded context: soporte
│   │   ├── app.config.ts           # Configuración principal de la aplicación
│   │   ├── app.css                 # Estilos globales de la aplicación
│   │   ├── app.routes.ts           # Definición de rutas
│   │   ├── app.spec.ts             # Pruebas del componente raíz
│   │   └── app.ts                  # Componente raíz de la aplicación
│   ├── assets/                     # Imágenes, íconos y recursos multimedia
│   ├── environments/               # Configuración por entorno
│   ├── index.html                  # Documento HTML principal
│   ├── main.ts                     # Punto de entrada de la aplicación
│   ├── material-theme.scss         # Tema de Angular Material
│   └── styles.css                  # Estilos globales
├── angular.json                    # Configuración de Angular CLI
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración de TypeScript
├── wrangler.jsonc                  # Configuración de despliegue en Cloudflare Workers
└── README.md                       # Este archivo
```

---

## Instalación y ejecución local

```bash
git clone https://github.com/AgroTrack-Project/web-Application.git
cd web-Application
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200/`.

---

## Compilación

```bash
ng build
```

Los artefactos de compilación se generan en el directorio `dist/`, optimizados para producción.

---

## Pruebas unitarias

Las pruebas unitarias se ejecutan con [Vitest](https://vitest.dev/):

```bash
ng test
```

---

## Despliegue

La aplicación se despliega en **Cloudflare Workers** mediante **Wrangler**, según la configuración definida en `wrangler.jsonc`.

---

## Internacionalización y accesibilidad

La aplicación considera soporte para inglés (en_US) y español latinoamericano (es_419), e incorpora atributos ARIA y buenas prácticas de accesibilidad (a11y) para asegurar una experiencia inclusiva para todos los usuarios.

---

## Control de versiones y colaboración

Este repositorio sigue las siguientes convenciones para mantener consistencia en el ciclo de vida del producto:

- GitFlow como workflow de branching (`main`, `develop`, `feature/*`, `release/*`, `hotfix/*`).
- Conventional Commits para los mensajes de commit (`feat:`, `fix:`, `chore:`, etc.).
- Semantic Versioning para el nombrado de releases.
