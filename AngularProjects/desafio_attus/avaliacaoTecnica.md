# Avaliação Técnica

---

## 1. TypeScript e Qualidade de Código

### 1.1 Refatoração

> Considerando seus conhecimentos de TypeScript, qualidade de código e boas práticas, quais melhorias você faria no seguinte código:
>
>```typescript
> class Produto {
>   id: any;
>   descricao: any;
>   quantidadeEstoque: any;
>
>   constructor(id: any, descricao: any, quantidadeEstoque: any) {
>     this.id = id;
>     this.descricao = descricao;
>     this.quantidadeEstoque = quantidadeEstoque;
>   }
> }
>
> class Verdureira {
>   produtos: any;
>
>   constructor() {
>     this.produtos = [
>       new Produto(1, 'Maçã', 20),
>       new Produto(2, 'Laranja', 0),
>       new Produto(3, 'Limão', 20)
>     ];
>   }
>
>   getDescricaoProduto(produtoId: any) {
>     let produto;
>
>     for (let index = 0; index < this.produtos.length; index++) {
>       if (this.produtos[index].id == produtoId) {
>         produto = this.produtos[index];
>       }
>     }
>
>     return produto.id + ' - ' + produto.descricao + ' (' + produto.quantidadeEstoque + 'x)';
>   }
>
>   hasEstoqueProduto(produtoId: any) {
>     let produto;
>
>     for (let index = 0; index < this.produtos.length; index++) {
>       if (this.produtos[index].id == produtoId) {
>         produto = this.produtos[index];
>       }
>     }
>
>     if (produto.quantidadeEstoque > 0) {
>       return true;
>     } else {
>       return false;
>     }
>   }
> }
>```

#### Resposta

**Explicação:**

Primeiro eliminei o uso de `any` (declaração de tipo assim inutiliza o propósito do typescript), depois simplifiquei o `constructor` da classe produto declarando e atribuindo as propriedades nele direto (evita repetições de código). O `readonly` é uma proteção extra, para que o estoque não possa ser alterado diretamente. Passei a responsabilidade de saber se há produtos no estoque e de formatar a descrição para a classe produto propriamente, a classe Verdureira não carrega mais a lógica. Removi a duplicação de `loop` na classe Verdureira e também adicionei tratamento de erro.

```typescript

class Produto {
 constructor(
  public readonly id: number,
  public readonly descricao: string,
  public readonly quantidadeEstoque: number) {
 }

 produtoEmEstoque(): boolean {
   return this.quantidadeEstoque > 0;
 }

 formatarDescricao(): string {
   return `${this.id} - ${this.descricao} (${this.quantidadeEstoque}x)`;
 }

}

class Verdureira {
  private produtos: Produto[] = [
    new Produto(1, 'Maçã', 20),
    new Produto(2, 'Laranja', 0),
    new Produto(3, 'Limão', 20)
  ];

  private getProdutoPorId(produtoId: number): Produto {
    const produto = this.produtos.find(p => p.id === produtoId);

    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    
    return produto;
  }

  getDescricaoProduto(produtoId: number): string {
    return this.getProdutoPorId(produtoId).formatarDescricao();
  }

  hasEstoqueProduto(produtoId: number): boolean {
    return this.getProdutoPorId(produtoId).produtoEmEstoque();
  }
}
```

---

### 1.2 Generics e Tipos Utilitários

> Implemente uma função genérica `filtrarEPaginar<T>` que recebe um array, um predicado de filtro e parâmetros de paginação (página e tamanho). A função deve retornar os itens da página atual e o total de registros filtrados. Use tipagem completa — sem `any`.
>
> ```typescript
> filtrarEPaginar<T>(
>   data: T[],
>   filterFn: (item: T) => boolean,
>   params: PaginaParams
> ): Pagina<T>
> ```
>
> Demonstre o uso com um exemplo concreto (ex: array de usuários com filtro por nome).

#### Resposta

```typescript

interface PaginaParams {
  pagina: number;
  tamanho: number;
}

interface Pagina<T> {
  registros: T[];
  total: number;
  pagina: number;
  tamanho: number;
  totalPaginas: number;
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {
  const pagina = Math.max(1, params.pagina);
  const tamanho = Math.max(1, params.tamanho);

  const registrosFiltrados = data.filter(filterFn);

  const inicio = (pagina - 1) * tamanho;
  const fim = inicio + tamanho;

  const registrosPaginados = registrosFiltrados.slice(inicio, fim);

  return {
    registros: registrosPaginados,
    total: registrosFiltrados.length,
    pagina,
    tamanho,
    totalPaginas: Math.ceil(registrosFiltrados.length / tamanho)
  };
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: 'Ana', email: 'ana@email.com' },
  { id: 2, nome: 'Bruno', email: 'bruno@email.com' },
  { id: 3, nome: 'Carlos', email: 'carlos@email.com' },
  { id: 4, nome: 'Carla', email: 'carla@email.com' },
  { id: 5, nome: 'Daniel', email: 'daniel@email.com' }
];

const resultado = filtrarEPaginar(
  usuarios,
  (usuario) => usuario.nome.toLowerCase().includes('a'),
  {
    pagina: 1,
    tamanho: 2
  }
);

console.log(resultado);

```

