import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {
  // Dados do usuário
  usuario: any = null;
  // usuario = {
  //   nome: 'User',
  //   codigo: 'OVER-001',
  //   registradoEm: '01/05/2025',
  //   tempoOnline: '7 horas e 77 minutos',
  //   linguagens: ['html', 'js', 'csharp'],
  //   avatar: 'assets/img/avatar-owl.png'
  // };

  // Conquistas
  conquistas = [
    { id: 1, nome: 'Primeira Quest', icone: 'assets/img/conquista1.svg', desbloqueada: true },
    { id: 2, nome: 'Mestre Código', icone: 'assets/img/conquista2.svg', desbloqueada: true },
  ];

  // Insígnias
  insignias = [
    { id: 1, nome: 'CAIS Tech', icone: 'assets/img/caistech.svg', ativa: true },
  ];

  // Progresso mensal (simulado)
  progressoMeses = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Menu ativo via serviço
  get menuAtivo(): string {
    return this.navService.menuAtivo;
  }

  constructor(private router: Router, public navService: NavigationService, private auth: AuthService) {}

  ngOnInit() {
    this.getGreeting();
    this.carregarUsuario();
  }

  carregarUsuario() {
    const raw = localStorage.getItem('overflow_user');

    if (!raw) {
      // Se não tiver usuário salvo, manda pra tela de login
      this.router.navigate(['/entrar']);
      return;
    }

    try {
      const user = JSON.parse(raw);

      // Mapeia o usuário num formato bonitinho pro dashboard
      this.usuario = {
        nome: user.profile?.nome || user.username,
        username: user.username,
        codigo: `OVER-${String(user.id || 0).padStart(3, '0')}`,
        registradoEm: this.formatarData(user.profile?.data_nascimento),
        tempoOnline: 'Ainda calculando...', // depois dá pra ligar com estatísticas reais
        linguagens: ['python', 'javascript'], // por enquanto fixo, depois pode vir da API
        avatar: 'assets/img/avatar-owl.png'
      };
    } catch (e) {
      console.error('Erro ao ler usuário salvo:', e);
      this.router.navigate(['/entrar']);
    }
  }

  // helper opcional
  formatarData(dataIso?: string): string {
    if (!dataIso) return '—';
    const d = new Date(dataIso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR');
  }

  saudacao: string = '';

  getGreeting() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      this.saudacao = 'Bom dia';
    } else if (hora >= 12 && hora < 18) {
      this.saudacao = 'Boa tarde';
    } else {
      this.saudacao = 'Boa noite';
    }
  }

  navegarPara(rota: string) {
    this.navService.navegarPara(rota);
  }

  abrirConfiguracoes() {
    console.log('Abrir configurações');
  }

  logout() {
    this.auth.logout();
    localStorage.removeItem('overflow_user');
    this.router.navigate(['/entrar']);
  }

}
