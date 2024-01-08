import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable()
export class UsuarioService {
    usuarioApiUrl = 'https://localhost:7096/api/v1/Usuario';
  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.usuarioApiUrl);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.usuarioApiUrl, usuario);
  }

  editUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.usuarioApiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.usuarioApiUrl}/${id}`)
  }
}