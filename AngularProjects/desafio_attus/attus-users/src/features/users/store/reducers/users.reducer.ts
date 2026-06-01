import { createReducer, on } from '@ngrx/store';

import { UsersActions } from '../actions/users.actions';
import { initialUsersState, usersAdapter } from '../state/users.state';

export const usersReducer = createReducer(
  initialUsersState,

  on(UsersActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loading: false, error: null })
  ),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UsersActions.createUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.createUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, { ...state, loading: false, error: null })
  ),
  on(UsersActions.createUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UsersActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.upsertOne(user, { ...state, loading: false, error: null })
  ),
  on(UsersActions.updateUserFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
