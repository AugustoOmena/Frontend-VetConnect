import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ButtonComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../shared/main.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email ]),
      password: this.fb.control('', [Validators.required]),
    });

    // Recupere a mensagem de erro da URL
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['error'] || '';
    });
  }

  login(){
    this.errorMessage = '';
    this.successMessage = '';
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe( 
        data => {
          this.successMessage = `Login Realizado com sucesso, Bem vindo!`;
          console.log(data.data.accessToken)
          localStorage.setItem('accessToken', data.data.accessToken);
          this.router.navigate(['home']);
        },
        error => {
          this.errorMessage = error.error;
          localStorage.removeItem('accessToken');
        }
      );
  }
}