# Attus Users API

API REST em **Spring Boot 3.4 / Java 21** com **PostgreSQL**, sem autenticação,
que serve o CRUD de usuários consumido pelo frontend Angular deste repositório.

A API roda na porta **3000** — a mesma usada hoje pelo `json-server` —, com o
mesmo contrato de dados, então o frontend funciona sem nenhuma alteração
(basta não rodar os dois ao mesmo tempo na 3000).

## Pré-requisitos

- **JDK 21+** (`java -version`)
- **Docker + Docker Compose** (para o PostgreSQL) — ou um PostgreSQL local
- Maven **não** é necessário: o projeto inclui o Maven Wrapper (`./mvnw`),
  que baixa o Maven automaticamente na primeira execução.

## Como rodar

### 1. Subir o PostgreSQL

```bash
cd backend
docker compose up -d
```

Isso cria o banco `attus_users` (usuário `attus`, senha `attus`) na porta `5432`.

### 2. Rodar a aplicação

```bash
./mvnw spring-boot:run
```

A API sobe em `http://localhost:3000`. Na primeira execução, a tabela `users`
é criada automaticamente (Hibernate `ddl-auto=update`) e alguns usuários de
exemplo são inseridos caso a tabela esteja vazia.

### 3. Rodar o frontend Angular

Em outro terminal, na raiz do projeto:

```bash
npm start
```

> ⚠️ Pare o `json-server` (`npm run mock-api`) antes de subir esta API — ambos
> usam a porta 3000.

## Endpoints

| Método | Rota          | Descrição                                  |
|--------|---------------|--------------------------------------------|
| GET    | `/users`      | Lista usuários (ordenados por nome)        |
| GET    | `/users?nome:contains=ana` | Filtra por nome (contém, case-insensitive) |
| GET    | `/users/{id}` | Busca por id                               |
| POST   | `/users`      | Cria usuário (id gerado pelo servidor)     |
| PUT    | `/users/{id}` | Atualiza usuário                           |
| DELETE | `/users/{id}` | Remove usuário                             |

O filtro `nome:contains` (sintaxe herdada do json-server) é aceito; também
funciona o parâmetro simples `?nome=`.

### Modelo do usuário

```json
{
  "id": "01HZ8K3M9P0QR4S5T6V7W8X9Y0",
  "nome": "Maria Souza",
  "email": "maria@email.com",
  "cpf": "94014281078",
  "telefone": "85988888888",
  "tipoTelefone": "CELULAR",
  "dataNascimento": "01/01/1990"
}
```

- `id`: **ULID gerado pelo servidor** (26 chars, ordenável por tempo). Qualquer `id` enviado no corpo é ignorado.
- `tipoTelefone`: `CELULAR` ou `FIXO`.
- `dataNascimento`: opcional, armazenado como texto (mesmo formato enviado pelo
  frontend); omitido no JSON quando nulo.

### Validações (HTTP 400)

- `nome`: obrigatório, mínimo 3 caracteres
- `email`: obrigatório, formato de e-mail válido
- `cpf`: obrigatório
- `telefone`: obrigatório, mínimo 10 dígitos
- `tipoTelefone`: obrigatório

Erros de validação retornam um corpo no formato:

```json
{
  "timestamp": "2026-05-29T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validacao",
  "errors": { "email": "Email invalido" }
}
```

## Testes

```bash
./mvnw test
```

Os testes usam **H2 em memória** (perfil `test`), sem necessidade de Docker/Postgres.

## Configuração

Variáveis de ambiente (com os defaults usados em dev):

| Variável                | Default                                          |
|-------------------------|--------------------------------------------------|
| `SERVER_PORT`           | `3000`                                           |
| `DB_URL`                | `jdbc:postgresql://localhost:5432/attus_users`   |
| `DB_USERNAME`           | `attus`                                          |
| `DB_PASSWORD`           | `attus`                                          |
| `CORS_ALLOWED_ORIGINS`  | `http://localhost:4200`                          |
