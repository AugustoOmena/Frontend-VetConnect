import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ServiceHistoryParams } from "../../shared/models/serviceHistory";
import { environment } from "../../../environments/environments";
import { PagedList } from "../../shared/models/genericPagedList";
import { BaseResponse } from "../../shared/models/baseResponse";
import { tap } from 'rxjs/operators';
import { Scheduling, SchedulingParams } from "../../shared/models/scheduling";
import { SchedulingFilter } from "../../shared/models/SchedulingFilter";

@Injectable({
    providedIn: 'root'
  })
export class SchedulingService {
    filtro: string = '';
    responseData!: BaseResponse;

    constructor(private http:HttpClient){}

    fetchSchedulings(filter?: SchedulingFilter): Observable<PagedList<Scheduling>> {
        this.filtro = '';

        if (filter?.startDate || filter?.description || filter?.endDate) {
            const filterParams = new URLSearchParams();
            if (filter.startDate) {
                const startDateUTC = new Date(filter.startDate).toISOString();
                filterParams.append('startDate', startDateUTC);
            }
    
            if (filter.endDate) {
                const endDateUTC = new Date(filter.endDate).toISOString();
                filterParams.append('endDate', endDateUTC);
            }
            if (filter.description) filterParams.append('description', filter.description);
            
            this.filtro = `?${filterParams.toString()}`;
        }

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<PagedList<Scheduling>>(`${environment.apiUrl}/v1/Commom/Scheduling/List${this.filtro}`, { headers });
    }

    createScheduling(params: SchedulingParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');
        const id = params.serviceId;

        if (params.initialDate) {
            const startDateUTC = new Date(params.initialDate).toISOString();
            params.initialDate = startDateUTC;
        }

        if (params.endDate) {
            const endDateUTC = new Date(params.endDate).toISOString();
            params.endDate = endDateUTC;
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<BaseResponse>(`${environment.apiUrl}/v1/Common/Create/Scheduling/Pet/${params.petId}`, params, { headers }).pipe(
            tap(scheduling => this.responseData = scheduling)
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