import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-service-attendance',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './service-attendance.component.html',
  styleUrl: './service-attendance.component.css'
})
export class ServiceAttendanceComponent {

}
