import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ServiceHistory } from "../../shared/models/serviceHistory";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";

@Injectable({
    providedIn: 'root'
  })
export class UserServices {
    filtro: string = '';

    constructor(private http:HttpClient){}

    fetchServiceHistory(): Observable<PagedList<ServiceHistory>> {
        this.filtro = '';

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<ServiceHistory>>(`${environment.apiUrl}/v1/Backoffice/ListAll/Services${this.filtro}`, { headers });
    }

}