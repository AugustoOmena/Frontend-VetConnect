import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environments";
import { BaseResponse } from "../../shared/models/baseResponse";
import { tap } from 'rxjs/operators';
import { AttendanceParams } from "../../shared/models/attendance";

@Injectable({
    providedIn: 'root'
  })
export class AttendanceService {

    responseData!: BaseResponse;

    constructor(private http:HttpClient){}

    editAttendance(params: AttendanceParams): Observable<BaseResponse> {
        const token = localStorage.getItem('accessToken');

        const id = params.attendanceId;
        params.attendanceId = undefined;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.patch<BaseResponse>(`${environment.apiUrl}/v1/Backoffice/Edit/Attendance/AttendanceId/${id}`, params, { headers }).pipe(
            tap(scheduling => this.responseData = scheduling)
          );
    }

}