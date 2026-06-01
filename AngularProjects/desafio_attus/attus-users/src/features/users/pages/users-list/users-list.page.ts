import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton, MatFabButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { UserCardComponent } from '../../components/user-card/user-card.component';
import { UserFormDialogComponent, UserFormDialogData } from '../../components/user-form-dialog/user-form-dialog.component';
import { UsersActions } from '../../store/actions/users.actions';
import {
  selectAllUsers,
  selectUsersError,
  selectUsersLoading
} from '../../store/selectors/users.selectors';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatIconButton,
    MatFabButton,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    UserCardComponent
  ],
  templateUrl: './users-list.page.html',
  styleUrl: './users-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  readonly users$: Observable<User[]> = this.store.select(selectAllUsers);
  readonly loading$: Observable<boolean> = this.store.select(selectUsersLoading);
  readonly error$: Observable<string | null> = this.store.select(selectUsersError);

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers({}));

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((nome) => {
        this.store.dispatch(UsersActions.loadUsers({ nome: nome.trim() || undefined }));
      });
  }

  openCreateDialog(): void {
    this.dialog.open<UserFormDialogComponent, UserFormDialogData>(UserFormDialogComponent, {
      width: '520px',
      autoFocus: 'first-tabbable',
      data: {}
    });
  }

  openEditDialog(user: User): void {
    this.dialog.open<UserFormDialogComponent, UserFormDialogData>(UserFormDialogComponent, {
      width: '520px',
      autoFocus: 'first-tabbable',
      data: { user }
    });
  }

  trackById(_: number, user: User): string {
    return user.id;
  }
}
