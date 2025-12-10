// src/app/models/questao.model.ts
export interface Questao {
  id: number;
  titulo: string;
  enunciado: string;
  categoria:
    | 'matematica'
    | 'logica'
    | 'strings'
    | 'arrays'
    | 'algoritmos'
    | 'boas_vindas'
    | 'recursao'
    | 'grafos';
  nivel: 'facil' | 'medio' | 'dificil';
  pontuacao: number;
  resultado_esperado: string;
  autor: string;      // username
  criada_em: string;  // ISO string
}

export type CriarQuestaoDTO = Omit<Questao, 'id' | 'autor' | 'criada_em'>;