---

## 2. Angular — Fundamentos e Reatividade

### 2.1 Change Detection e OnPush

> O componente abaixo usa `ChangeDetectionStrategy.OnPush`, mas o nome não é exibido na tela. Identifique o problema, explique o motivo e proponha a correção — sem alterar a estratégia, sem modificar `PessoaService` e sem remover o `setInterval`.
>
> ```typescript
> import { ChangeDetectionStrategy, Component, Injectable, OnInit, OnDestroy } from '@angular/core';
> import { of, Subscription } from 'rxjs';
> import { delay } from 'rxjs/operators';
>
> @Injectable()
> class PessoaService {
>   /** @description Mock de uma busca em API com retorno em 0.5 segundos */
>   buscarPorId(id: number) {
>     return of({ id, nome: 'João' }).pipe(delay(500));
>   }
> }
>
> @Component({
>   selector: 'app-root',
>   providers: [PessoaService],
>   changeDetection: ChangeDetectionStrategy.OnPush,
>   template: `<h1>{{ texto }}</h1>`,
> })
> export class AppComponent implements OnInit, OnDestroy {
>   texto: string;
>   contador = 0;
>   subscriptionBuscarPessoa: Subscription;
>   constructor(private readonly pessoaService: PessoaService) {}
>
>   ngOnInit(): void {
>     this.subscriptionBuscarPessoa = this.pessoaService.buscarPorId(1).subscribe((pessoa) => {
>       this.texto = `Nome: ${pessoa.nome}`;
>     });
>
>     setInterval(() => this.contador++, 1000);
>   }
>
>   ngOnDestroy(): void {
>     /** ... */
>   }
> }
> ```

#### Resposta

**Problema:**

Angular não executa detecção de mudanças automaticamente para qualquer alteração interna do componente quando se utiliza onPush`.

**Motivo:**

Com `OnPush`, o Angular só verifica o componente em um ciclo de change detection quando ele está marcado como `dirty`. Tanto o callback do `subscribe` (disparado pelo `delay(500)`, que usa `setTimeout` internamente) quanto o `setInterval` são rastreados pela `Zone.js` e disparam ciclos globais de CD, mas o componente é ignorado nesses ciclos porque nunca foi marcado sujo. `this.texto` é atribuído dentro do subscribe, porém sem chamar `markForCheck()`, a visão do Angular sobre o componente não muda e o template não é atualizado.

**Correção:**

```typescript

 import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit, OnDestroy } from '@angular/core';
 import { of, Subscription } from 'rxjs';
 import { delay } from 'rxjs/operators';

 @Injectable()
 class PessoaService {
   /** @description Mock de uma busca em API com retorno em 0.5 segundos */
   buscarPorId(id: number) {
     return of({ id, nome: 'João' }).pipe(delay(500));
   }
 }

 @Component({
   selector: 'app-root',
   providers: [PessoaService],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `<h1>{{ texto }}</h1>`,
 })
 export class AppComponent implements OnInit, OnDestroy {
   texto: string;
   contador = 0;
   subscriptionBuscarPessoa: Subscription;

   constructor(
    private readonly pessoaService: PessoaService,
    private readonly cdr: ChangeDetectorRef ) {}

   ngOnInit(): void {
     this.subscriptionBuscarPessoa = this.pessoaService.buscarPorId(1).subscribe((pessoa) => {
       this.texto = `Nome: ${pessoa.nome}`;
       this.cdr.markForCheck();
     });

     setInterval(() => this.contador++, 1000);
   }

   ngOnDestroy(): void {
     this.subscriptionBuscarPessoa?.unsubscribe();
   }
 }

