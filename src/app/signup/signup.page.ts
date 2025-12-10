import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService, CadastroPayload } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
})
export class SignupPage {
  nome: string = '';
  username: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  tipoUsuario: 'estudante' | 'professor' | '' = '';
  aceitaTermos: boolean = false;

  carregando = false;
  erro: string | null = null;
  sucesso: string | null = null;

  // Erros de validação inline
  erros = {
    nome: '',
    username: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: '',
    aceitaTermos: ''
  };

  // Controle de campos tocados
  touched = {
    nome: false,
    username: false,
    email: false,
    senha: false,
    confirmarSenha: false,
    tipoUsuario: false,
    aceitaTermos: false
  };

  // Indicadores de força da senha
  forcaSenha = {
    nivel: 0, // 0-4
    texto: '',
    cor: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ============================================
  // VALIDAÇÕES DE CAMPOS
  // ============================================

  validarNome(): boolean {
    if (!this.nome.trim()) {
      this.erros.nome = 'Nome é obrigatório.';
      return false;
    }
    if (this.nome.trim().length < 3) {
      this.erros.nome = 'Nome deve ter pelo menos 3 caracteres.';
      return false;
    }
    if (this.nome.trim().length > 100) {
      this.erros.nome = 'Nome deve ter no máximo 100 caracteres.';
      return false;
    }
    this.erros.nome = '';
    return true;
  }

  validarUsername(): boolean {
    if (!this.username.trim()) {
      this.erros.username = 'Nome de usuário é obrigatório.';
      return false;
    }
    if (this.username.trim().length < 3) {
      this.erros.username = 'Nome de usuário deve ter pelo menos 3 caracteres.';
      return false;
    }
    if (this.username.trim().length > 30) {
      this.erros.username = 'Nome de usuário deve ter no máximo 30 caracteres.';
      return false;
    }
    // Verificar se contém apenas caracteres válidos
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(this.username.trim())) {
      this.erros.username = 'Use apenas letras, números e underscore (_).';
      return false;
    }
    this.erros.username = '';
    return true;
  }

  validarEmail(): boolean {
    if (!this.email.trim()) {
      this.erros.email = 'Email é obrigatório.';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.erros.email = 'Digite um email válido.';
      return false;
    }
    this.erros.email = '';
    return true;
  }

  validarSenha(): boolean {
    if (!this.senha) {
      this.erros.senha = 'Senha é obrigatória.';
      this.atualizarForcaSenha();
      return false;
    }
    if (this.senha.length < 8) {
      this.erros.senha = 'Senha deve ter pelo menos 8 caracteres.';
      this.atualizarForcaSenha();
      return false;
    }
    if (this.senha.length > 128) {
      this.erros.senha = 'Senha deve ter no máximo 128 caracteres.';
      this.atualizarForcaSenha();
      return false;
    }
    // Verificar complexidade
    const temMaiuscula = /[A-Z]/.test(this.senha);
    const temMinuscula = /[a-z]/.test(this.senha);
    const temNumero = /[0-9]/.test(this.senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.senha);

    if (!temMaiuscula || !temMinuscula || !temNumero) {
      this.erros.senha = 'Senha deve conter maiúscula, minúscula e número.';
      this.atualizarForcaSenha();
      return false;
    }

    this.erros.senha = '';
    this.atualizarForcaSenha();
    return true;
  }

