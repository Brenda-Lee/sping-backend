import { v4 as uuidv4 } from 'uuid';

export class Cliente {
    id?: string;
    nome?: string;
    email?: string;
    cpf?: string;
    dataNascimento?: string;

    static newCliente() {
        const cliente = new Cliente();
        cliente.id = uuidv4();
        return cliente;
    }
}