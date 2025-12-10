import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { NavigationService } from '../../services/navigation.service';
import { QuestoesService } from '../../services/questoes.service';
import { Questao } from '../../models/questao.model';

@Component({
  selector: 'app-questoes',
  templateUrl: './questoes.page.html',
  styleUrls: ['./questoes.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
})
export class QuestoesPage implements OnInit {
  // lista vinda do backend
  questoes: Questao[] = [];
  carregando = false;

  // filtro de categoria
  categoriasFiltro = [
    { label: 'Todas', value: 'todas' },
    { label: 'Matemática', value: 'matematica' },
    { label: 'Lógica', value: 'logica' },
    { label: 'Strings', value: 'strings' },
    { label: 'Arrays', value: 'arrays' },
    { label: 'Algoritmos', value: 'algoritmos' },
  ];
  categoriaFiltroAtiva: string = 'todas';

  // Modal de exclusão
  mostrarModalExclusao: boolean = false;
  questaoParaExcluir: Questao | null = null;

  // Menu ativo via serviço
  get menuAtivo(): string {
    return this.navigationService.menuAtivo;
  }

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private questoesService: QuestoesService
  ) {}

  ngOnInit() {
    this.carregarQuestoes();
  }

  ionViewWillEnter() {
    this.carregarQuestoes();
  }

  carregarQuestoes() {
    this.carregando = true;
    this.questoesService.listarQuestoes().subscribe({
      next: (qs) => {
        this.questoes = qs;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar questões:', err);
        this.carregando = false;
      },
    });
  }

  get questoesFiltradas(): Questao[] {
    const base = this.categoriaFiltroAtiva === 'todas'
      ? this.questoes
      : this.questoes.filter(
          (q) => q.categoria === this.categoriaFiltroAtiva
        );

    // define a ordem dos níveis
    const ordemNivel: Record<Questao['nivel'], number> = {
      facil: 0,
      medio: 1,
      dificil: 2,
    };

    // retorna uma cópia ordenada
    return [...base].sort((a, b) => {
      const diffNivel = ordemNivel[a.nivel] - ordemNivel[b.nivel]; // Aqui em ordem de nivel
      if (diffNivel !== 0) {
        return diffNivel;
      }

      const ta = new Date(a.criada_em).getTime(); // depois por data de criação
      const tb = new Date(b.criada_em).getTime();
      return ta - tb; // menor data (mais antiga) em cima
    });
  }

  selecionarFiltroCategoria(valor: string) {
    this.categoriaFiltroAtiva = valor;
  }

  novaQuestao() {
    this.router.navigate(['/adicionar-questao']);
  }

  editarQuestao(id: number) {
    this.router.navigate(['/editar-questao', id]);
  }


  navegarPara(rota: string) {
    this.navigationService.navegarPara(rota);
  }

  confirmarExclusao(questao: Questao) {
    this.questaoParaExcluir = questao;
    this.mostrarModalExclusao = true;
  }

  fecharModal() {
    this.mostrarModalExclusao = false;
    this.questaoParaExcluir = null;
  }

  excluirQuestao() {
    if (!this.questaoParaExcluir) return;

    const id = this.questaoParaExcluir.id;

    this.questoesService.deletarQuestao(id).subscribe({
      next: () => {
        // remove localmente
        this.questoes = this.questoes.filter((q) => q.id !== id);
        this.fecharModal();
      },
      error: (err) => {
        console.error('Erro ao excluir questão:', err);
        this.fecharModal();
      },
    });
  }

  mapCategoria(codigo: Questao['categoria']): string {
    switch (codigo) {
      case 'matematica':
        return 'Matemática';
      case 'logica':
        return 'Lógica';
      case 'strings':
        return 'Strings';
      case 'arrays':
        return 'Arrays';
      case 'algoritmos':
        return 'Algoritmos';
      case 'boas_vindas':
        return 'Boas-vindas';
      case 'recursao':
        return 'Recursão';
      case 'grafos':
        return 'Grafos';
      default:
        return codigo;
    }
  }

  mapNivel(nivel: Questao['nivel']): string {
    switch (nivel) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Intermediário';
      case 'dificil':
        return 'Difícil';
      default:
        return nivel;
    }
  }

  mapClasseDificuldade(nivel: Questao['nivel']): string {
    switch (nivel) {
      case 'facil':
        return 'facil';
      case 'medio':
        return 'intermediario';
      case 'dificil':
        return 'dificil';
      default:
        return '';
    }
  }
}
