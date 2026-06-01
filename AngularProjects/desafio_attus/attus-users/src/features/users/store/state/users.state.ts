import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { User } from '../../models/user.model';

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

export const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id
});

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null
});

export const USERS_FEATURE_KEY = 'users';
