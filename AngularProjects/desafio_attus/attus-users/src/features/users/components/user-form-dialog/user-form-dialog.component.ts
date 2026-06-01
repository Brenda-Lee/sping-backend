import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';

import { UsersActions } from '../../store/actions/users.actions';
import { User, UserPayload } from '../../models/user.model';
import { PhoneType } from '../../models/phone-type.enum';
import { cpfValidator } from '../../../../shared/validators/cpf.validator';

export interface UserFormDialogData {
  user?: User;
}

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA, { optional: true }) ?? {};

  readonly phoneTypes = [
    { value: PhoneType.CELULAR, label: 'Celular' },
    { value: PhoneType.FIXO, label: 'Fixo' }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator]],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    tipoTelefone: [PhoneType.CELULAR, Validators.required]
  });

  get isEditMode(): boolean {
    return !!this.data.user;
  }

  get cpfMask(): string {
    return '000.000.000-00';
  }

  get telefoneMask(): string {
    return this.form.controls.tipoTelefone.value === PhoneType.FIXO
      ? '(00) 0000-0000'
      : '(00) 00000-0000';
  }

  ngOnInit(): void {
    if (this.data.user) {
      const { id: _id, ...rest } = this.data.user;
      this.form.patchValue(rest);
    }

    this.actions$
      .pipe(
        ofType(UsersActions.createUserSuccess, UsersActions.updateUserSuccess),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UserPayload = this.form.getRawValue();

    if (this.data.user) {
      this.store.dispatch(UsersActions.updateUser({ id: this.data.user.id, payload }));
    } else {
      this.store.dispatch(UsersActions.createUser({ payload }));
    }
  }
}
