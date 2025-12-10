import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

interface Usuario {
  nome: string;
  email: string;
  pontos: number;
  registradoEm: string;
  avatar: string;
  nomeUsuario: string;
  sexo: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {

  usuario: Usuario = {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    pontos: 1250,
    registradoEm: '15/03/2024',
    avatar: 'assets/img/coruja.svg',
    nomeUsuario: 'joaosilva',
    sexo: 'masculino'
  };
  nomeUsuario: string = 'joaosilva';
  sexo: string = 'masculino';
  email: string = 'joao.silva@email.com';
  carregando: boolean = false;
  mensagem: { tipo: 'sucesso' | 'erro'; texto: string } | null = null;

  mostrarModalSenha: boolean = false;
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';

  editando = {
    nomeUsuario: false,
    email: false
  };

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.carregarPerfil();
  }

  get menuAtivo(): string {
    return this.navigationService.menuAtivo;
  }

  navegarPara(pagina: string) {
    this.navigationService.navegarPara(pagina);
  }

  voltar() {
    this.navigationService.navegarPara('questoes');
  }

  carregarPerfil() {
    // Dados mockados para exemplo
    this.usuario = {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      pontos: 1250,
      registradoEm: '15/03/2024',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      nomeUsuario: 'joaosilva',
      sexo: 'masculino'
    };

    this.nomeUsuario = this.usuario.nomeUsuario;
    this.email = this.usuario.email;
    this.sexo = this.usuario.sexo;
  }

  toggleEditar(campo: 'nomeUsuario' | 'email') {
    this.editando[campo] = !this.editando[campo];
  }

  salvarAlteracoes() {
    this.carregando = true;
    this.mensagem = null;

    // Simular requisição
    setTimeout(() => {
      if (this.usuario) {
        this.usuario.nomeUsuario = this.nomeUsuario;
        this.usuario.email = this.email;
        this.usuario.sexo = this.sexo;
      }

      this.editando.nomeUsuario = false;
      this.editando.email = false;
      this.carregando = false;
      this.mensagem = { tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' };

      setTimeout(() => {
        this.mensagem = null;
      }, 3000);
    }, 1000);
  }

  abrirModalSenha() {
    this.mostrarModalSenha = true;
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
  }

  fecharModalSenha() {
    this.mostrarModalSenha = false;
  }

  alterarSenha() {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarNovaSenha) {
      this.mensagem = { tipo: 'erro', texto: 'Preencha todos os campos de senha.' };
      return;
    }

    if (this.novaSenha !== this.confirmarNovaSenha) {
      this.mensagem = { tipo: 'erro', texto: 'As senhas não coincidem.' };
      return;
    }

    if (this.novaSenha.length < 6) {
      this.mensagem = { tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres.' };
      return;
    }

    this.carregando = true;

    // Simular requisição
    setTimeout(() => {
      this.carregando = false;
      this.mostrarModalSenha = false;
      this.mensagem = { tipo: 'sucesso', texto: 'Senha alterada com sucesso!' };

      setTimeout(() => {
        this.mensagem = null;
      }, 3000);
    }, 1000);
  }
}
