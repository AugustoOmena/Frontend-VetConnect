import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";
import { User } from "../../shared/models/user";

@Injectable({
    providedIn: 'root'
  })
export class UserServices {
    filtro: string = '';

    constructor(private http:HttpClient){}

    fetchUsers(): Observable<PagedList<User>> {
        this.filtro = '';

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<User>>(`${environment.apiUrl}/v1/Backoffice/List/Users${this.filtro}`, { headers });
    }

}