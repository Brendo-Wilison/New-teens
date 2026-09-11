import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly error = signal('');
  readonly loading = signal(false);

  submit(): void {
    this.error.set('');
    this.loading.set(true);

    window.setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.loading.set(false);

      if (!result.ok) {
        this.error.set(result.message ?? 'Falha no login.');
        return;
      }

      void this.router.navigate(['/visitantes']);
    }, 450);
  }
}
