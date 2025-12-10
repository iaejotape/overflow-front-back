import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Questao, CriarQuestaoDTO } from '../models/questao.model';
import { AuthService } from './auth.service';

const API_BASE = environment.API_BASE;

@Injectable({
  providedIn: 'root',
})
export class QuestoesService {
  private baseUrl = `${API_BASE}/questoes/`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  listarQuestoes(): Observable<Questao[]> {
    // endpoint público
    return this.http.get<Questao[]>(`${this.baseUrl}listar/`);
  }

  buscarPorId(id: number): Observable<Questao> {
    return this.http.get<Questao>(`${this.baseUrl}${id}/`);
  }

  criarQuestao(data: CriarQuestaoDTO): Observable<Questao> {
    const headers = this.getAuthHeaders();
    return this.http.post<Questao>(`${this.baseUrl}criar/`, data, { headers });
  }

  atualizarQuestao(id: number, data: Partial<CriarQuestaoDTO>): Observable<Questao> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Questao>(`${this.baseUrl}${id}/atualizar/`, data, { headers });
  }

  deletarQuestao(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}${id}/deletar/`, { headers });
  }
}
