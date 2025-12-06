import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from "@sentry/angular";

// Initialize Sentry
Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0", // TODO: Reemplazar con DSN real
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of errors
  environment: 'development', // Cambiar a 'production' en prod
  enabled: true, // Cambiar a false en desarrollo local si no quieres enviar datos
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
