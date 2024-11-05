import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserServices } from '../../core/services/serviceHistory';
import { ServiceHistory } from '../../shared/models/serviceHistory';
import { CommonModule } from '@angular/common';
import { PagedList } from "../../shared/models/genericPagedList";
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ServiceHistoryFilter } from '../../shared/models/serviceHistoryFilter';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  serviceHistory:ServiceHistory[] = [];
  isLoading: boolean = true;

  filterForm!: FormGroup;


  constructor(
    private fb: FormBuilder, private UserServices: UserServices) {}

    ngOnInit(): void {
      this.filterForm = this.fb.group({
        name: this.fb.control(''),
        description: this.fb.control(''),
        petOwnerName: this.fb.control(''),
      });
  
      this.applyFilters();
  }
  
  applyFilters(): void {
      const filters: ServiceHistoryFilter = this.filterForm.value;
  
      this.UserServices.fetchServiceHistory(filters).subscribe((value: PagedList<ServiceHistory>) => {
          this.serviceHistory = value.data.itens;
          console.log(this.serviceHistory);
          this.isLoading = false;
      });
  }

}
