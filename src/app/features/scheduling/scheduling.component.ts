import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetService } from '../../core/services/Pet';
import { UserServiceHistory } from '../../core/services/serviceHistory';
import { UserServices } from '../../core/services/user';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { LoadComponent } from '../../shared/components/load/load.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ModalModeScheduling, ModalModeService } from '../../shared/Enums/modalmode';
import { EServiceType } from '../../shared/Enums/eserviceType';
import { ServiceTypeEnumMapping } from '../../shared/mapping/serviceTypeEnumMapping';
import { PagedList } from '../../shared/models/genericPagedList';
import { ServiceHistory, ServiceHistoryParams } from '../../shared/models/serviceHistory';
import { ServiceHistoryFilter } from '../../shared/models/serviceHistoryFilter';
import { User } from '../../shared/models/user';
import { SchedulingService } from '../../core/services/scheduling';
import { Scheduling } from '../../shared/models/scheduling';
import { EAttendanceStatus } from '../../shared/Enums/eattendancestatus';

declare var bootstrap: any;

@Component({
  selector: 'app-scheduling',
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
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent implements OnInit {
  serviceType: ServiceHistory | undefined;
  serviceHistory: any[] = [];
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

  EAttendanceStatus = EAttendanceStatus;

  EServiceType = EServiceType;

  constructor(
    private fb: FormBuilder, 
    private userServiceHistory: UserServiceHistory, 
    private schedulingServiceHistory: SchedulingService, 
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
  
      this.schedulingServiceHistory.fetchSchedulings(filters).subscribe((value: PagedList<Scheduling>) => {
          this.serviceHistory = value.data.itens;
          console.log("Here", this.serviceHistory);
          this.isLoading = false;
      });
  }

  createNewSchedulingModalOpen(): void {
    this.isLoading = true;
    this.textModal = ModalModeScheduling.NovoAgendamento

    this.cleanCreatePetForm()
    this.isLoading = false;
  }

  editServiceModalOpen(service : ServiceHistory): void {
    this.isLoading = true;

    console.log(service)

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

    console.log("Valor selecionado (ServiceType):", serviceTypeValue);
    console.log("Valor correspondente no ServiceTypeEnumMapping:", selectedServiceTypeValue);


    
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
 
     console.log("Valor selecionado (ServiceType):", serviceTypeValue);
     console.log("Valor correspondente no ServiceTypeEnumMapping:", selectedServiceTypeValue);
    
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




  getStatusScheduling(schedulingType?: number): string {
    const schedulingTypeKeys = Object.keys(this.EAttendanceStatus) as Array<keyof typeof EAttendanceStatus>;

    var resp = "desconhecido"
    
    if (schedulingType || schedulingType == 0) {
      resp = this.EAttendanceStatus[schedulingTypeKeys[schedulingType]]
      return resp;
    } 

    return resp;
  }

  getServiceType(serviceType?: number): string {
    const petTypeKeys = Object.keys(this.EServiceType) as Array<keyof typeof EServiceType>;

    var resp = "desconhecido"
    
    if (serviceType || serviceType == 0) {
      resp = this.EServiceType[petTypeKeys[serviceType]]
      return resp;
    } 

    return resp;
  }

  getStatusClass(attendanceStatus: number): string {
    switch (attendanceStatus) {
      case 0:
        return 'badge rounded-pill text-bg-primary';
      case 1:
        return 'badge rounded-pill text-bg-warning';
      case 2:
        return 'badge rounded-pill text-bg-secondary';
      default:
        return 'badge rounded-pill text-bg-light';
    }
  }
}
