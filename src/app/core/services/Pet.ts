import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";
import { Pet } from "../../shared/models/pet";

@Injectable({
    providedIn: 'root'
  })
export class PetService {
    filtro: string = '';

    constructor(private http:HttpClient){}

    fetchPetsByUserId(userId: string): Observable<PagedList<Pet>> {
        if (!userId) {
            throw new Error("User ID é nescessário.");
        }

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<Pet>>(`${environment.apiUrl}/v1/Backoffice/Pets/User/${userId}`, { headers });
    }

}