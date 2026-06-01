import { PhoneType } from './phone-type.enum';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoTelefone: PhoneType;
}

export type UserPayload = Omit<User, 'id'>;
