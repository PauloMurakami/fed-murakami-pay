import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { jwtInterceptor } from './app/interceptors/jwt.interceptor';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor, authInterceptor]) // Registra o interceptor funcional
    ),
    provideRouter(routes), // Suas rotas aqui
  ],
}).catch((err) => console.error(err));
