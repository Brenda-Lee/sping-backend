import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { UsersListPage } from './users-list.page';
import { UsersActions } from '../../store/actions/users.actions';
import {
  selectAllUsers,
  selectUsersError,
  selectUsersLoading
} from '../../store/selectors/users.selectors';
import { PhoneType } from '../../models/phone-type.enum';
import { User } from '../../models/user.model';

const user: User = {
  id: '1',
  nome: 'Giana',
  email: 'g@e.com',
  cpf: '52998224725',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

describe('UsersListPage', () => {
  let store: MockStore;
  let dialogOpen: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    dialogOpen = vi.fn();
    await TestBed.configureTestingModule({
      imports: [UsersListPage],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllUsers, value: [user] },
            { selector: selectUsersLoading, value: false },
            { selector: selectUsersError, value: null }
          ]
        }),
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
  });

  it('dispatches loadUsers on init', () => {
    const fixture = TestBed.createComponent(UsersListPage);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers({}));
  });

  it('debounces the search input and dispatches loadUsers with nome', fakeAsync(() => {
    const fixture = TestBed.createComponent(UsersListPage);
    fixture.detectChanges();
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.componentInstance.searchControl.setValue('mar');
    tick(150);
    expect(store.dispatch).not.toHaveBeenCalled();

    tick(200);
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers({ nome: 'mar' }));
  }));

  it('emits undefined when search is cleared', fakeAsync(() => {
    const fixture = TestBed.createComponent(UsersListPage);
    fixture.detectChanges();
    fixture.componentInstance.searchControl.setValue('mar');
    tick(300);
    (store.dispatch as ReturnType<typeof vi.fn>).mockClear();

    fixture.componentInstance.searchControl.setValue('   ');
    tick(300);
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers({ nome: undefined }));
  }));

  it('opens dialog on FAB click', () => {
    const fixture = TestBed.createComponent(UsersListPage);
    fixture.detectChanges();
    fixture.componentInstance.openCreateDialog();
    expect(dialogOpen).toHaveBeenCalled();
    const args = dialogOpen.mock.calls[0];
    expect(args[1].data).toEqual({});
  });

  it('opens dialog on edit with user pre-filled', () => {
    const fixture = TestBed.createComponent(UsersListPage);
    fixture.detectChanges();
    fixture.componentInstance.openEditDialog(user);
    const args = dialogOpen.mock.calls[0];
    expect(args[1].data).toEqual({ user });
  });
});
