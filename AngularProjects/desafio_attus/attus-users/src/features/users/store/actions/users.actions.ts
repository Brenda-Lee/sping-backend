import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User, UserPayload } from '../../models/user.model';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': props<{ nome?: string }>(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Create User': props<{ payload: UserPayload }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    'Update User': props<{ id: string; payload: UserPayload }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Open Create Dialog': emptyProps(),
    'Open Edit Dialog': props<{ user: User }>()
  }
});
