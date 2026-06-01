import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemLista } from './item-lista';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-compras',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-compras.html',
  styleUrl: './lista-compras.css',
})
export class ListaCompras {
  item: string = '';
  lista: ItemLista[] = [];

  adicionarItem() {
    let itemLista = new ItemLista();
    itemLista.nome = this.item;
    itemLista.id = this.lista.length + 1;

    this.lista.push(itemLista);

    this.item = '';
  }

  riscarItem(item: ItemLista) {
    item.comprado = !item.comprado;
  }

  limparLista() {
    this.lista = [];
  }
}
