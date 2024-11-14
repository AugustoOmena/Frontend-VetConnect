import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GeneralFormat {
    constructor(
        private datePipe: DatePipe
      ) {}

    formatDate(dateString: string | null): string {
        return dateString ? this.datePipe.transform(dateString, 'dd/MM/yyyy') || '' : '';
      }
    
      formatDateForInput(dateString: string): string {
        return dateString ? dateString.split('T')[0] : '';
      }
}  