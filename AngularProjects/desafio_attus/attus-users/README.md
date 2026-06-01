# Attus Users

Aplicação Angular para gerenciamento de usuários. Permite listar, cadastrar e editar usuários com validação de CPF, máscara de campos e busca em tempo real.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Angular 21 (Standalone Components) |
| Gerenciamento de estado | NgRx Store + Effects + Entity |
| UI | Angular Material 21 |
| API mock | json-server 1.x |
| Testes | Vitest 4 + @analogjs/vitest-angular |
| Máscaras de input | ngx-mask |
| Linguagem | TypeScript 5.9 |

---

## Pré-requisitos

- Node.js 20+
- npm 10+

---

## Instalação

```bash
npm install
```

---

## Como rodar o projeto

O projeto depende de uma API mock rodando localmente via **json-server**. É necessário abrir **dois terminais** em paralelo.

### Terminal 1 — API mock (json-server)

```bash
npx json-server mock-api/db.json --port 3000
```

O servidor sobe em `http://localhost:3000`. Os dados persistem no arquivo `mock-api/db.json`.

### Terminal 2 — Aplicação Angular

```bash
npm start
```

Acesse `http://localhost:4200` no navegador. A aplicação recarrega automaticamente ao salvar arquivos.

---

## Como rodar os testes

```bash
npm test
```

Executa todos os testes com o Vitest no modo watch. Para rodar uma única vez e encerrar:

```bash
npm test -- --run
```

Para abrir a interface visual do Vitest:

```bash
npm run test:ui
```

Para gerar relatório de cobertura:

```bash
npm run test:coverage
```

---

## Estrutura de pastas

```
src/
├── app/
│   ├── app.ts               # Componente raiz
│   ├── app.config.ts        # Configuração global (providers, NgRx, rotas)
│   ├── app.routes.ts        # Definição das rotas
│   └── app.html / app.scss
│
├── features/
│   └── users/               # Feature de usuários (auto-contida)
│       ├── components/
│       │   ├── user-card/           # Card de exibição de um usuário
│       │   └── user-form-dialog/    # Dialog de criação e edição
│       ├── models/
│       │   ├── user.model.ts        # Interface User e tipo UserPayload
│       │   └── phone-type.enum.ts   # Enum CELULAR / FIXO
│       ├── pages/
│       │   └── users-list/          # Página principal com listagem e busca
│       ├── services/
│       │   └── users.service.ts     # Comunicação HTTP com a API
│       └── store/
│           ├── actions/             # Action group (load, create, update)
│           ├── effects/             # Efeitos assíncronos (chamadas HTTP)
│           ├── reducers/            # Reducer com @ngrx/entity
│           ├── selectors/           # Seletores memoizados
│           └── state/               # Estado inicial e adapter
│
├── shared/
│   └── validators/
│       └── cpf.validator.ts         # Validador de CPF com cálculo dos dígitos verificadores
│
├── test-setup.ts            # Setup global do Vitest (zone.js + TestBed)
└── styles.scss              # Estilos globais
```

```
mock-api/
└── db.json                  # Base de dados do json-server
```

---

## Decisões de arquitetura

### Feature-based com feature autocontida

A pasta `features/users/` concentra tudo relacionado à feature de usuários: components, pages, services, models e store. Isso facilita localizar e escalar cada feature de forma independente, sem acoplamento com outras partes da aplicação.

### NgRx com @ngrx/entity

O estado dos usuários é gerenciado via NgRx Store com a camada de `entity`, que fornece o adapter para operações de coleção (`setAll`, `addOne`, `upsertOne`) de forma eficiente e padronizada. O fluxo segue o padrão: **dispatch de action → effect faz a chamada HTTP → action de sucesso/falha atualiza o reducer**.

### Standalone Components + Lazy Loading

Todos os componentes são standalone (sem NgModules). A rota principal carrega `UsersListPage` via `loadComponent`, mantendo o bundle inicial enxuto.

### OnPush Change Detection

A página e os componentes usam `ChangeDetectionStrategy.OnPush`, o que limita re-renderizações ao que o NgRx entrega via Observables — sem verificações desnecessárias na árvore de componentes.

### Busca com debounce no formulário reativo

A busca por nome usa `debounceTime(300)` + `distinctUntilChanged()` sobre um `FormControl`, evitando disparar uma requisição a cada tecla pressionada.

### json-server como API mock

A API mock roda em `http://localhost:3000/users`. A busca por nome utiliza o filtro `nome:contains` suportado pelo json-server 1.x, permitindo busca parcial case-insensitive sem necessidade de filtragem no cliente.

### Validador de CPF customizado

Um `ValidatorFn` Angular em `shared/validators/cpf.validator.ts` valida o CPF via cálculo dos dois dígitos verificadores. Rejeita sequências repetidas (ex.: `111.111.111-11`) e CPFs com número de dígitos incorreto.
