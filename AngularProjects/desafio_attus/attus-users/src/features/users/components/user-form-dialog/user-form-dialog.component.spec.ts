import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { Observable, ReplaySubject } from 'rxjs';

import { UserFormDialogComponent } from './user-form-dialog.component';
import { UsersActions } from '../../store/actions/users.actions';
import { PhoneType } from '../../models/phone-type.enum';
import { User } from '../../models/user.model';

const baseUser: User = {
  id: '1',
  nome: 'Giana Sandrini',
  email: 'giana@attornatus.com.br',
  cpf: '52998224725',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

const validValues = {
  email: 'giana@attornatus.com.br',
  nome: 'Giana Sandrini',
  cpf: '52998224725',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

function setup(data: { user?: User } = {}) {
  const actions$ = new ReplaySubject<unknown>(1);
  const dialogRef = { close: vi.fn() };

  TestBed.configureTestingModule({
    imports: [UserFormDialogComponent],
    providers: [
      provideEnvironmentNgxMask(),
      provideMockStore(),
      provideMockActions(() => actions$ as unknown as Observable<unknown>),
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data }
    ]
  });

  const fixture = TestBed.createComponent(UserFormDialogComponent);
  const store = TestBed.inject(MockStore);
  vi.spyOn(store, 'dispatch');
  fixture.detectChanges();
  return { fixture, store, actions$, dialogRef };
}

describe('UserFormDialogComponent', () => {
  it('starts invalid with empty form', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });

  it('becomes valid when all required fields are filled correctly', () => {
    const { fixture } = setup();
    fixture.componentInstance.form.setValue(validValues);
    expect(fixture.componentInstance.form.valid).toBe(true);
  });

  it('flags invalid email', () => {
    const { fixture } = setup();
    fixture.componentInstance.form.controls.email.setValue('not-an-email');
    expect(fixture.componentInstance.form.controls.email.hasError('email')).toBe(true);
  });

  it('flags invalid CPF', () => {
    const { fixture } = setup();
    fixture.componentInstance.form.controls.cpf.setValue('12345678900');
    expect(fixture.componentInstance.form.controls.cpf.hasError('cpfInvalid')).toBe(true);
  });

  it('pre-fills the form when editing', () => {
    const { fixture } = setup({ user: baseUser });
    expect(fixture.componentInstance.isEditMode).toBe(true);
    expect(fixture.componentInstance.form.value).toMatchObject({
      email: baseUser.email,
      nome: baseUser.nome,
      cpf: baseUser.cpf,
      telefone: baseUser.telefone,
      tipoTelefone: baseUser.tipoTelefone
    });
  });

  it('dispatches createUser when submitting a valid new form', () => {
    const { fixture, store } = setup();
    fixture.componentInstance.form.setValue(validValues);
    fixture.componentInstance.submit();
    expect(store.dispatch).toHaveBeenCalledWith(
      UsersActions.createUser({ payload: validValues })
    );
  });

  it('dispatches updateUser when submitting in edit mode', () => {
    const { fixture, store } = setup({ user: baseUser });
    fixture.componentInstance.form.patchValue({ nome: 'Giana Atualizada' });
    fixture.componentInstance.submit();
    expect(store.dispatch).toHaveBeenCalledWith(
      UsersActions.updateUser({
        id: baseUser.id,
        payload: { ...validValues, nome: 'Giana Atualizada' }
      })
    );
  });

  it('does not dispatch when form is invalid', () => {
    const { fixture, store } = setup();
    fixture.componentInstance.submit();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.controls.email.touched).toBe(true);
  });

  it('closes the dialog on createUserSuccess', () => {
    const { actions$, dialogRef } = setup();
    actions$.next(UsersActions.createUserSuccess({ user: baseUser }));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes the dialog on updateUserSuccess', () => {
    const { actions$, dialogRef } = setup({ user: baseUser });
    actions$.next(UsersActions.updateUserSuccess({ user: baseUser }));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('switches telefoneMask based on tipoTelefone', () => {
    const { fixture } = setup();
    fixture.componentInstance.form.controls.tipoTelefone.setValue(PhoneType.FIXO);
    expect(fixture.componentInstance.telefoneMask).toBe('(00) 0000-0000');
    fixture.componentInstance.form.controls.tipoTelefone.setValue(PhoneType.CELULAR);
    expect(fixture.componentInstance.telefoneMask).toBe('(00) 00000-0000');
  });
});
