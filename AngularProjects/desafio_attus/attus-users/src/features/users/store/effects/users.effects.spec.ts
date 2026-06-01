import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';

import { UsersEffects } from './users.effects';
import { UsersActions } from '../actions/users.actions';
import { UsersService } from '../../services/users.service';
import { PhoneType } from '../../models/phone-type.enum';
import { User, UserPayload } from '../../models/user.model';

const user: User = {
  id: '1',
  nome: 'João',
  email: 'j@e.com',
  cpf: '12345678900',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

const payload: UserPayload = {
  nome: 'João',
  email: 'j@e.com',
  cpf: '12345678900',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

describe('UsersEffects', () => {
  let actions$: ReplaySubject<unknown>;
  let effects: UsersEffects;
  let service: { list: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    actions$ = new ReplaySubject<unknown>(1);
    service = {
      list: vi.fn().mockReturnValue(of([user])),
      create: vi.fn().mockReturnValue(of(user)),
      update: vi.fn().mockReturnValue(of(user))
    };

    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$ as unknown as Observable<unknown>),
        { provide: UsersService, useValue: service }
      ]
    });

    effects = TestBed.inject(UsersEffects);
  });

  it('dispatches loadUsersSuccess on success', async () => {
    const promise = firstValueFrom(effects.loadUsers$);
    actions$.next(UsersActions.loadUsers({}));
    await expect(promise).resolves.toEqual(UsersActions.loadUsersSuccess({ users: [user] }));
    expect(service.list).toHaveBeenCalledWith(undefined);
  });

  it('passes nome filter to the service', async () => {
    const promise = firstValueFrom(effects.loadUsers$);
    actions$.next(UsersActions.loadUsers({ nome: 'maria' }));
    await promise;
    expect(service.list).toHaveBeenCalledWith('maria');
  });

  it('dispatches loadUsersFailure on error', async () => {
    service.list.mockReturnValueOnce(throwError(() => new Error('network down')));
    const promise = firstValueFrom(effects.loadUsers$);
    actions$.next(UsersActions.loadUsers({}));
    await expect(promise).resolves.toEqual(UsersActions.loadUsersFailure({ error: 'network down' }));
  });

  it('dispatches createUserSuccess on success', async () => {
    const promise = firstValueFrom(effects.createUser$);
    actions$.next(UsersActions.createUser({ payload }));
    await expect(promise).resolves.toEqual(UsersActions.createUserSuccess({ user }));
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('dispatches createUserFailure on error', async () => {
    service.create.mockReturnValueOnce(throwError(() => new Error('boom')));
    const promise = firstValueFrom(effects.createUser$);
    actions$.next(UsersActions.createUser({ payload }));
    await expect(promise).resolves.toEqual(UsersActions.createUserFailure({ error: 'boom' }));
  });

  it('dispatches updateUserSuccess on success', async () => {
    const promise = firstValueFrom(effects.updateUser$);
    actions$.next(UsersActions.updateUser({ id: '1', payload }));
    await expect(promise).resolves.toEqual(UsersActions.updateUserSuccess({ user }));
    expect(service.update).toHaveBeenCalledWith('1', payload);
  });

  it('dispatches updateUserFailure with fallback message when error has no message', async () => {
    service.update.mockReturnValueOnce(throwError(() => ({})));
    const promise = firstValueFrom(effects.updateUser$);
    actions$.next(UsersActions.updateUser({ id: '1', payload }));
    await expect(promise).resolves.toEqual(
      UsersActions.updateUserFailure({ error: 'Falha ao atualizar usuário.' })
    );
  });
});
