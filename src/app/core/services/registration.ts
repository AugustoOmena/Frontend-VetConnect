import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // Lembre-se de Tipar a requisição de acordo com a sua necessidade
  responseData!: any;

  constructor(private http: HttpClient) {}

  isRegistered(): boolean {
    return this.responseData !== undefined;
  }

  register(firstName: string, lastName: string, phone: string, email: string, password: string, userType: number): Observable<any> {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password,
      userType: userType
    };

    return this.http.post<any>(`${environment.apiUrl}/api/Users/v1/Create`, payload).pipe(
      tap(user => this.responseData = user)
    );
  }
}
