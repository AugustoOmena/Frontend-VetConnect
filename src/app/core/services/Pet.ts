import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";
import { Pet, PetParams } from "../../shared/models/pet";
import { PetsFilter } from "../../shared/models/petsFilter";
import { BaseResponse } from "../../shared/models/baseResponse";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class PetService {
    filtro: string = '';

    responseData!: BaseResponse;

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

    fetchPets(filter?: PetsFilter): Observable<PagedList<Pet>> {
        this.filtro = '';

        if (filter?.name || filter?.startAgeDate || filter?.endAgeDate) {
            const filterParams = new URLSearchParams();
            if (filter.name) filterParams.append('name', filter.name);
            if (filter.startAgeDate) filterParams.append('startAgeDate', filter.startAgeDate);
            if (filter.endAgeDate) filterParams.append('endAgeDate', filter.endAgeDate);
            
            this.filtro = `?${filterParams.toString()}`;
        }

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<Pet>>(`${environment.apiUrl}/api/Pets/v1/List/Pets${this.filtro}`, { headers });
    }

    createPet(params: PetParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<BaseResponse>(`${environment.apiUrl}/api/Pets/v1/Create/Pet`, params, { headers }).pipe(
            tap(pet => this.responseData = pet)
          );
    }

    editPet(params: PetParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.patch<BaseResponse>(`${environment.apiUrl}/api/Pets/v1/Edit/Pet/${params.petId}`, params, { headers }).pipe(
            tap(pet => this.responseData = pet)
          );
    }

    deletePet(id: String): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete<BaseResponse>(`${environment.apiUrl}/api/Pets/v1/Delete/Pet/${id}`, { headers }).pipe(
            tap(pet => this.responseData = pet)
          );
    }
}