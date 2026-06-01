import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USERS_FEATURE_KEY, UsersState, usersAdapter } from '../state/users.state';

const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUsersState, selectAll);
export const selectUserEntities = createSelector(selectUsersState, selectEntities);
export const selectUsersLoading = createSelector(selectUsersState, (s) => s.loading);
export const selectUsersError = createSelector(selectUsersState, (s) => s.error);

export const selectUserById = (id: string) =>
  createSelector(selectUserEntities, (entities) => entities[id]);
