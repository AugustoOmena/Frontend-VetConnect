import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UserServiceHistory } from '../../core/services/serviceHistory';
import { ServiceHistory, ServiceHistoryParams } from '../../shared/models/serviceHistory';
import { CommonModule } from '@angular/common';
import { PagedList } from "../../shared/models/genericPagedList";
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ServiceHistoryFilter } from '../../shared/models/serviceHistoryFilter';
import { LoadComponent } from "../../shared/components/load/load.component";
import { User } from '../../shared/models/user';
import { UserServices } from '../../core/services/user';
import { Pet } from '../../shared/models/pet';
import { PetService } from '../../core/services/Pet';
import { ToastComponent } from "../../shared/components/toast/toast.component";
import { ModalMode } from '../../shared/Enums/modalmode';

declare var bootstrap: any;

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    LoadComponent,
    ToastComponent
],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  selectedService: ServiceHistory | undefined;
  serviceHistory:ServiceHistory[] = [];
  isLoading: boolean = true;
  isSuccess: boolean = false;
  textModal: ModalMode = ModalMode.NovoServico;
  users: User[] = [];
  pets: Pet[] = [];

  filterForm!: FormGroup;
  createPetForm!: FormGroup;

  editUserName: string | undefined;
  editUserPet: Pet | undefined;

  ModalMode = ModalMode;
  selectedServiceToDelete!: ServiceHistory;

  constructor(
    private fb: FormBuilder, private userServiceHistory: UserServiceHistory, 
    private userService: UserServices,
    private petService: PetService
  ) {}

    ngOnInit(): void {
      this.createPetForm = this.fb.group({
        selectedUser: ['', Validators.required],
        selectedPetUser: ['', Validators.required],
        name: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
        price: this.fb.control(0, Validators.required),
      });
      
      this.filterForm = this.fb.group({
        name: this.fb.control(''),
        description: this.fb.control(''),
        petOwnerName: this.fb.control(''),
      });

      this.createPetForm.get('selectedUser')?.valueChanges.subscribe((userId) => {
        if (userId && this.textModal === ModalMode.NovoServico) {
          this.loadPetsByUserId(userId);
        }
      });
  
      this.applyFilters();
    }

  cleanCreatePetForm(){
    this.createPetForm.reset();
    this.createPetForm.get('price')?.setValue(0);
  }
  
  applyFilters(): void {
      const filters: ServiceHistoryFilter = this.filterForm.value;
  
      this.userServiceHistory.fetchServiceHistory(filters).subscribe((value: PagedList<ServiceHistory>) => {
          this.serviceHistory = value.data.itens;
          console.log(this.serviceHistory);
          this.isLoading = false;
      });
  }

  loadPetsByUserId(userId: string): void {
    this.isLoading = true;
    this.petService.fetchPetsByUserId(userId).subscribe({
      next: (response: PagedList<Pet>) => {
        this.pets = response.data.itens;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar pets:", error);
        this.isLoading = false;
      }
    });
  }


  createNewServiceModalOpen(): void {
    this.textModal = ModalMode.NovoServico
    this.isLoading = true;
    this.cleanCreatePetForm()

    this.fetchUsers();
  }

  editServiceModalOpen(service : ServiceHistory): void {
    this.isLoading = true;

    console.log(service)

    this.textModal = ModalMode.EditandoServico

    this.editUserName = service.pet?.userName;
    this.editUserPet = service.pet;
    this.selectedService = service;

    this.createPetForm.reset({
      selectedUser: [this.editUserName],
      selectedPetUser: [this.editUserPet],
      name: service.name,
      description: service.description,
      price: service.price
    });

    this.isLoading = false;
  }

  deleteServiceModalOpen(serviceHistory: ServiceHistory): void {
    this.isLoading = true;
    this.textModal = ModalMode.DeleteServico
    this.cleanCreatePetForm()

    this.selectedServiceToDelete = serviceHistory;

    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers().subscribe({
      next: (response: PagedList<User>) => {
        this.users = response.data.itens;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar usuários:", error);
        this.isLoading = false;
      }
    });
  }

  createNewService(): void {
    this.isLoading = true;
    
    const serviceParams: ServiceHistoryParams = {
    name: this.createPetForm.get('name')?.value,
    description: this.createPetForm.get('description')?.value,
    price: this.createPetForm.get('price')?.value,
    petId: this.createPetForm.get('selectedPetUser')?.value,
  };

  this.userServiceHistory.createServiceHistory(serviceParams).subscribe({
    next: (response) => {
      this.applyFilters();
      this.isSuccess = true;
      setTimeout(() => {
        this.isSuccess = false;
      }, 1200);  
      const myModalEl = document.getElementById('createEditDeleteModal');
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide(); 
    },
    error: (error) => {
      console.error("Erro ao criar serviço:", error);
      this.isLoading = false;
    }
  });
  }

  editSelectedService(): void {
    this.isLoading = true;
    
    const serviceParams: ServiceHistoryParams = {
    name: this.createPetForm.get('name')?.value,
    description: this.createPetForm.get('description')?.value,
    price: this.createPetForm.get('price')?.value,
    petId: this.editUserPet?.id || '',
    serviceId: this.selectedService?.id
  };

  this.userServiceHistory.editServiceHistory(serviceParams).subscribe({
    next: (response) => {
      this.applyFilters();
      this.isSuccess = true;
      setTimeout(() => {
        this.isSuccess = false;
      }, 1200);  
      const myModalEl = document.getElementById('createEditDeleteModal');
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide(); 
    },
    error: (error) => {
      console.error("Erro ao editar serviço:", error);
      this.isLoading = false;
    }
  });
  }

  deleteService(): void {
    this.isLoading = true;
    this.textModal = ModalMode.DeleteServico
    this.cleanCreatePetForm()

    const id = this.selectedServiceToDelete?.id

    this.userServiceHistory.deleteServiceHistory(id).subscribe({
      next: (response) => {
        this.applyFilters();
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
        }, 1200);  
        const myModalEl = document.getElementById('createEditDeleteModal');
            const modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide(); 
      },
      error: (error) => {
        console.error("Erro ao editar serviço:", error);
        this.isLoading = false;
      }
    });

    this.fetchUsers();
  }

}
