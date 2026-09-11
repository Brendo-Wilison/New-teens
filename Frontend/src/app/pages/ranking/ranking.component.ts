import { Component, computed, inject } from '@angular/core';
import { VisitorService } from '../../core/visitor.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent {
  private readonly visitors = inject(VisitorService);

  readonly ranking = this.visitors.ranking;
  readonly total = this.visitors.total;
  readonly topCount = computed(() => this.ranking()[0]?.count ?? 0);
  readonly leaders = computed(() => this.ranking().slice(0, 3));
  readonly rest = computed(() => this.ranking().slice(3));

  barWidth(count: number): string {
    const max = this.topCount() || 1;
    return `${Math.max(12, Math.round((count / max) * 100))}%`;
  }

  medal(position: number): string {
    if (position === 1) return '1º';
    if (position === 2) return '2º';
    if (position === 3) return '3º';
    return `${position}º`;
  }
}
