import { TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';
import { PhoneType } from '../../models/phone-type.enum';
import { User } from '../../models/user.model';

const user: User = {
  id: '1',
  nome: 'Giana Sandrini',
  email: 'giana@attornatus.com.br',
  cpf: '52998224725',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

describe('UserCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();
  });

  it('renders nome and email', () => {
    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    const html: string = fixture.nativeElement.textContent ?? '';
    expect(html).toContain('Giana Sandrini');
    expect(html).toContain('giana@attornatus.com.br');
  });

  it('emits edit when the pencil button is clicked', () => {
    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.edit.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button.edit') as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledWith(user);
  });
});
