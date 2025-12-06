# 🔄 Plan de Migración a Azure Enterprise

**Versión:** 1.0  
**Fecha:** 2025-12-05  
**Objetivo:** Migración desde stack gratuito a Azure cuando haya presupuesto

---

## 📋 Tabla de Contenidos

1. [Cuándo Migrar a Azure](#cuándo-migrar-a-azure)
2. [Arquitectura Azure Objetivo](#arquitectura-azure-objetivo)
3. [Comparativa de Costos](#comparativa-de-costos)
4. [Plan de Migración Gradual](#plan-de-migración-gradual)
5. [Servicios Azure Recomendados](#servicios-azure-recomendados)
6. [Guía de Migración Paso a Paso](#guía-de-migración-paso-a-paso)
7. [Rollback Plan](#rollback-plan)

---

## Cuándo Migrar a Azure

### Indicadores de que es momento de migrar:

```yaml
Tráfico:
  - >10,000 usuarios activos/mes
  - >1M requests/mes
  - Latencia >2s en stack gratuito
  - Cold starts afectando UX

Data:
  - DB >5GB (límite Supabase free)
  - >100GB storage de archivos
  - Necesidad de backups más robustos

Compliance:
  - Necesidad de SOC 2, ISO 27001
  - HIPAA, GDPR con garantías enterprise
  - Contratos SLA formales (99.95%+)

Equipo:
  - >5 desarrolladores trabajando
  - Necesidad de múltiples ambientes dedicados
  - Cliente enterprise que requiere Azure
```

### Ventajas de migrar a Azure:

✅ **Performance predecible** (no cold starts)  
✅ **SLA 99.95%** con compensación  
✅ **Soporte 24/7** (con plan adecuado)  
✅ **Integración Microsoft** (Azure AD, Office 365)  
✅ **Escalabilidad automática**  
✅ **Geo-replication**  
✅ **Compliance certifications**  

---

## Arquitectura Azure Objetivo

```
┌─────────────────────────────────────────────────────────────┐
│                  Azure Front Door (CDN)                      │
│          SSL, WAF, DDoS Protection, Caching                  │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│ Static Web App  │                  │   API Gateway   │
│   (Frontend)    │                  │  (API Management)│
│   Angular SPA   │                  │  Rate Limit, Auth│
└─────────────────┘                  └─────────────────┘
                                              │
                   ┌──────────────────────────┼──────────────┐
                   ▼                          ▼              ▼
          ┌─────────────────┐      ┌─────────────┐  ┌─────────────┐
          │  App Service    │      │ Container   │  │  Function   │
          │  (Main API)     │      │ Instances   │  │  App (Jobs) │
          │  .NET 8         │      │(Future)     │  │             │
          └─────────────────┘      └─────────────┘  └─────────────┘
                   │
        ┌──────────┴──────────────┬───────────────┬──────────────┐
        ▼                         ▼               ▼              ▼
┌─────────────┐         ┌─────────────┐  ┌─────────────┐  ┌────────────┐
│ Azure SQL   │         │   Redis     │  │Blob Storage │  │Key Vault   │
│ Database    │         │   Cache     │  │ (Images/QR) │  │ (Secrets)  │
└─────────────┘         └─────────────┘  └─────────────┘  └────────────┘
        │
        └──────────────────┐
                           ▼
                  ┌─────────────────┐
                  │ Log Analytics   │
                  │ App Insights    │
                  │ (Monitoring)    │
                  └─────────────────┘
```

---

## Comparativa de Costos

### Stack Actual (Gratuito)

| Servicio | Costo Mensual |
|----------|---------------|
| Vercel (Frontend) | $0 |
| Render (Backend) | $0 |
| Supabase (DB) | $0 |
| GitHub Actions | $0 |
| Sentry | $0 |
| **TOTAL** | **$0/mes** |

**Limitaciones:**
- Cold starts en backend (15s)
- DB limitada a 500MB
- Sin SLA garantizado
- Sin soporte prioritario

---

### Stack Azure (Básico - Startup)

| Servicio | SKU | Especificaciones | Costo/mes |
|----------|-----|------------------|-----------|
| **Static Web Apps** | Standard | CDN, SSL, Custom domains | $9 |
| **App Service** | B1 | 1.75GB RAM, 1 vCPU | $13 |
| **Azure SQL** | Basic | 2GB storage, 5 DTUs | $5 |
| **Redis Cache** | Basic C0 | 250MB | $16 |
| **Application Insights** | - | 5GB ingestion/mes | $0* |
| **Key Vault** | Standard | 10K operations/mes | $0.03 |
| **Blob Storage** | Standard | 50GB LRS | $1 |
| **Azure DevOps** | - | 5 users, pipelines básicos | $0* |
| **TOTAL** | | | **~$44/mes** |

*Incluidos en free tier

**Para qué alcanza:**
- ✅ 50K-100K usuarios/mes
- ✅ 99.9% SLA
- ✅ No cold starts
- ✅ Backups automáticos

---

### Stack Azure (Production - Scale)

| Servicio | SKU | Especificaciones | Costo/mes |
|----------|-----|------------------|-----------|
| **Front Door** | Standard | WAF, DDoS, global CDN | $35 |
| **Static Web Apps** | Standard | Multi-region | $9 |
| **App Service** | S1 | 3.5GB RAM, autoscale 1-3 | $70 |
| **Azure SQL** | S2 | 50GB, 50 DTUs | $75 |
| **Redis Cache** | Standard C1 | 1GB | $56 |
| **API Management** | Developer | API gateway, policies | $50 |
| **Application Insights** | - | 25GB/mes | $58 |
| **Key Vault** | Standard | - | $0.03 |
| **Blob Storage** | Standard | 500GB GRS | $10 |
| **Log Analytics** | - | 10GB/mes | $24 |
| **Backup** | - | DB daily backups | $5 |
| **TOTAL** | | | **~$392/mes** |

**Para qué alcanza:**
- ✅ 500K-1M usuarios/mes
- ✅ 99.95% SLA
- ✅ Geo-redundancia
- ✅ Advanced security
- ✅ 30 días backups

---

### Stack Azure (Enterprise)

| Servicio | SKU | Especificaciones | Costo/mes |
|----------|-----|------------------|-----------|
| **Front Door** | Premium | Advanced WAF, Private Link | $330 |
| **App Service** | P2V3 | 7GB RAM, autoscale 2-10 | $336 |
| **Azure SQL** | P2 | 250GB, 250 DTUs, geo-replication | $726 |
| **Redis Cache** | Premium P1 | 6GB, persistence | $251 |
| **API Management** | Standard | Multi-region, VNET | $700 |
| **Application Insights** | - | 100GB/mes | $230 |
| **Azure AD B2C** | - | 50K MAU | $25 |
| **Otros servicios** | - | Monitoring, backups, scripts | $200 |
| **TOTAL** | | | **~$2,798/mes** |

**Para qué alcanza:**
- ✅ Millones de usuarios
- ✅ 99.99% SLA
- ✅ Multi-región
- ✅ DR completo
- ✅ Soporte 24/7

---

## Plan de Migración Gradual

### Estrategia Recomendada: **Híbrida Progresiva**

No migrar todo de golpe, sino por fases priorizando lo crítico.

### **FASE 0: Preparación (Semana 1)**

```yaml
Objetivo: Preparar infraestructura sin impactar producción

Tareas:
  - Crear Azure subscription
  - Configurar Resource Groups
  - Setup Azure DevOps
  - Crear Azure SQL Database (vacía)
  - Configurar Key Vault
  - Provisionar Static Web App (staging)
  
Costo esta fase: ~$25/mes
Riesgo: Bajo (no afecta producción)
```

---

### **FASE 1: DB Migration (Semana 2)**

```yaml
Objetivo: Migrar de Supabase a Azure SQL

Pasos:
  1. Export data desde Supabase
  2. Import a Azure SQL
  3. Configurar connection strings
  4. Testing en ambiente staging
  5. Sincronización incremental
  6. Cutover en ventana de mantenimiento
  
Costo adicional: +$5-75/mes (según SKU)
Downtime: 2-4 horas
```

**Script de Migración:**

```bash
# 1. Export desde Supabase
pg_dump $SUPABASE_URL > eventor_backup.sql

# 2. Limpiar para Azure SQL
sed -i 's/SERIAL/INT IDENTITY(1,1)/g' eventor_backup.sql

# 3. Import a Azure SQL
sqlcmd -S eventor-sql.database.windows.net -U adminuser -P password -i eventor_backup.sql

# 4. Verificar integridad
SELECT COUNT(*) FROM Events;
SELECT COUNT(*) FROM Users;
SELECT COUNT(*) FROM Tickets;
```

---

### **FASE 2: Backend Migration (Semana 3)**

```yaml
Objetivo: Migrar API de Render a Azure App Service

Pasos:
  1. Crear App Service Plan
  2. Deploy backend a Azure (Blue slot)
  3. Configurar environment variables
  4. Testing exhaustivo en staging
  5. Blue-Green deployment
  6. Monitor performance
  
Costo adicional: +$13-70/mes
Downtime: 0 (blue-green)
```

**Azure DevOps Pipeline:**

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
- stage: Build
  jobs:
  - job: BuildAPI
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'publish'
        publishWebProjects: true
        arguments: '--configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)'
    
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(Build.ArtifactStagingDirectory)'
        ArtifactName: 'drop'

- stage: Deploy
  dependsOn: Build
  jobs:
  - deployment: DeployAPI
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'Azure-Subscription'
              appName: 'eventor-api'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'
              deploymentMethod: 'zipDeploy'
              deployToSlotOrASE: true
              slotName: 'staging'
          
          - task: AzureAppServiceManage@0
            inputs:
              azureSubscription: 'Azure-Subscription'
              action: 'Swap Slots'
              webAppName: 'eventor-api'
              sourceSlot: 'staging'
              targetSlot: 'production'
```

---

### **FASE 3: Frontend Migration (Semana 4)**

```yaml
Objetivo: Migrar de Vercel a Azure Static Web Apps

Pasos:
  1. Deploy a Azure SWA (staging)
  2. Configurar custom domain
  3. SSL certificate
  4. DNS cutover
  5. Verificar edge caching
  
Costo adicional: +$9/mes
Downtime: <5 min (DNS propagation)
```

**GitHub Action para SWA:**

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "frontend"
          api_location: ""
          output_location: "dist/frontend/browser"
```

---

### **FASE 4: Monitoring & Security (Semana 5)**

```yaml
Objetivo: Setup completo de observabilidad

Servicios:
  - Application Insights
  - Log Analytics
  - Azure Monitor Alerts
  - Azure Security Center
  
Costo adicional: +$20-100/mes
```

**Application Insights Setup:**

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    options.EnableAdaptiveSampling = true;
    options.EnableQuickPulseMetricStream = true;
});

// Custom telemetry
var telemetry = app.Services.GetRequiredService<TelemetryClient>();
telemetry.TrackEvent("ApplicationStarted");
```

---

## Servicios Azure Recomendados

### 1. **Azure Static Web Apps** (Frontend)

**Ventajas:**
- Deploy directo desde GitHub
- Edge caching global
- Custom domains + SSL gratis
- Staging environments automáticos
- API routes integradas (opcional)

**Configuración:**

```json
// staticwebapp.config.json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://eventor-api.azurewebsites.net/api/*"
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "*.{css,scss,js,png,jpg,svg}"]
  },
  "globalHeaders": {
    "cache-control": "no-cache"
  },
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

---

### 2. **Azure App Service** (Backend)

**Ventajas:**
- Autoscaling automático
- Deployment slots (blue-green)
- VNET integration
- Always On (no cold starts)
- Heath checks integrados

**Configuración recomendada:**

```yaml
SKU: S1 para production
  - 1.75GB RAM
  - 1 vCPU
  - Autoscale: 1-3 instances
  - Always On: Enabled
  - Health check: /health

Settings:
  - ASPNETCORE_ENVIRONMENT: Production
  - KeyVault__VaultUri: https://eventor-kv.vault.azure.net/
  - ConnectionStrings__DefaultConnection: @Microsoft.KeyVault(...)
```

---

### 3. **Azure SQL Database**

**Ventajas:**
- Backups automáticos (7-35 días)
- Point-in-time restore
- Geo-replication
- Automatic tuning
- Query performance insights

**Tiers recomendados:**

```yaml
Desarrollo/QA:
  - Basic: $5/mes
  - 2GB storage
  - 5 DTUs

Producción pequeña:
  - S2: $75/mes
  - 50GB storage
  - 50 DTUs
  - Geo-backup

Producción media:
  - P2: $726/mes
  - 250GB storage
  - 250 DTUs
  - Geo-replication activa
```

**Connection String con Managed Identity:**

```csharp
// Usar Managed Identity (no passwords!)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null
        );
    });
});
```

---

### 4. **Azure Redis Cache**

**Ventajas:**
- Data persistence
- Clustering (Premium tier)
- Geo-replication
- Import/Export
- SSL encryption

**Uso:**

```csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = "Eventor";
});

// Usage
await _cache.SetStringAsync("events:all", jsonEvents, new DistributedCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
});
```

---

### 5. **Azure Key Vault**

**Ventajas:**
- HSM-backed keys
- Secret rotation
- Access policies granulares
- Audit logging

**Setup:**

```csharp
// Program.cs
var keyVaultUri = new Uri(builder.Configuration["KeyVault:VaultUri"]);
builder.Configuration.AddAzureKeyVault(keyVaultUri, new DefaultAzureCredential());

// Secrets se acceden como config normal
var jwtSecret = builder.Configuration["JwtSettings--SecretKey"]; // Note: -- not :
```

---

## Guía de Migración Paso a Paso

### Pre-Migración Checklist

```markdown
- [ ] Crear Azure subscription
- [ ] Configurar billing alerts
- [ ] Documentar arquitectura actual
- [ ] Hacer backup completo de DB
- [ ] Notificar a usuarios (ventana de mantenimiento)
- [ ] Preparar rollback plan
- [ ] Setup monitoring en Azure
```

### Migración de Base de Datos

**Opción 1: Azure Data Migration Service (Recomendado)**

```bash
# 1. Install Azure Data Studio
# 2. Añadir extensión "Azure SQL Migration"
# 3. Conectar a Supabase (source)
# 4. Conectar a Azure SQL (target)
# 5. Wizard guiado

# Ventajas:
# - GUI amigable
# - Validación de schema
# - Migración online (sin downtime)
```

**Opción 2: Manual con scripts**

```sql
-- En Supabase
pg_dump --host=db.xxx.supabase.co \
        --port=5432 \
        --username=postgres \
        --dbname=postgres \
        --file=eventor_dump.sql

-- Modificar dump para Azure SQL
-- Reemplazar tipos PostgreSQL por SQL Server
sed -i 's/uuid_generate_v4()/NEWID()/g' eventor_dump.sql
sed -i 's/SERIAL/INT IDENTITY(1,1)/g' eventor_dump.sql
sed -i 's/BOOLEAN/BIT/g' eventor_dump.sql

-- Importar a Azure SQL
sqlcmd -S eventor-sql.database.windows.net \
       -U adminuser \
       -P $PASSWORD \
       -d Eventor \
       -i eventor_dump.sql
```

---

### Cutover Plan (Go-Live)

**Timeline del Cutover:**

```
T-24h:  Notificar usuarios
T-2h:   Freeze code (no deploys)
T-1h:   Última backup de Supabase
T-0:    Poner app en modo mantenimiento
T+10m:  Sync final de datos
T+20m:  Cambiar connection strings a Azure SQL
T+30m:  Deploy nuevo backend a Azure App Service
T+40m:  Cambiar DNS a Azure Static Web App
T+50m:  Smoke tests
T+1h:   Quitar modo mantenimiento
T+2h:   Monitoreo intensivo
```

**Modo Mantenimiento:**

```html
<!-- public/maintenance.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Eventor - Mantenimiento</title>
</head>
<body>
  <h1>🔧 Mejorando Eventor para ti</h1>
  <p>Estaremos de vuelta en aproximadamente 1 hora.</p>
  <p>Gracias por tu paciencia.</p>
</body>
</html>
```

---

## Rollback Plan

### Si algo sale mal durante la migración:

**Scenario 1: DB migration fails**

```bash
# Inmediato rollback a Supabase
# 1. Revertir connection string en backend
# 2. Redeploy backend a Render
# 3. Verificar que todo funciona

# Tiempo estimado: 15 minutos
```

**Scenario 2: Backend deployment fails**

```bash
# Azure tiene slot staging
az webapp deployment slot swap \
  --name eventor-api \
  --resource-group eventor-prod \
  --slot staging \
  --target-slot production \
  --action swap

# Revierte a última versión estable en <1 minuto
```

**Scenario 3: Frontend issues**

```bash
# DNS rollback
# 1. Cambiar CNAME de vuelta a Vercel
# 2. Esperar propagación (5-10 min)

# O usar Azure Traffic Manager para split traffic
# 90% Vercel, 10% Azure → 50/50 → 10/90 → 100% Azure
```

---

## Costos Ocultos a Considerar

```yaml
Desarrollo:
  - Tiempo de migración: 2-3 semanas dev time
  - Testing en Azure: $50-100 en ambiente staging
  
Operaciones:
  - Training del equipo en Azure: ~20 horas
  - Soporte Azure (si se contrata): $29-100/mes
  
Networking:
  - Bandwidth egress: $0.08/GB (primeros 100GB gratis/mes)
  - DNS queries (si usas Azure DNS): $0.50/1M queries
  
Seguridad:
  - Azure AD Premium (si se requiere): $6/user/mes
  - DDoS Protection Standard: $2,944/mes (solo enterprise)
```

---

## Conclusión y Recomendación

### Migra a Azure cuando:

✅ Tengas >50K usuarios activos/mes  
✅ Necesites SLA de 99.95%+  
✅ Cliente enterprise lo requiera  
✅ DB >5GB  
✅ Presupuesto >$100/mes  

### Mantente en stack gratuito si:

❌ <10K usuarios/mes  
❌ MVP/validación de mercado  
❌ Startup bootstrap  
❌ Presupuesto limitado  

**La transición debe ser gradual, no de golpe.**

---

## Recursos

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Azure Migration Center](https://azure.microsoft.com/migration/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/architecture/framework/)

---

**Siguiente paso:** Revisar con equipo financiero si hay presupuesto para migración.
