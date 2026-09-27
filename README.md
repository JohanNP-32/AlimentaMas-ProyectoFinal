# Alimenta+ — Módulo de registro de donantes (Proyecto final)

Este módulo implementa el **registro y autenticación de personas donantes y
organizaciones beneficiarias**, con JWT y roles (`admin` / `usuario`), tal
como lo pide la parte 1 del proyecto final. Todo lo que se puede hacer desde
aquí (código, pruebas, pipeline) ya está listo. Lo que **debes correr tú en
tu computadora** (porque necesita tu cuenta de GitHub y programas instalados)
está marcado con 📸 — ahí es donde tomas el screenshot para tu entrega.

## 1. Qué hay en esta carpeta

```
src/
  app.js                    -> servidor Express
  controllers/authController.js  -> registro y login
  middleware/auth.js        -> valida el JWT y revisa el rol
  models/userModel.js       -> "base de datos" en memoria (simula la tabla de usuarios)
  routes/authRoutes.js      -> endpoints /api/auth/...
  utils/jwt.js              -> firmar/verificar tokens
tests/                      -> pruebas unitarias con Jest (19 pruebas, 95% de cobertura)
.github/workflows/ci-cd.yml -> pipeline de CI/CD con GitHub Actions
sonar-project.properties    -> configuración para SonarQube/SonarCloud
```

## 2. Correr el proyecto en tu computadora

1. Instala Node.js 20 si no lo tienes.
2. Abre esta carpeta en VS Code.
3. En la terminal de VS Code:
   ```bash
   npm install
   npm test
   ```
   Esto corre las 19 pruebas y muestra la tabla de cobertura (debe salir
   arriba de 80% en todo). 📸 **Toma screenshot de esta tabla** — es tu
   evidencia del punto "Pruebas unitarias con cobertura ≥ 80%".

4. Para levantar el servidor y probarlo a mano:
   ```bash
   npm start
   ```
   Luego, con Postman, Insomnia o `curl`, prueba:
   - `POST http://localhost:3000/api/auth/register` con body JSON:
     ```json
     { "nombre": "Panaderia El Buen Pan", "email": "test@test.com", "password": "password123", "tipo": "empresa_donante" }
     ```
   - `POST http://localhost:3000/api/auth/login` con `email` y `password`.
   - `GET http://localhost:3000/api/auth/me` con el header
     `Authorization: Bearer <el token que te devolvió el login>`.

## 3. Subir el proyecto a GitHub y activar el CI/CD 📸

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. En la terminal:
   ```bash
   git init
   git add .
   git commit -m "Modulo de registro de donantes con JWT y roles"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/alimenta-plus.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings → Secrets and variables → Actions** y agrega
   estos secrets (aunque sea con un valor de ejemplo, para que el pipeline
   no truene):
   - `JWT_SECRET` (cualquier texto largo, ej. `un-secreto-largo-y-random`)
   - `SONAR_TOKEN`, `SONAR_HOST_URL` (los obtienes en el paso 4)
   - `RENDER_SERVICE_ID`, `RENDER_DEPLOY_KEY` (si vas a desplegar de verdad —
     si no, puedes borrar el job `deploy` del archivo `ci-cd.yml` y dejar solo
     `test` y `quality`, que es lo que pide el punto 1.2 como mínimo)
4. Ve a la pestaña **Actions** de tu repo: verás el workflow corriendo
   automáticamente. 📸 **Toma screenshot de la corrida en verde** (o de los
   pasos que sí pasen) — esa es tu evidencia del CI/CD.

## 4. Escaneo de seguridad con OWASP ZAP 📸

1. Con el servidor corriendo (`npm start`, queda en `http://localhost:3000`).
2. Descarga [OWASP ZAP](https://www.zaproxy.org/download/) (gratis).
3. Abre ZAP → **Automated Scan** → pon la URL `http://localhost:3000` →
   **Attack**.
4. Cuando termine, revisa la pestaña **Alerts**: te va a marcar cosas como
   falta de headers de seguridad (`X-Content-Type-Options`, CSP, etc.) porque
   este es un servidor mínimo de ejemplo — eso es normal y es justo lo que
   debes **documentar** en tu informe (qué encontró, qué tan grave es, qué
   harías para arreglarlo, por ejemplo agregar el paquete `helmet`).
5. 📸 **Toma screenshot del reporte de Alerts.**

## 5. Análisis de calidad con SonarQube / SonarCloud 📸

La forma más fácil sin instalar nada pesado es con **SonarCloud** (gratis
para repos públicos):

1. Entra a [sonarcloud.io](https://sonarcloud.io) y conecta tu cuenta de
   GitHub.
2. Importa tu repositorio `alimenta-plus`.
3. SonarCloud te da un `SONAR_TOKEN` — ese es el que pones en los secrets de
   GitHub del paso 3.
4. Ajusta `sonar.organization` y `sonar.projectKey` en
   `sonar-project.properties` con los valores que te dé SonarCloud.
5. Haz un `git push` — el job `quality` del pipeline corre el análisis
   automático.
6. En el dashboard de SonarCloud vas a ver métricas como **deuda técnica
   (technical debt)**, **code smells**, **duplicación de código** y
   **bugs**. 📸 **Toma screenshot del dashboard** — esas métricas son las que
   documentas en tu informe de cierre (punto 2.2).

Si prefieres correrlo local en vez de en la nube, también se puede con
SonarQube Community en Docker (`docker run -d -p 9000:9000 sonarqube`), pero
SonarCloud es más rápido para esta entrega.

## 6. Qué archivos entregar

- Esta carpeta completa (o el link al repo de GitHub).
- Las screenshots de las 4 secciones marcadas con 📸.
- El **informe de cierre** (Word) con la comparación de lo planificado vs.
  lo ejecutado, las lecciones aprendidas y el plan de mejora continua.
