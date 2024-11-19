import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PetService } from '../../core/services/Pet';
import { UserServiceHistory } from '../../core/services/serviceHistory';
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
import { Scheduling, SchedulingParams } from '../../shared/models/scheduling';
import { EAttendanceStatus } from '../../shared/Enums/eattendancestatus';
import { environment } from '../../../environments/environments';
import { Pet } from '../../shared/models/pet';
import { EUserType } from '../../shared/Enums/eusertype';
import { AppService } from '../../core/services/app.services';
import { AttendanceParams } from '../../shared/models/attendance';
import { AttendanceService } from '../../core/services/attendance';

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
  textModal: string = ModalModeService.NovoServico ;
  users: User[] = [];
  pets: Pet[] = [];
  services: ServiceHistory[] = [];
  serviceTypes = Object.values(EServiceType);
  EServiceType = EServiceType;

  filterForm!: FormGroup;
  createServiceForm!: FormGroup;
  attendanceForm!: FormGroup;

  editServiceName: string | undefined;

  ModalModeScheduling = ModalModeScheduling;
  selectedServiceToDelete!: ServiceHistory;
  selectedSchedule!: any;

  EAttendanceStatus = EAttendanceStatus;


  attendanceStatus = Object.values(EAttendanceStatus);

  constructor(
    private fb: FormBuilder, 
    private schedulingServiceHistory: SchedulingService,
    private attendanceService: AttendanceService,
    private ServiceHistory: SchedulingService,
    private userServiceHistory: UserServiceHistory,
    private petService: PetService,
    private appService: AppService,
  ) {}

    ngOnInit(): void {
      this.createServiceForm = this.fb.group({
        initialDate: ['', Validators.required],
        endDate: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
        serviceId: this.fb.control(0, Validators.required),
        petId: this.fb.control(0, Validators.required),
      });
      
      this.filterForm = this.fb.group({
        description: this.fb.control(''),
        startDate: this.fb.control(''),
        endDate: this.fb.control(''),
      });

      this.attendanceForm = this.fb.group({
        description: this.fb.control(''),
        prescription: this.fb.control(''),
        attendanceStatus: this.fb.control(0, Validators.required),
      });
  
      this.applyFilters();
    }

  cleanCreatePetForm(){
    this.createServiceForm.reset();
    this.createServiceForm.get('price')?.setValue(0);
  }

  cleanAttendanceForm(){
    this.attendanceForm = this.fb.group({
      description: this.fb.control(''),
      prescription: this.fb.control(''),
      attendanceStatus: this.fb.control(0, Validators.required),
    });
  }
  
  applyFilters(): void {
      const filters: ServiceHistoryFilter = this.filterForm.value;
  
      this.schedulingServiceHistory.fetchSchedulings(filters).subscribe((value: PagedList<Scheduling>) => {
          this.serviceHistory = value.data.itens;
          this.isLoading = false;
      });
  }

  loadServicesByUser(): void {
    this.isLoading = true;
    this.userServiceHistory.fetchServiceHistoryToClient().subscribe({
      next: (response: PagedList<ServiceHistory>) => {
        this.services = response.data.itens;
      },
      error: (error) => {
        console.error("Erro ao carregar os serviços cadastrados:", error);
      }
    });
  }


  loadPetsByUser(): void {
    this.isLoading = true;

    const accessUser = JSON.parse(localStorage.getItem(environment.localStore.user) || '{}');

    const userId = accessUser?.id;

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


  createNewSchedulingModalOpen(): void {
    this.isLoading = true;
    this.loadServicesByUser();
    this.loadPetsByUser();
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

  attendanceModalOpen(serviceHistory: ServiceHistory): void {
    this.isLoading = true;
    this.cleanCreatePetForm();
    this.cleanAttendanceForm();

    this.selectedSchedule = serviceHistory;

    this.selectedServiceToDelete = serviceHistory;
    this.isLoading = false;
  }

  attendance(): void {
    this.isLoading = true;

    const attendanceParams: AttendanceParams = {
    attendanceId: this.selectedSchedule.attendance.id,
    description: this.attendanceForm.get('description')?.value,
    prescription: this.attendanceForm.get('prescription')?.value,
    attendanceStatus: +this.attendanceForm.get('attendanceStatus')?.value
  };

  this.attendanceService.editAttendance(attendanceParams).subscribe({
    next: (response) => {
      this.applyFilters();
      this.isSuccess = true;
      setTimeout(() => {
        this.isSuccess = false;
      }, 1200);  
      const myModalEl = document.getElementById('AttendanceModal');
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide(); 
    },
    error: (error) => {
      console.error("Erro ao criar serviço:", error);
      this.isLoading = false;
    }
  });
  }


  createNewSchedule(): void {
    this.isLoading = true;

    const serviceParams: SchedulingParams = {
    initialDate: this.createServiceForm.get('initialDate')?.value,
    endDate: this.createServiceForm.get('endDate')?.value,
    description: this.createServiceForm.get('description')?.value,
    serviceId: this.createServiceForm.get('serviceId')?.value,
    petId: this.createServiceForm.get('petId')?.value,
  };

  this.schedulingServiceHistory.createScheduling(serviceParams).subscribe({
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

  // this.userServiceHistory.editServiceHistory(serviceParams).subscribe({
  //   next: (response) => {
  //     this.applyFilters();
  //     this.isSuccess = true;
  //     setTimeout(() => {
  //       this.isSuccess = false;
  //     }, 1200);  
  //     const myModalEl = document.getElementById('createEditDeleteModal');
  //         const modal = bootstrap.Modal.getInstance(myModalEl);
  //         modal.hide(); 
  //   },
  //   error: (error) => {
  //     console.error("Erro ao editar serviço:", error);
  //     this.isLoading = false;
  //   }
  // });
  }

  deleteService(): void {
    this.isLoading = true;
    this.textModal = ModalModeService.DeleteServico
    this.cleanCreatePetForm()

    const id = this.selectedServiceToDelete?.id

    // this.userServiceHistory.deleteServiceHistory(id).subscribe({
    //   next: (response) => {
    //     this.applyFilters();
    //     this.isSuccess = true;
    //     setTimeout(() => {
    //       this.isSuccess = false;
    //     }, 1200);  
    //     const myModalEl = document.getElementById('createEditDeleteModal');
    //         const modal = bootstrap.Modal.getInstance(myModalEl);
    //         modal.hide(); 
    //   },
    //   error: (error) => {
    //     console.error("Erro ao editar serviço:", error);
    //     this.isLoading = false;
    //   }
    // });
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

  validateProfile = (profiles: EUserType[]) => this.appService.validateProfile(profiles);
}
