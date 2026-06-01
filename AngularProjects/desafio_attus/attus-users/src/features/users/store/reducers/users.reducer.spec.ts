import { usersReducer } from './users.reducer';
import { initialUsersState, usersAdapter } from '../state/users.state';
import { UsersActions } from '../actions/users.actions';
import { PhoneType } from '../../models/phone-type.enum';
import { User } from '../../models/user.model';

const user: User = {
  id: '1',
  nome: 'João',
  email: 'joao@email.com',
  cpf: '12345678900',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

const user2: User = { ...user, id: '2', nome: 'Maria' };

describe('usersReducer', () => {
  it('returns initial state for unknown action', () => {
    const state = usersReducer(undefined, { type: 'NOOP' } as never);
    expect(state).toBe(initialUsersState);
  });

  it('sets loading on loadUsers', () => {
    const state = usersReducer(initialUsersState, UsersActions.loadUsers({}));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores users on loadUsersSuccess', () => {
    const state = usersReducer(initialUsersState, UsersActions.loadUsersSuccess({ users: [user, user2] }));
    expect(state.loading).toBe(false);
    expect(state.ids.length).toBe(2);
    expect(state.entities['1']).toEqual(user);
  });

  it('replaces existing users on loadUsersSuccess (setAll)', () => {
    const seeded = usersAdapter.setAll([user], initialUsersState);
    const state = usersReducer(seeded, UsersActions.loadUsersSuccess({ users: [user2] }));
    expect(state.ids).toEqual(['2']);
  });

  it('captures error on loadUsersFailure', () => {
    const state = usersReducer(
      { ...initialUsersState, loading: true },
      UsersActions.loadUsersFailure({ error: 'boom' })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('boom');
  });

  it('adds new user on createUserSuccess', () => {
    const state = usersReducer(initialUsersState, UsersActions.createUserSuccess({ user }));
    expect(state.entities['1']).toEqual(user);
  });

  it('upserts user on updateUserSuccess', () => {
    const seeded = usersAdapter.setAll([user], initialUsersState);
    const updated: User = { ...user, nome: 'João Atualizado' };
    const state = usersReducer(seeded, UsersActions.updateUserSuccess({ user: updated }));
    expect(state.entities['1']?.nome).toBe('João Atualizado');
  });

  it('captures error on createUserFailure', () => {
    const state = usersReducer(initialUsersState, UsersActions.createUserFailure({ error: 'x' }));
    expect(state.error).toBe('x');
  });

  it('captures error on updateUserFailure', () => {
    const state = usersReducer(initialUsersState, UsersActions.updateUserFailure({ error: 'y' }));
    expect(state.error).toBe('y');
  });
});
