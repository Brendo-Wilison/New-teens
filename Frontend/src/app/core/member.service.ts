import { Injectable } from '@angular/core';
import { Member } from './models';

const MEMBERS: Member[] = [
  { id: 'm1', name: 'Ana Souza' },
  { id: 'm2', name: 'Bruno Lima' },
  { id: 'm3', name: 'Carla Mendes' },
  { id: 'm4', name: 'Diego Ferreira' },
  { id: 'm5', name: 'Elena Costa' },
  { id: 'm6', name: 'Felipe Rocha' },
  { id: 'm7', name: 'Gabriela Nunes' },
  { id: 'm8', name: 'Henrique Alves' },
  { id: 'm9', name: 'Isabela Martins' },
  { id: 'm10', name: 'João Pedro Silva' },
];

@Injectable({ providedIn: 'root' })
export class MemberService {
  getAll(): Member[] {
    return [...MEMBERS];
  }

  search(query: string): Member[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.getAll().slice(0, 6);
    }
    return MEMBERS.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8);
  }

  getById(id: string): Member | undefined {
    return MEMBERS.find((m) => m.id === id);
  }
}
