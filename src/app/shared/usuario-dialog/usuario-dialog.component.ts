import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { EscolaridadeEnum, Usuario } from 'src/app/models/Usuario';

interface SelectorView {
  valor: EscolaridadeEnum;
  label: string;
}

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent {
  usuario!: Usuario;
  isNew!: boolean;
  maxDate!: string;
  listEscolaridade: SelectorView[] = [
    { valor: EscolaridadeEnum.Infantil, label: 'Ensino Infantil' },
    { valor: EscolaridadeEnum.Fundamental, label: 'Ensino Fundamental' },
    { valor: EscolaridadeEnum.Médio, label: 'Ensino Médio' },
    { valor: EscolaridadeEnum.Superior, label: 'Ensino Superior' }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Usuario,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isNew = !this.data.id
    this.maxDate = new Date().toISOString();
    this.form = this.fb.group({
      nome: [this.data.nome, Validators.required],
      sobrenome: [this.data.sobrenome, Validators.required],
      email: [this.data.email, [Validators.required, this.customEmailValidator]],
      dataNascimento: [moment(this.data.dataNascimento, 'DD/MM/YYYY', false).toISOString(), Validators.required],
      escolaridade: [this.data.escolaridade, Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  form: FormGroup = new FormGroup({
    email: new FormControl("", [this.customEmailValidator]),
    nome: new FormControl("", [Validators.required]),
    sobrenome: new FormControl("", [Validators.required]),
    dataNascimento: new FormControl("", [Validators.required]),
    escolaridade: new FormControl("", [Validators.required]),
  });

  onConfirm(): void {
    const requiredFields = ['nome', 'sobrenome', 'email', 'dataNascimento', 'escolaridade'];
    const allFieldsFilled = requiredFields.every(field => !!this.form.get(field)?.value || this.form.get(field)?.value === 0);
    if (allFieldsFilled && this.form.valid) {
      this.data.id ? this.dialogRef.close({...this.form.value, id: this.data.id}) : this.dialogRef.close(this.form.value);
    } else {
      this.dialogRef.disableClose = true;
      this._snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;
  
    if (!email) {
      return { required: true };
    }
  
    if (!email.includes('@') || !email.includes('.')) {
      return { emailError: true };
    }
  
    return null;
  }
}
