import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Cliente } from './cliente';
import { ClienteService } from '../cliente';

@Component({
  selector: 'app-cadastro',
  imports: [ FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, MatIcon,
    MatButtonModule
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro {
  cliente: Cliente = Cliente.newCliente();

  constructor(private clienteService: ClienteService) {

  }

  salvar() {
    this.clienteService.salvar(this.cliente);
  }
}