```

---

### 2.2 RxJS — Eliminando Subscriptions Aninhadas

> Refatore o código abaixo eliminando o `subscribe` dentro de `subscribe`. Use operadores RxJS adequados, evite memory leaks e explique brevemente sua escolha de operador.
>
> ```typescript
> ngOnInit(): void {
>   const pessoaId = 1;
>
>   this.pessoaService.buscarPorId(pessoaId).subscribe(pessoa => {
>     this.pessoaService.buscarQuantidadeFamiliares(pessoaId).subscribe(qtd => {
>       this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
>     });
>   });
> }
> ```

#### Resposta

**Operador escolhido e motivo:**

Utilizei `forkJoin` porque as duas chamadas são independentes entre si (nenhuma depende do resultado da outra, ambas usam `pessoaId` diretamente). `forkJoin` dispara as requisições em paralelo e emite um único objeto combinado quando os `observables` completam, eliminando o `subscribe` aninhado. Se a segunda chamada dependesse do resultado da primeira, o operador correto seria `switchMap`.

`takeUntilDestroyed` é usado para cancelar a `subscription` automaticamente na destruição do componente, evitando `memory leak` sem necessidade de gerenciar manualmente no `ngOnDestroy`.

```typescript
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  texto: string;

  ngOnInit(): void {
    const pessoaId = 1;

    forkJoin({
      pessoa: this.pessoaService.buscarPorId(pessoaId),
      qtd: this.pessoaService.buscarQuantidadeFamiliares(pessoaId)
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(({ pessoa, qtd }) => {
      this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
    });
  }
}
```

---

### 2.3 RxJS — Busca com Debounce

> Implemente um campo de busca reativo em um componente Angular que:
> - Aguarde 500 ms após o usuário parar de digitar antes de disparar a requisição (debounce)
> - Cancele a requisição anterior caso o usuário digite novamente (evite race condition)
> - Exiba um indicador de loading enquanto a requisição está em andamento
> - Gerencie a subscription sem memory leak
>
> Mostre o serviço, o componente e o template com `async pipe`.

#### Resposta

`switchMap` cancela a requisição anterior se o usuário digitar novamente, o que evia o `race condition`, e `takeUntilDestroyed` gerencia a `subscription` sem `memory leak.

**Serviço:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultadoBusca {
  id: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class BuscaService {
  constructor(private http: HttpClient) {}

  buscar(termo: string): Observable<ResultadoBusca[]> {
    return this.http.get<ResultadoBusca[]>(`/api/busca?q=${termo}`);
  }
}
```

**Componente:**

```typescript
import { Component, inject, DestroyRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BuscaService, ResultadoBusca } from './busca.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
})
export class BuscaComponent {
  private destroyRef = inject(DestroyRef);
  private termoBusca$ = new Subject<string>();

  loading = false;

  resultados$ = this.termoBusca$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => (this.loading = true)),
    switchMap(termo =>
      this.buscaService.buscar(termo).pipe(
        finalize(() => (this.loading = false))
      )
    ),
    takeUntilDestroyed(this.destroyRef)
  );

  constructor(private buscaService: BuscaService) {}

  onDigitar(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.termoBusca$.next(valor);
  }
}
```

**Template:**

```html
<input type="text" placeholder="Buscar..." (input)="onDigitar($event)" />

<p *ngIf="loading">Carregando...</p>

<ul *ngIf="resultados$ | async as resultados">
  <li *ngFor="let item of resultados">{{ item.nome }}</li>
</ul>
```

---

### 2.4 Performance — OnPush e trackBy

> Considere uma lista com centenas de itens renderizados com `@for` (`ngFor`). Explique:
> - Por que usar `trackBy` melhora a performance e como implementá-lo corretamente
> - Como `ChangeDetectionStrategy.OnPush` pode reduzir ciclos desnecessários de detecção neste cenário
> - Qual seria o impacto de usar a estratégia `Default` neste caso

#### Resposta

**No caso do trackBy**

Por padrão, o Angular rastreia itens de uma lista pela referência do objeto. Quando o `array` é reatribuído (ex: ao receber novos dados de uma API), ele entende que todos os itens mudaram, ainda que sejam os mesmos, e destrói e recria todos os nós do `DOM`. Com centenas de itens, isso causa `reflows` e `repaints` custosos.

`trackBy` resolve isso fornecendo uma chave para identificar cada elemento. Assim, somente os nós cujos dados realmente mudaram são atualizados no `DOM`; os demais são reutilizados.

```typescript
// No componente
trackById(index: number, item: { id: number }): number {
  return item.id;
}
```

```html
<!-- No template -->
@for (item of itens; track item.id) { ... }

