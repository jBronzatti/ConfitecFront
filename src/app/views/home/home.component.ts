import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import * as moment from 'moment';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { UsuarioDialogComponent } from 'src/app/shared/usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UsuarioService]
})
export class HomeComponent {
  @ViewChild(MatTable)
  table!: MatTable<any>
  displayedColumns: string[] = ['id', 'nome', 'sobrenome', 'email', 'dataNascimento', 'escolaridade', 'actions'];
  dataSource!: Usuario[];
  escolaridadeSelect!: string;

  constructor(
    public dialog: MatDialog,
    public usuarioService: UsuarioService,
    private _snackBar: MatSnackBar
    ) {
      this.usuarioService.getUsuarios().subscribe((data:Usuario[]) => {
        data.forEach(usuario => {
          usuario.dataNascimento = moment(usuario.dataNascimento).format('DD/MM/YYYY')
        });
        this.dataSource = data.reverse();
      })
     }

  openDialog(usuario: Usuario | null): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data: usuario === null ? {
        id: null,
        nome: '',
        sobrenome: '',
        email: '',
        dataNascimento: '',
        escolaridade: null
      } : {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        dataNascimento: moment(usuario.dataNascimento, 'DD/MM/YYYY', false).format('DD/MM/YYYY'),
        escolaridade: usuario.escolaridade
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        result.dataNascimento = moment(result.dataNascimento).format('YYYY-MM-DD')
        result.escolaridade = result.escolaridade
        if (this.dataSource.map(p => p.id).includes(result.id)) {
          this.usuarioService.editUsuario(result.id, result).subscribe((data: Usuario) => {
            const index = this.dataSource.findIndex(o => o.id === data.id)
            data.dataNascimento = moment(data.dataNascimento).format('DD/MM/YYYY')
            this.dataSource[index] = data;
            this.table.renderRows();
          })
        } else {
          this.usuarioService.createUsuario(result).subscribe((data:Usuario) => {
            data.dataNascimento = moment(data.dataNascimento).format('DD/MM/YYYY')
            this.dataSource.unshift(data);
            this.table.renderRows();
          })
        }
      }
    });
  }

  deleteElement(id: number): void {
    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.dataSource = this.dataSource.filter(p => p.id !== id);
    })
  }

  editElement(usuario: Usuario): void {
    this.openDialog(usuario);
  }

  confirmDelete(usuario: Usuario): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: usuario.id, nome: usuario.nome }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteElement(usuario.id);
        this._snackBar.open('Usuário deletado com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  intToEscolaridade(numero: number): string | undefined {
    switch (numero) {
      case 0:
        return "Ensino Infantil";
      case 1:
        return "Ensino Fundamental";
      case 2:
        return "Ensino Médio";
      case 3:
        return "Ensino Superior";
      default:
        return undefined;
    }
  }
}
