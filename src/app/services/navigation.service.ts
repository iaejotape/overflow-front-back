import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuAtivoSubject = new BehaviorSubject<string>('home');
  menuAtivo$ = this.menuAtivoSubject.asObservable();

  constructor(private router: Router) {
    // Escuta mudanças de rota para atualizar o menu ativo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.atualizarMenuPorRota(event.urlAfterRedirects);
    });
  }

  private atualizarMenuPorRota(url: string) {
    if (url.includes('/dashboard')) {
      this.menuAtivoSubject.next('home');
    } else if (url.includes('/questoes')) {
      this.menuAtivoSubject.next('questoes');
    } else if (url.includes('/adicionar-questao')) {
      this.menuAtivoSubject.next('questoes');
    } else if (url.includes('/perfil')) {
      this.menuAtivoSubject.next('perfil');
    }
    // Adicione mais rotas conforme necessário
  }

  navegarPara(rota: string) {
    switch (rota) {
      case 'home':
        this.router.navigate(['/dashboard']);
        break;
      case 'questoes':
        this.router.navigate(['/questoes']);
        break;
      case 'perfil':
        this.router.navigate(['/perfil']);
        break;
      default:
        console.log('Navegar para:', rota);
    }
  }

  get menuAtivo(): string {
    return this.menuAtivoSubject.value;
  }
}
