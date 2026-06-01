import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/users';

  list(nome?: string): Observable<User[]> {
    const trimmed = nome?.trim();
    let params = new HttpParams();
    if (trimmed) {
      params = params.set('nome:contains', trimmed);
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(payload: UserPayload): Observable<User> {
    const body = this.toOrderedUser(this.generateId(), payload);
    return this.http.post<User>(this.apiUrl, body);
  }

  update(id: string, payload: UserPayload): Observable<User> {
    const body = this.toOrderedUser(id, payload);
    return this.http.put<User>(`${this.apiUrl}/${id}`, body);
  }

  private toOrderedUser(id: string, payload: UserPayload): User {
    return {
      id,
      nome: payload.nome,
      email: payload.email,
      cpf: payload.cpf,
      telefone: payload.telefone,
      tipoTelefone: payload.tipoTelefone
    };
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 11);
  }
}
