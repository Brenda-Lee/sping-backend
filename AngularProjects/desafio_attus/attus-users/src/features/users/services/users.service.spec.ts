import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import { PhoneType } from '../models/phone-type.enum';
import { User, UserPayload } from '../models/user.model';

const BASE = 'http://localhost:3000/users';

const sampleUser: User = {
  id: '1',
  nome: 'João Silva',
  email: 'joao@email.com',
  cpf: '12345678900',
  telefone: '85999999999',
  tipoTelefone: PhoneType.CELULAR
};

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GET /users without filter when nome is empty', () => {
    service.list().subscribe();
    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('nome:contains')).toBe(false);
    req.flush([sampleUser]);
  });

  it('GET /users with nome:contains when filter is provided (JSON Server v1)', () => {
    service.list('  joão  ').subscribe();
    const req = httpMock.expectOne((r) => r.url === BASE && r.params.get('nome:contains') === 'joão');
    expect(req.request.method).toBe('GET');
    req.flush([sampleUser]);
  });

  it('GET /users/:id', () => {
    service.getById('1').subscribe((u) => expect(u).toEqual(sampleUser));
    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleUser);
  });

  it('POST /users sends a client-generated id and ordered keys', () => {
    const payload: UserPayload = { ...sampleUser } as UserPayload;
    delete (payload as Partial<User>).id;

    service.create(payload).subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    const body = req.request.body as User;
    expect(typeof body.id).toBe('string');
    expect(body.id.length).toBeGreaterThan(0);
    expect(Object.keys(body)).toEqual(['id', 'nome', 'email', 'cpf', 'telefone', 'tipoTelefone']);
    expect(body).toMatchObject(payload);
    req.flush(body);
  });

  it('PUT /users/:id sends the same id and ordered keys', () => {
    const payload: UserPayload = { ...sampleUser, nome: 'Atualizado' } as UserPayload;
    delete (payload as Partial<User>).id;

    service.update('1', payload).subscribe((u) => expect(u.nome).toBe('Atualizado'));

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    const body = req.request.body as User;
    expect(body.id).toBe('1');
    expect(Object.keys(body)).toEqual(['id', 'nome', 'email', 'cpf', 'telefone', 'tipoTelefone']);
    expect(body).toMatchObject(payload);
    req.flush({ ...body });
  });
});
