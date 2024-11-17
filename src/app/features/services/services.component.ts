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
import { PetService } from '../../core/services/Pet';
import { ToastComponent } from "../../shared/components/toast/toast.component";
import { ModalModeScheduling } from '../../shared/Enums/modalmode';
import { EServiceType } from '../../shared/Enums/eserviceType';
import { ServiceTypeEnumMapping } from '../../shared/mapping/serviceTypeEnumMapping';


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
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  serviceType: ServiceHistory | undefined;
  serviceHistory:ServiceHistory[] = [];
  isLoading: boolean = true;
  isSuccess: boolean = false;
  textModal: ModalModeScheduling = ModalModeScheduling.NovoAgendamento;
  users: User[] = [];
  serviceTypes = Object.values(EServiceType);

  filterForm!: FormGroup;
  createServiceForm!: FormGroup;

  editServiceName: string | undefined;

  ModalModeScheduling = ModalModeScheduling;
  selectedServiceToDelete!: ServiceHistory;

  constructor(
    private fb: FormBuilder, private userServiceHistory: UserServiceHistory, 
    private userService: UserServices,
    private petService: PetService
  ) {}

    ngOnInit(): void {
      this.createServiceForm = this.fb.group({
        serviceType: ['', Validators.required],
        name: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
        price: this.fb.control(0, Validators.required)
      });
      
      this.filterForm = this.fb.group({
        name: this.fb.control(''),
        description: this.fb.control(''),
        price: this.fb.control(''),
      });
  
      this.applyFilters();
    }

  cleanCreatePetForm(){
    this.createServiceForm.reset();
    this.createServiceForm.get('price')?.setValue(0);
  }
  
  applyFilters(): void {
      const filters: ServiceHistoryFilter = this.filterForm.value;
  
      this.userServiceHistory.fetchServiceHistory(filters).subscribe((value: PagedList<ServiceHistory>) => {
          this.serviceHistory = value.data.itens;
          console.log("Here", this.serviceHistory);
          this.isLoading = false;
      });
  }

  createNewServiceModalOpen(): void {
    this.isLoading = true;
    this.textModal = ModalModeScheduling.NovoAgendamento

    this.cleanCreatePetForm()
    this.isLoading = false;
  }

  editServiceModalOpen(service : ServiceHistory): void {
    this.isLoading = true;

    this.textModal = ModalModeScheduling.EditandoAgendamento

    this.editServiceName = service.name;

    this.serviceType = service;

    this.createServiceForm.reset({
      selectedService: [this.editServiceName],

      name: service.name,
      description: service.description,
      price: service.price
    });

    this.isLoading = false;
  }

  deleteServiceModalOpen(serviceHistory: ServiceHistory): void {
    this.isLoading = true;
    this.textModal = ModalModeScheduling.DeleteAgendamento
    this.cleanCreatePetForm()

    this.selectedServiceToDelete = serviceHistory;
    this.isLoading = false;
  }


  createNewService(): void {
    this.isLoading = true;

    const serviceTypeValue = this.createServiceForm.get('serviceType')?.value;

    const selectedServiceTypeValue = ServiceTypeEnumMapping[serviceTypeValue as keyof typeof ServiceTypeEnumMapping];

    const serviceParams: ServiceHistoryParams = {
    name: this.createServiceForm.get('name')?.value,
    description: this.createServiceForm.get('description')?.value,
    price: this.createServiceForm.get('price')?.value,
    serviceType: selectedServiceTypeValue,
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

     const serviceTypeValue = this.createServiceForm.get('serviceType')?.value;

     const selectedServiceTypeValue = ServiceTypeEnumMapping[serviceTypeValue as keyof typeof ServiceTypeEnumMapping];
    
    const serviceParams: ServiceHistoryParams = {
    serviceId: this.serviceType?.id,
    name: this.createServiceForm.get('name')?.value,
    description: this.createServiceForm.get('description')?.value,
    price: this.createServiceForm.get('price')?.value,
    serviceType: selectedServiceTypeValue
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
    this.textModal = ModalModeScheduling.DeleteAgendamento
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
  }

  getServiceTypeLabel(serviceType?: number): string {
    if (serviceType === undefined || serviceType === null) {
      return 'Desconhecido'; 
    }
  
    const serviceTypeLabel = ServiceTypeEnumMapping[serviceType];
  
    return serviceTypeLabel ? serviceTypeLabel : 'Desconhecido';
  }
}
