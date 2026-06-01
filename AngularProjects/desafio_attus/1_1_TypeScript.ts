
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
  const { pagina, tamanho } = params;

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