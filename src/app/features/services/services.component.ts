import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserServices } from '../../core/services/serviceHistory';
import { ServiceHistory } from '../../shared/models/serviceHistory';
import { CommonModule } from '@angular/common';
import { PagedList } from "../../shared/models/genericPagedList";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [SidebarComponent,
    CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  serviceHistory:ServiceHistory[] = [];

  constructor(
    private UserServices: UserServices) {}

  ngOnInit(): void {
    this.UserServices.fetchServiceHistory()?.subscribe((value: PagedList<ServiceHistory>) => {      
      this.serviceHistory = value.data.itens;
      console.log(this.serviceHistory)
    })
  }

}
