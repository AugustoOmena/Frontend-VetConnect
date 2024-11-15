import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { LoadComponent } from "../../../shared/components/load/load.component";
import { AppService } from '../../../core/services/app.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ButtonComponent,
    LoginComponent,
    LoadComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../shared/main.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService
            ) {}

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
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe( 
        data => {
          this.successMessage = `Login Realizado com sucesso, Bem vindo!`;

          localStorage.setItem('accessToken', data.data.accessToken);
          this.appService.storeUser(data.data.user);

          this.router.navigate(['home']);
          this.isLoading = false;
        },
        error => {
          this.errorMessage = error.error;
          localStorage.removeItem('accessToken');
          this.isLoading = false;
        }
      );
  }
}