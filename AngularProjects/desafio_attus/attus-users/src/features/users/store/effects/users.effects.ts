import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { UsersActions } from '../actions/users.actions';
import { UsersService } from '../../services/users.service';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersService = inject(UsersService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(({ nome }) =>
        this.usersService.list(nome).pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((err: unknown) =>
            of(UsersActions.loadUsersFailure({ error: toMessage(err, 'Falha ao carregar usuários.') }))
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      exhaustMap(({ payload }) =>
        this.usersService.create(payload).pipe(
          map((user) => UsersActions.createUserSuccess({ user })),
          catchError((err: unknown) =>
            of(UsersActions.createUserFailure({ error: toMessage(err, 'Falha ao criar usuário.') }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ id, payload }) =>
        this.usersService.update(id, payload).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),
          catchError((err: unknown) =>
            of(UsersActions.updateUserFailure({ error: toMessage(err, 'Falha ao atualizar usuário.') }))
          )
        )
      )
    )
  );
}

function toMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return fallback;
}