  atualizarForcaSenha(): void {
    let pontos = 0;
    
    if (this.senha.length >= 8) pontos++;
    if (this.senha.length >= 12) pontos++;
    if (/[A-Z]/.test(this.senha) && /[a-z]/.test(this.senha)) pontos++;
    if (/[0-9]/.test(this.senha)) pontos++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.senha)) pontos++;

    this.forcaSenha.nivel = Math.min(pontos, 4);

    switch (this.forcaSenha.nivel) {
      case 0:
        this.forcaSenha.texto = '';
        this.forcaSenha.cor = '';
        break;
      case 1:
        this.forcaSenha.texto = 'Muito fraca';
        this.forcaSenha.cor = '#dc3545';
        break;
      case 2:
        this.forcaSenha.texto = 'Fraca';
        this.forcaSenha.cor = '#fd7e14';
        break;
      case 3:
        this.forcaSenha.texto = 'Boa';
        this.forcaSenha.cor = '#ffc107';
        break;
      case 4:
        this.forcaSenha.texto = 'Forte';
        this.forcaSenha.cor = '#28a745';
        break;
    }
  }

  validarConfirmarSenha(): boolean {
    if (!this.confirmarSenha) {
      this.erros.confirmarSenha = 'Confirmação de senha é obrigatória.';
      return false;
    }
    if (this.senha !== this.confirmarSenha) {
      this.erros.confirmarSenha = 'As senhas não coincidem.';
      return false;
    }
    this.erros.confirmarSenha = '';
    return true;
  }

  validarTipoUsuario(): boolean {
    if (!this.tipoUsuario) {
      this.erros.tipoUsuario = 'Selecione um tipo de usuário.';
      return false;
    }
    this.erros.tipoUsuario = '';
    return true;
  }

  validarTermos(): boolean {
    if (!this.aceitaTermos) {
      this.erros.aceitaTermos = 'Você precisa aceitar os termos para continuar.';
      return false;
    }
    this.erros.aceitaTermos = '';
    return true;
  }

  // ============================================
  // HANDLERS DE EVENTOS
  // ============================================

  onBlur(campo: string): void {
    (this.touched as any)[campo] = true;
    this.validarCampo(campo);
  }

  onInput(campo: string): void {
    if ((this.touched as any)[campo]) {
      this.validarCampo(campo);
    }
    // Atualizar força da senha em tempo real
    if (campo === 'senha') {
      this.atualizarForcaSenha();
    }
  }

  validarCampo(campo: string): void {
    switch (campo) {
      case 'nome': this.validarNome(); break;
      case 'username': this.validarUsername(); break;
      case 'email': this.validarEmail(); break;
      case 'senha': 
        this.validarSenha();
        // Revalidar confirmarSenha se já foi tocado
        if (this.touched.confirmarSenha) {
          this.validarConfirmarSenha();
        }
        break;
      case 'confirmarSenha': this.validarConfirmarSenha(); break;
      case 'tipoUsuario': this.validarTipoUsuario(); break;
      case 'aceitaTermos': this.validarTermos(); break;
    }
  }

  onTipoUsuarioChange(): void {
    this.touched.tipoUsuario = true;
    this.validarTipoUsuario();
  }

  // ============================================
  // VALIDAÇÃO COMPLETA DO FORMULÁRIO
  // ============================================

  validarFormulario(): boolean {
    const nomeValido = this.validarNome();
    const usernameValido = this.validarUsername();
    const emailValido = this.validarEmail();
    const senhaValida = this.validarSenha();
    const confirmarSenhaValida = this.validarConfirmarSenha();
    const tipoUsuarioValido = this.validarTipoUsuario();
    const termosValidos = this.validarTermos();

    return nomeValido && usernameValido && emailValido && 
           senhaValida && confirmarSenhaValida && tipoUsuarioValido && termosValidos;
  }

  marcarTodosCamposTocados(): void {
    this.touched = {
      nome: true,
      username: true,
      email: true,
      senha: true,
      confirmarSenha: true,
      tipoUsuario: true,
      aceitaTermos: true
    };
  }

  onSignup(event: Event) {
    event.preventDefault();
    this.erro = null;
    this.sucesso = null;

    // Marcar todos os campos como tocados
    this.marcarTodosCamposTocados();

    if (!this.validarFormulario()) {
      this.erro = 'Corrija os erros nos campos acima.';
      return;
    }

    const payload: CadastroPayload = {
      username: this.username,
      email: this.email,
      password: this.senha,
      confirmar_senha: this.confirmarSenha,
      nome: this.nome,
      data_nascimento: '2000-01-01', // Gambiarra para o back
      sexo: 'outro',
      tipo_usuario: this.tipoUsuario as 'estudante' | 'professor',
      aceitou_termos: this.aceitaTermos,
    };

    this.carregando = true;

    this.authService.cadastrar(payload).subscribe({
      next: (user) => {
        console.log('Cadastro OK:', user);
        this.carregando = false;
        this.sucesso = 'Cadastro realizado com sucesso! Redirecionando...';

        setTimeout(() => {
          this.router.navigate(['/entrar']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro no cadastro', err);
        this.carregando = false;

        // Tratar erros específicos do backend
        if (err.status === 0) {
          this.erro = 'Sem conexão com o servidor. Verifique sua internet.';
        } else if (err.status === 500) {
          this.erro = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (err.error && typeof err.error === 'object') {
          // Mapear erros do backend para campos específicos
          this.mapearErrosBackend(err.error);
          
          // Pegar primeira mensagem de erro para mostrar no banner
          const primeiroErro = Object.values(err.error)[0];
          if (Array.isArray(primeiroErro)) {
            this.erro = primeiroErro[0];
          } else if (typeof primeiroErro === 'string') {
            this.erro = primeiroErro;
          } else {
            this.erro = 'Não foi possível criar a conta. Verifique os dados.';
          }
        } else {
          this.erro = 'Não foi possível criar a conta agora. Tente novamente.';
        }
      },
    });
  }

  mapearErrosBackend(erros: any): void {
    // Mapear erros do backend para os campos do frontend
    if (erros.username) {
      this.erros.username = Array.isArray(erros.username) ? erros.username[0] : erros.username;
    }
    if (erros.email) {
      this.erros.email = Array.isArray(erros.email) ? erros.email[0] : erros.email;
    }
    if (erros.password) {
      this.erros.senha = Array.isArray(erros.password) ? erros.password[0] : erros.password;
    }
    if (erros.confirmar_senha) {
      this.erros.confirmarSenha = Array.isArray(erros.confirmar_senha) ? erros.confirmar_senha[0] : erros.confirmar_senha;
    }
    if (erros.nome) {
      this.erros.nome = Array.isArray(erros.nome) ? erros.nome[0] : erros.nome;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/entrar']);
  }

  openTerms() {
    console.log('Abrir Termos e Condições');
  }
}