<!-- Sintaxe anterior -->
<li *ngFor="let item of itens; trackBy: trackById">{{ item.nome }}</li>
```

**No caso do OnPush**

Com `OnPush`, como dito anteriormente o Angular só verifica o componente de lista nesses casos em específico:
- Quando um `@Input()` recebe uma nova referência (ex: novo `array`, não modificação do já existente);
- Quando um evento do `DOM` ocorre dentro dele;
- Quando um `observable` resolvido via `async pipe` emite um novo valor;
- Quando um `markForCheck()` é chamado explicitamente.

Isso significa que ciclos de detecção de mudanças disparados por eventos em outros componentes da aplicação (`timers`, cliques em outros lugares) não percorrem esta lista desnecessariamente. O custo de verificação cai de O(n) por ciclo global para praticamente zero quando não há `input` novo.

A combinação com dados imutáveis (retornar sempre um novo `array` em vez de mudar o existente) é o padrão recomendado: o Angular detecta a mudança de referência e verifica o componente somente quando necessário.

**Optando por Default**

Com `Default`, o Angular verifica o componente e todos os seus filhos em todo ciclo de detecção de mudanças global. A cada clique, `timer` ou requisição HTTP em qualquer parte da aplicação. Com centenas de itens na lista, cada ciclo percorre e compara todos os bindings, resultando em queda de performance perceptível. Sem `trackBy`, soma-se ainda a recriação desnecessária de `DOM` nodes a cada nova referência de array.

---

## 3. Gerenciamento de Estado

### 3.1 Angular Signals — Estado Local

> Crie um componente de contador de itens no carrinho usando exclusivamente Signals. O componente deve expor:
> - Um signal para a lista de itens
> - Um `computed` para o total (quantidade × preço)
> - Um método para adicionar e remover itens
> - Um `output()` que emite sempre que o total mudar

#### Resposta

```typescript
import { Component, computed, effect, output, signal } from '@angular/core';

interface ItemCarrinho {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}

@Component({
  selector: 'app-carrinho',
  template: `
    <ul>
      @for (item of itens(); track item.id) {
        <li>
          {{ item.nome }} — {{ item.quantidade }}x R$ {{ item.preco }}
          <button (click)="removerItem(item.id)">Remover</button>
        </li>
      }
    </ul>
    <p><strong>Total: R$ {{ total() }}</strong></p>
    <button (click)="adicionarItem({ id: 1, nome: 'Produto A', quantidade: 1, preco: 29.9 })">
      Adicionar Produto A
    </button>
  `,
})
export class CarrinhoComponent {
  readonly itens = signal<ItemCarrinho[]>([]);

  readonly total = computed(() =>
    this.itens().reduce((soma, item) => soma + item.quantidade * item.preco, 0)
  );

  readonly totalMudou = output<number>();

  constructor() {
    effect(() => {
      this.totalMudou.emit(this.total());
    });
  }

  adicionarItem(novoItem: ItemCarrinho): void {
    this.itens.update(lista => {
      const existente = lista.find(i => i.id === novoItem.id);
      if (existente) {
        return lista.map(i =>
          i.id === novoItem.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...lista, novoItem];
    });
  }

  removerItem(id: number): void {
    this.itens.update(lista => lista.filter(i => i.id !== id));
  }
}
```

---

### 3.2 Gerenciamento de Estado com NgRx (Feature To-do)

> Implemente a estrutura de estado para uma lista de tarefas (To-do) utilizando os padrões recomendados do NgRx. A implementação deve incluir:
> - **Actions:** `loadTodos`, `loadTodosSuccess`, `loadTodosError` e `toggleTodoComplete`
> - **Reducer:** estado inicial e transição de estados com `createReducer`, com tipagem forte
> - **Selectors:** `selectAllTodos` (lista completa) e `selectPendingTodos` (tarefas não concluídas)
> - **Effect:** ao disparar `loadTodos`, realiza chamada HTTP (mockada) e despacha sucesso ou erro

#### Resposta

**Actions:**

```typescript
// todo.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface Todo {
  id: number;
  titulo: string;
  concluido: boolean;
}

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Error': props<{ error: string }>(),
    'Toggle Todo Complete': props<{ id: number }>(),
  },
});
```

**Reducer:**

```typescript
// todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { TodoActions, Todo } from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({ ...state, loading: true, error: null })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
  })),
  on(TodoActions.loadTodosError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TodoActions.toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, concluido: !todo.concluido } : todo
    ),
  }))
);
```

**Selectors:**

```typescript
// todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

const selectTodoState = createFeatureSelector<TodoState>('todo');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectPendingTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.concluido)
);
```

**Effect:**

```typescript
// todo.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodoActions, Todo } from './todo.actions';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.http.get<Todo[]>('https://api.exemplo.com/todos').pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(err =>
            of(TodoActions.loadTodosError({ error: err.message }))
          )
        )
      )
    )
  );
}
```
