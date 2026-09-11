import { Injectable, signal, computed } from '@angular/core';
import { RankingEntry, Visitor } from './models';
import { MemberService } from './member.service';

const STORAGE_KEY = 'nt_visitors';

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private readonly visitorsSignal = signal<Visitor[]>(this.load());

  readonly visitors = this.visitorsSignal.asReadonly();
  readonly total = computed(() => this.visitorsSignal().length);

  readonly ranking = computed<RankingEntry[]>(() => {
    const counts = new Map<string, { name: string; count: number }>();

    for (const v of this.visitorsSignal()) {
      const current = counts.get(v.invitedById) ?? { name: v.invitedByName, count: 0 };
      current.count += 1;
      counts.set(v.invitedById, current);
    }

    return [...counts.entries()]
      .map(([memberId, data]) => ({
        memberId,
        memberName: data.name,
        count: data.count,
        position: 0,
      }))
      .sort((a, b) => b.count - a.count || a.memberName.localeCompare(b.memberName))
      .map((entry, index) => ({ ...entry, position: index + 1 }));
  });

  constructor(private readonly members: MemberService) {}

  add(input: {
    name: string;
    age: number;
    invitedById: string;
    createdBy: string;
  }): Visitor {
    const member = this.members.getById(input.invitedById);
    if (!member) {
      throw new Error('Integrante não encontrado.');
    }

    const visitor: Visitor = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      age: input.age,
      invitedById: member.id,
      invitedByName: member.name,
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy,
    };

    const next = [visitor, ...this.visitorsSignal()];
    this.visitorsSignal.set(next);
    this.persist(next);
    return visitor;
  }

  private load(): Visitor[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Visitor[]) : [];
    } catch {
      return [];
    }
  }

  private persist(list: Visitor[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}
