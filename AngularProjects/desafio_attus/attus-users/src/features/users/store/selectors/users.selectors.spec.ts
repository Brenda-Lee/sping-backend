import { usersAdapter, initialUsersState } from '../state/users.state';
import {
  selectAllUsers,
  selectUserById,
  selectUsersError,
  selectUsersLoading
} from './users.selectors';
import { PhoneType } from '../../models/phone-type.enum';
import { User } from '../../models/user.model';

const u1: User = {
  id: '1',
  nome: 'João',
  email: 'j@e.com',
  cpf: '12345678900',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};
const u2: User = { ...u1, id: '2', nome: 'Maria' };

describe('users selectors', () => {
  const state = {
    users: usersAdapter.setAll([u1, u2], { ...initialUsersState, loading: true, error: 'oops' })
  };

  it('selectAllUsers returns all users', () => {
    expect(selectAllUsers(state)).toEqual([u1, u2]);
  });

  it('selectUsersLoading returns the loading flag', () => {
    expect(selectUsersLoading(state)).toBe(true);
  });

  it('selectUsersError returns the error', () => {
    expect(selectUsersError(state)).toBe('oops');
  });

  it('selectUserById returns a user by id', () => {
    expect(selectUserById('2')(state)).toEqual(u2);
  });

  it('selectUserById returns undefined for unknown id', () => {
    expect(selectUserById('999')(state)).toBeUndefined();
  });
});
