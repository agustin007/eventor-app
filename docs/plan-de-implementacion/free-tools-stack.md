# 💰 Stack de Herramientas 100% Gratuitas

**Versión:** 1.0  
**Fecha:** 2025-12-05  
**Objetivo:** Stack enterprise-grade completamente gratuito

---

## 📋 Índice

1. [Hosting & Infraestructura](#hosting--infraestructura)
2. [CI/CD](#cicd)
3. [Monitoreo & Logs](#monitoreo--logs)
4. [Testing](#testing)
5. [Security](#security)
6. [Bases de Datos](#bases-de-datos)
7. [Desarrollo](#desarrollo)

---

## Hosting & Infraestructura

### Frontend Hosting

#### **Opción 1: Vercel (Recomendada) ⭐**

```yaml
Límites Gratuitos:
  - Bandwidth: 100GB/mes
  - Deployments: Ilimitados
  - Build time: 100 horas/mes
  - Team members: 1
  - Dominios custom: Ilimitados
  - SSL: Automático

Perfecto para:
  - Angular SPA
  - Preview deployments automáticos
  - Edge network global
```

**Setup:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/frontend/browser",
  "devCommand": "npm start",
  "framework": "angular",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

#### **Opción 2: Netlify**

```yaml
Límites Gratuitos:
  - Bandwidth: 100GB/mes
  - Build minutes: 300/mes
  - Sites: 500
  - Forms: 100 submissions/mes
  
Perfecto para:
  - Sites estáticos
  - Forms sin backend
```

---

#### **Opción 3: GitHub Pages**

```yaml
Límites:
  - Storage: 1GB
  - Bandwidth: 100GB/mes
  - 10 builds/hora

Perfecto para:
  - Proyectos open source
  - Documentación
```

**Setup:**
```bash
# angular.json - agregar base href
"build": {
  "options": {
    "baseHref": "/eventor/"
  }
}

# Deploy
ng build --configuration=production
npx angular-cli-ghpages --dir=dist/frontend/browser
```

---

### Backend Hosting

#### **Opción 1: Render.com (Recomendada) ⭐**

```yaml
Free Tier:
  - RAM: 512MB
  - CPU: Shared
  - Bandwidth: 100GB/mes
  - Instance spins down after inactivity
  - Auto-redeploy on git push
  - SSL gratis

Limitación:
  - Cold start (15seg) cuando inactive
  - 1 free instance por tipo
```

**Setup:**
```yaml
# render.yaml
services:
  - type: web
    name: eventor-api
    env: dotnet
    buildCommand: dotnet publish -c Release -o out
    startCommand: dotnet out/EventosCba.API.dll
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: ConnectionStrings__DefaultConnection
        sync: false  # Secret en dashboard
```

---

#### **Opción 2: Railway.app**

```yaml
Free Tier:
  - $5 credits/mes
  - Approx 500 horas uptime
  - 1GB RAM
  - 1GB storage
  
Ventaja:
  - PostgreSQL/Redis incluido
  - No cold starts
```

---

#### **Opción 3: Fly.io**

```yaml
Free Allowances:
  - 3 VMs compartidas
  - 256MB RAM cada una
  - 3GB storage
  - 160GB bandwidth
  
Perfecto para:
  - Múltiples micro servicios
  - Deployment global (edge)
```

---

## CI/CD

### **GitHub Actions (Recomendada) ⭐**

```yaml
Free Tier:
  - Repositorios públicos: Ilimitado
  - Repositorios privados: 2000 minutos/mes
  - Storage: 500MB artifacts
  - Concurrent jobs: 20
  
Suficiente para:
  - 10-15 deployments/día
  - Tests completos
```

**Tip para ahorrar minutos:**
```yaml
# Solo correr tests en PRs, no en cada push
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]  # Solo main
```

---

### Alternativas

#### **GitLab CI/CD**
- 400 minutos/mes gratis
- 5GB storage
- 10 concurrent jobs

#### **CircleCI**
- 6000 build minutes/mes
- 1 concurrent job
- Open source: GRATIS ilimitado

---

## Monitoreo & Logs

### Application Monitoring

#### **Opción 1: Sentry (Recomendada) ⭐**

```yaml
Free Tier:
  - 5000 errors/mes
  - 10,000 performance transactions/mes
  - 1 proyecto
  - 7 días retención
  - Unlimited users

Perfecto para:
  - Error tracking
  - Performance monitoring
  - Source maps
```

**Setup Frontend:**
```typescript
// main.ts
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  environment: 'production'
});
```

**Setup Backend:**
```csharp
// Program.cs
builder.WebHost.UseSentry(o => {
    o.Dsn = "https://xxx@sentry.io/xxx";
    o.TracesSampleRate = 1.0;
});
```

---

#### **Opción 2: LogRocket**

```yaml
Free Tier:
  - 1000 sessions/mes
  - 1 proyecto
  - Session replay
  - Console logs
```

---

### Logging

#### **Seq (Self-hosted GRATIS) ⭐**

```yaml
Características:
  - Structured logging
  - Búsqueda avanzada
  - Dashboards
  - Alertas
  
Costo:
  - GRATIS para single-user
  - Docker container
```

**docker-compose.yml:**
```yaml
version: '3'
services:
  seq:
    image: datalust/seq:latest
    environment:
      ACCEPT_EULA: Y
    ports:
      - 5341:80
    volumes:
      - ./seq-data:/data
```

**Backend Integration:**
```csharp
builder.Services.AddSerilog((services, lc) => lc
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341")
);
```

---

#### **Alternativa: Better Stack (ex Logtail)**

```yaml
Free Tier:
  - 1GB logs/mes
  - 3 días retención
  - Live tail
  - Alertas
```

---

## Testing

### **Playwright (Recomendado) ⭐**

```yaml
Costo: GRATIS (open source)
Features:
  - Cross-browser testing
  - Auto-waiting
  - Screenshots/videos
  - Trace viewer
  - Parallelización
```

**Setup:**
```bash
npm init playwright@latest
```

**Ejemplo:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.fill('[name="email"]', 'test@eventor.com');
  await page.fill('[name="password"]', 'Test@123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*discover/);
});
```

---

### **Vitest (Unit Tests)**

```yaml
Costo: GRATIS
Ventajas vs Jest:
  - 10-20x más rápido
  - Compatible con Vite
  - Hot reload
  - Coverage integrado
```

---

## Security

### **Snyk (Recomendada) ⭐**

```yaml
Free Tier:
  - Unlimited tests
  - 200 tests/mes (open source)
  - Dependency scanning
  - Container scanning
  - IaC scanning

Integración:
  - GitHub Actions
  - VS Code extension
  - CLI
```

**GitHub Action:**
```yaml
- name: Run Snyk
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

### **Trivy**

```yaml
Costo: GRATIS (open source)
Features:
  - Vulnerability scanning
  - Misconfigurations
  - Secrets detection
  - License scanning
```

---

### **OWASP Dependency-Check**

```yaml
Costo: GRATIS
Para: .NET dependencies
```

---

## Bases de Datos

### **Opción 1: Supabase (Recomendada) ⭐**

```yaml
Free Tier:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - 50,000 autenticaciones/mes
  - Realtime subscriptions
  - Auto backups (7 días)

Stack:
  - PostgreSQL
  - Auth built-in
  - Storage (S3-compatible)
  - Realtime (websockets)
```

**Perfecto para:**
- Reemplazar SQL Server
- Auth OAuth
- File uploads (QR codes, imágenes)

**Migración:**
```sql
-- Export desde SQL Server
-- Import a Supabase PostgreSQL

-- Cambiar connection string
"DefaultConnection": "postgresql://user:pass@db.supabase.co:5432/postgres"
```

---

### **Opción 2: PlanetScale**

```yaml
Free Tier:
  - 5GB storage
  - 1 billion row reads/mes
  - 10 million row writes/mes
  - Daily backups
  
Stack:
  - MySQL serverless
  - Branching (como Git)
```

---

### **Opción 3: Neon (PostgreSQL Serverless)**

```yaml
Free Tier:
  - 512MB RAM
  - 3GB storage
  - Autoscaling
  - Instant cold starts
```

---

## Desarrollo

### **IDEs**

#### **VS Code (Recomendado)**
- GRATIS
- Extensions recomendadas:
  - Angular Language Service
  - Prettier
  - ESLint
  - GitLens
  - Thunder Client (Postman alternative)

---

### **API Testing**

#### **Bruno (Recomendado) ⭐**
```yaml
Costo: GRATIS (open source)
Ventajas vs Postman:
  - Git-friendly (archivos .bru)
  - No cloud sync necesario
  - Lightweight
  - Collections versionadas
```

---

#### **HTTP Client (VS Code built-in)**
```http
### GET Events
GET http://localhost:5256/api/events

### POST Login
POST http://localhost:5256/api/auth/login
Content-Type: application/json

{
  "email": "test@eventor.com",
  "password": "Test@123"
}
```

---

## Stack Recomendado Final

```yaml
Frontend:
  Hosting: Vercel
  Monitoring: Sentry
  Analytics: Google Analytics (gratis)

Backend:
  Hosting: Render.com
  Database: Supabase (PostgreSQL)
  Logging: Seq (self-hosted) + Sentry

CI/CD:
  Pipeline: GitHub Actions
  Security: Snyk + Trivy

Testing:
  E2E: Playwright
  Unit: Vitest
  API: Bruno

Desarrollo:
  IDE: VS Code
  API Testing: Bruno
  DB Admin: Supabase Studio
```

---

## Costos Mensuales Estimados

```
Frontend (Vercel)        $0
Backend (Render)         $0
Database (Supabase)      $0
CI/CD (GitHub Actions)   $0
Monitoring (Sentry)      $0
Testing (Playwright)     $0
Security (Snyk)          $0
Logs (Seq self-hosted)   $0

TOTAL                    $0/mes
```

**Cuando crezcas (>10k usuarios):**

```
Vercel Pro               $20/mes
Render Standard          $7/mes
Supabase Pro             $25/mes

TOTAL                    ~$52/mes
```

---

## Setup Completo

**Archivo: `.github/workflows/ci-cd-free.yml`**

```yaml
name: CI/CD Free Stack

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Frontend tests
      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm run test:ci
          npm run build
      
      # Backend tests
      - name: Test Backend
        run: |
          cd backend
          dotnet test
      
      # Security scan
      - name: Snyk Security
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
  
  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

**Próximo:** `implementation-checklist.md`
