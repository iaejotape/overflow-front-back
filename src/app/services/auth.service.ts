import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = environment.API_BASE;

export interface PerfilUsuario {
  nome: string;
  data_nascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  tipo_usuario: 'estudante' | 'professor';
  aceitou_termos: boolean;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  profile?: PerfilUsuario;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: Usuario;
}

export interface CadastroPayload {
  username: string;
  email: string;
  password: string;
  confirmar_senha: string;
  nome: string;
  data_nascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  tipo_usuario: 'estudante' | 'professor';
  aceitou_termos: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessKey = 'overflow_access_token';
  private readonly refreshKey = 'overflow_refresh_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE}/auth/login/`, { username, password })
      .pipe(
        tap((res) => {
            localStorage.setItem(this.accessKey, res.access);
            localStorage.setItem(this.refreshKey, res.refresh);
            localStorage.setItem("overflow_user", JSON.stringify(res.user));
        })
      );
  }

  cadastrar(dados: CadastroPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_BASE}/auth/cadastro/`, dados);
  }

  logout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  estaLogado(): boolean {
    return !!this.getAccessToken();
  }
}
