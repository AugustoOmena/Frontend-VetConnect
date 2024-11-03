import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Lembre-se de Tipar a requisição de acordo com a sua nescessidade
  responseData!: any;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.responseData !== undefined;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/connect/token`, {
      email: email,
      password: password
    }).pipe(
      tap(user => this.responseData = user)
    );
  }
}
