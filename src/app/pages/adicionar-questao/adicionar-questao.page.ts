import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { QuestoesService } from '../../services/questoes.service';
import { CriarQuestaoDTO, Questao } from '../../models/questao.model';

@Component({
  selector: 'app-adicionar-questao',
  templateUrl: './adicionar-questao.page.html',
  styleUrls: ['./adicionar-questao.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class AdicionarQuestaoPage implements OnInit {
  // modo edição ou criação
  editMode = false;
  questaoId: number | null = null;

  // campos do form
  titulo = '';
  enunciado = '';
  categoriaSelecionada = '';
  dificuldadeSelecionada: 'facil' | 'medio' | 'dificil' | '' = '';
  pontuacao: number | null = 10;
  resultadoEsperado = '';

  categorias = [
    { label: 'Matemática', value: 'matematica' },
    { label: 'Lógica', value: 'logica' },
    { label: 'Strings', value: 'strings' },
    { label: 'Arrays', value: 'arrays' },
    { label: 'Algoritmos', value: 'algoritmos' },
    { label: 'Boas-vindas', value: 'boas_vindas' },
    { label: 'Recursão', value: 'recursao' },
    { label: 'Grafos', value: 'grafos' },
  ];

  carregando = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private questoesService: QuestoesService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.editMode = true;
      this.questaoId = Number(idParam);
      this.carregarQuestao();
    }
  }

  voltar() {
    this.router.navigate(['/questoes']);
  }

  selecionarCategoria(categoriaValue: string) {
    this.categoriaSelecionada =
      this.categoriaSelecionada === categoriaValue ? '' : categoriaValue;
  }

  selecionarDificuldade(dificuldade: 'facil' | 'medio' | 'dificil') {
    this.dificuldadeSelecionada =
      this.dificuldadeSelecionada === dificuldade ? '' : dificuldade;
  }

  carregarQuestao() {
    if (!this.questaoId) return;
    this.carregando = true;

    this.questoesService.buscarPorId(this.questaoId).subscribe({
      next: (q: Questao) => {
        this.titulo = q.titulo;
        this.enunciado = q.enunciado;
        this.categoriaSelecionada = q.categoria;
        this.dificuldadeSelecionada = q.nivel;
        this.pontuacao = q.pontuacao;
        this.resultadoEsperado = q.resultado_esperado;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar questão para edição', err);
        this.carregando = false;
        this.router.navigate(['/questoes']);
      },
    });
  }

  adicionarOuSalvarQuestao() {
    if (
      !this.titulo ||
      !this.enunciado ||
      !this.categoriaSelecionada ||
      !this.dificuldadeSelecionada ||
      !this.resultadoEsperado
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const pontuacaoValida =
      this.pontuacao && this.pontuacao >= 1 && this.pontuacao <= 100
        ? this.pontuacao
        : 10;

    const payload: CriarQuestaoDTO = {
      titulo: this.titulo,
      enunciado: this.enunciado,
      categoria: this.categoriaSelecionada as any,
      nivel: this.dificuldadeSelecionada as any,
      pontuacao: pontuacaoValida,
      resultado_esperado: this.resultadoEsperado,
    };

    this.carregando = true;

    if (this.editMode && this.questaoId) {
      // edição
      this.questoesService.atualizarQuestao(this.questaoId, payload).subscribe({
        next: () => {
          this.carregando = false;
          this.router.navigate(['/questoes']);
        },
        error: (err) => {
          console.error('Erro ao atualizar questão', err);
          this.carregando = false;
          alert('Erro ao atualizar questão.');
        },
      });
    } else {
      // criação
      this.questoesService.criarQuestao(payload).subscribe({
        next: () => {
          this.carregando = false;
          this.router.navigate(['/questoes']);
        },
        error: (err) => {
          console.error('Erro ao criar questão', err);
          this.carregando = false;
          alert('Erro ao criar questão.');
        },
      });
    }
  }
}
