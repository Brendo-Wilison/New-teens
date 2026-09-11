import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { MemberService } from '../../core/member.service';
import { VisitorService } from '../../core/visitor.service';
import { Member } from '../../core/models';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.scss',
})
export class VisitorsComponent {
  private readonly auth = inject(AuthService);
  private readonly members = inject(MemberService);
  private readonly visitors = inject(VisitorService);
  private readonly inviteInput = viewChild<ElementRef<HTMLInputElement>>('inviteInput');

  name = '';
  age: number | null = null;
  inviteQuery = '';
  selectedMember: Member | null = null;

  readonly suggestions = signal<Member[]>([]);
  readonly showSuggestions = signal(false);
  readonly success = signal('');
  readonly error = signal('');
  readonly saving = signal(false);

  readonly recent = this.visitors.visitors;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const input = this.inviteInput()?.nativeElement;
    if (input && !input.contains(event.target as Node)) {
      const panel = document.querySelector('.visitors__suggestions');
      if (panel && panel.contains(event.target as Node)) {
        return;
      }
      this.showSuggestions.set(false);
    }
  }

  onInviteFocus(): void {
    this.suggestions.set(this.members.search(this.inviteQuery));
    this.showSuggestions.set(true);
  }

  onInviteInput(): void {
    if (this.selectedMember && this.inviteQuery !== this.selectedMember.name) {
      this.selectedMember = null;
    }
    this.suggestions.set(this.members.search(this.inviteQuery));
    this.showSuggestions.set(true);
  }

  pickMember(member: Member): void {
    this.selectedMember = member;
    this.inviteQuery = member.name;
    this.showSuggestions.set(false);
  }

  submit(): void {
    this.success.set('');
    this.error.set('');

    if (!this.name.trim()) {
      this.error.set('Informe o nome do visitante.');
      return;
    }
    if (this.age === null || this.age < 1 || this.age > 120) {
      this.error.set('Informe uma idade válida.');
      return;
    }
    if (!this.selectedMember) {
      this.error.set('Selecione quem convidou na lista.');
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.error.set('Sessão expirada. Faça login novamente.');
      return;
    }

    this.saving.set(true);
    window.setTimeout(() => {
      try {
        this.visitors.add({
          name: this.name,
          age: this.age!,
          invitedById: this.selectedMember!.id,
          createdBy: user.name,
        });
        this.success.set(`Visitante ${this.name.trim()} salvo com sucesso!`);
        this.name = '';
        this.age = null;
        this.inviteQuery = '';
        this.selectedMember = null;
      } catch (e) {
        this.error.set(e instanceof Error ? e.message : 'Erro ao salvar.');
      } finally {
        this.saving.set(false);
      }
    }, 350);
  }
}
