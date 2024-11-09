import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ServiceHistory, ServiceHistoryParams } from "../../shared/models/serviceHistory";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";
import { ServiceHistoryFilter } from "../../shared/models/serviceHistoryFilter";
import { BaseResponse } from "../../shared/models/baseResponse";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class UserServiceHistory {
    filtro: string = '';
    responseData!: BaseResponse;

    constructor(private http:HttpClient){}

    fetchServiceHistory(filter?: ServiceHistoryFilter): Observable<PagedList<ServiceHistory>> {
        this.filtro = '';

        if (filter?.name || filter?.description || filter?.petOwnerName) {
            const filterParams = new URLSearchParams();
            if (filter.name) filterParams.append('name', filter.name);
            if (filter.description) filterParams.append('description', filter.description);
            if (filter.petOwnerName) filterParams.append('petOwnerName', filter.petOwnerName);
            
            this.filtro = `?${filterParams.toString()}`;
        }

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<ServiceHistory>>(`${environment.apiUrl}/v1/Backoffice/ListAll/Services${this.filtro}`, { headers });
    }

    createServiceHistory(params: ServiceHistoryParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<BaseResponse>(`${environment.apiUrl}/v1/Backoffice/Create/ServiceByPetId/${params.petId}`, params, { headers }).pipe(
            tap(serviceHistory => this.responseData = serviceHistory)
          );
    }

    editServiceHistory(params: ServiceHistoryParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.patch<BaseResponse>(`${environment.apiUrl}/v1/Backoffice/Edit/Service/${params.serviceId}`, params, { headers }).pipe(
            tap(serviceHistory => this.responseData = serviceHistory)
          );
    }

    deleteServiceHistory(id: String): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete<BaseResponse>(`${environment.apiUrl}/v1/Backoffice/Delete/Service/${id}`, { headers }).pipe(
            tap(serviceHistory => this.responseData = serviceHistory)
          );
    }
}