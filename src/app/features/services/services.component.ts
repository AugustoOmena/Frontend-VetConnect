import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserServiceHistory } from '../../core/services/serviceHistory';
import { ServiceHistory } from '../../shared/models/serviceHistory';
import { CommonModule } from '@angular/common';
import { PagedList } from "../../shared/models/genericPagedList";
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ServiceHistoryFilter } from '../../shared/models/serviceHistoryFilter';
import { LoadComponent } from "../../shared/components/load/load.component";
import { User } from '../../shared/models/user';
import { UserServices } from '../../core/services/user';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    LoadComponent
],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  serviceHistory:ServiceHistory[] = [];
  isLoading: boolean = true;
  users: User[] = [];

  filterForm!: FormGroup;
  createPetForm!: FormGroup;

  constructor(
    private fb: FormBuilder, private userServiceHistory: UserServiceHistory, 
    private userService: UserServices) {}

    ngOnInit(): void {
      this.createPetForm = this.fb.group({
        selectedUser: [''],
        name: this.fb.control(''),
        description: this.fb.control(''),
        price: this.fb.control(0),
      });
      
      this.filterForm = this.fb.group({
        name: this.fb.control(''),
        description: this.fb.control(''),
        petOwnerName: this.fb.control(''),
      });
  
      this.applyFilters();
  }
  
  applyFilters(): void {
      const filters: ServiceHistoryFilter = this.filterForm.value;
  
      this.userServiceHistory.fetchServiceHistory(filters).subscribe((value: PagedList<ServiceHistory>) => {
          this.serviceHistory = value.data.itens;
          console.log(this.serviceHistory);
          this.isLoading = false;
      });
  }

  createModal(): void {
    this.isLoading = true;

    this.userService.fetchUsers().subscribe({
      next: (response: PagedList<User>) => {
        this.users = response.data.itens;
        console.log(this.users)
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar usuários:", error);
        this.isLoading = false;
      }
    });
  }

}
