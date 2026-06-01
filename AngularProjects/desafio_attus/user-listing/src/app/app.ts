import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaCompras } from './lista-compras/lista-compras';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaCompras],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('user-listing');
}
