import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models';

const USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin New Teens',
    email: 'admin@newteens.com',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'u2',
    name: 'Ana Souza',
    email: 'ana@newteens.com',
    role: 'member',
    password: 'ana123',
  },
  {
    id: 'u3',
    name: 'Bruno Lima',
    email: 'bruno@newteens.com',
    role: 'member',
    password: 'bruno123',
  },
];

const SESSION_KEY = 'nt_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<Omit<User, 'password'> | null>(this.readSession());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(private readonly router: Router) {}

  login(email: string, password: string): { ok: boolean; message?: string } {
    const found = USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, message: 'E-mail ou senha inválidos.' };
    }

    const { password: _, ...safe } = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    this.currentUserSignal.set(safe);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/login']);
  }

  private readSession(): Omit<User, 'password'> | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Omit<User, 'password'>) : null;
    } catch {
      return null;
    }
  }
}
