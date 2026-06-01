import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() edit = new EventEmitter<User>();

  onEdit(): void {
    this.edit.emit(this.user);
  }
}
