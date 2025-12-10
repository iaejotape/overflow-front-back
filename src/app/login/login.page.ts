import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
})
export class LoginPage {

  username: string = '';
  password: string = '';

  rememberMe: boolean = false;

  carregando = false;
  erro: string | null = null;

  // Erros de validação inline
  erros = {
    username: '',
    password: ''
  };

  // Controle de campos tocados
  touched = {
    username: false,
    password: false
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastCtrl: ToastController
  ) {}

  async mostrarToast(msg: string, cor: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  // Validar campo de username/email
  validarUsername(): boolean {
    if (!this.username.trim()) {
      this.erros.username = 'Usuário ou email é obrigatório.';
      return false;
    }
    if (this.username.trim().length < 3) {
      this.erros.username = 'Usuário deve ter pelo menos 3 caracteres.';
      return false;
    }
    this.erros.username = '';
    return true;
  }

  // Validar campo de senha
  validarPassword(): boolean {
    if (!this.password) {
      this.erros.password = 'Senha é obrigatória.';
      return false;
    }
    if (this.password.length < 6) {
      this.erros.password = 'Senha deve ter pelo menos 6 caracteres.';
      return false;
    }
    this.erros.password = '';
    return true;
  }

  // Marcar campo como tocado e validar
  onBlur(campo: 'username' | 'password') {
    this.touched[campo] = true;
    if (campo === 'username') {
      this.validarUsername();
    } else {
      this.validarPassword();
    }
  }

  // Validar em tempo real enquanto digita
  onInput(campo: 'username' | 'password') {
    if (this.touched[campo]) {
      if (campo === 'username') {
        this.validarUsername();
      } else {
        this.validarPassword();
      }
    }
  }

  // Validar formulário completo
  validarFormulario(): boolean {
    const usernameValido = this.validarUsername();
    const passwordValido = this.validarPassword();
    return usernameValido && passwordValido;
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.erro = null;

    // Marcar todos os campos como tocados
    this.touched.username = true;
    this.touched.password = true;

    if (!this.validarFormulario()) {
      this.erro = 'Corrija os erros nos campos abaixo.';
      return;
    }

    this.carregando = true;

    this.auth.login(this.username, this.password)
      .pipe(
        catchError(err => {

          console.log("ERRO COMPLETO:", JSON.stringify(err, null, 2));
          console.log("ERRO STATUS:", err.status);
          console.log("ERRO BODY:", err.error);

          let mensagemErro = 'Erro ao fazer login. Tente novamente.';

          if (err.status === 401) {
            mensagemErro = 'Usuário ou senha incorretos.';
          } else if (err.status === 400) {
            if (err.error && typeof err.error === 'object') {
              const primeiroErro = Object.values(err.error)[0];
              mensagemErro = Array.isArray(primeiroErro) ? primeiroErro[0] : String(primeiroErro);
            } else {
              mensagemErro = 'Dados inválidos. Verifique suas credenciais.';
            }
          } else if (err.status === 0) {
            mensagemErro = 'Sem conexão com o servidor. Verifique sua internet.';
          } else if (err.status === 500) {
            mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
          }

          this.erro = mensagemErro;
          this.mostrarToast(mensagemErro, 'danger');

          this.carregando = false;
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem("overflow_user", JSON.stringify(res.user));
          this.carregando = false;
          this.router.navigate(['/dashboard']);
        }
      });
  }

  navigateToSignup() {
    this.router.navigate(['/cadastrar']);
  }

  forgotPassword() {
    console.log('Forgot password clicado');
  }

  socialLogin(provider: string) {
    console.log(`Social login com ${provider}`);
  }
}
