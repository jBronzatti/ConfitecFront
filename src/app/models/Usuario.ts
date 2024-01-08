export interface Usuario {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    dataNascimento: string;
    escolaridade: number;
}

export enum EscolaridadeEnum {
    Infantil,
    Fundamental,
    Médio,
    Superior
  }