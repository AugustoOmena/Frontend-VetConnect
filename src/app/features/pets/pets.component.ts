import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { PagedList } from "../../shared/models/genericPagedList";
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadComponent } from "../../shared/components/load/load.component";
import { User } from '../../shared/models/user';
import { Pet, PetParams } from '../../shared/models/pet';
import { PetService } from '../../core/services/Pet';
import { ToastComponent } from "../../shared/components/toast/toast.component";
import { ModalModePet } from '../../shared/Enums/modalmode';
import { PetsFilter } from '../../shared/models/petsFilter';
import { EPetType } from '../../shared/Enums/epettype';
import { petTypeEnumMapping } from '../../shared/mapping/petTypeEnumMapping';
import { GeneralFormat } from '../../shared/format/generalFormat';

declare var bootstrap: any;

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    LoadComponent,
    ToastComponent,
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
  providers: [DatePipe, GeneralFormat]
})
export class PetsComponent implements OnInit {
  selectedPet: Pet | undefined;
  pets: Pet[] = [];
  isLoading: boolean = true;
  isSuccess: boolean = false;
  textModal: ModalModePet = ModalModePet.NovoServico;
  users: User[] = [];

  filterForm!: FormGroup;
  createPetForm!: FormGroup;

  editUserPet: Pet | undefined;
  editUserPetType: string = "";

  ModalModePet = ModalModePet;
  selectedPetToDelete!: Pet;

  petTypes = Object.values(EPetType);
  EPetType = EPetType;

  constructor(
    private fb: FormBuilder, private userPet: PetService, 
    private petService: PetService,
    public generalFormat: GeneralFormat
    ) {}


    ngOnInit(): void {
      this.createPetForm = this.fb.group({
        name: this.fb.control('', Validators.required),
        petType: this.fb.control('', Validators.required),
        race: this.fb.control('', Validators.required),
        birthDate: this.fb.control(0, Validators.required),
      });
      
      this.filterForm = this.fb.group({
        name: this.fb.control(''),
        startAgeDate: this.fb.control(''),
        endAgeDate: this.fb.control(''),
      });

      this.createPetForm.get('selectedUser')?.valueChanges.subscribe((userId) => {
        if (userId && this.textModal === ModalModePet.NovoServico) {
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
      const filters: PetsFilter = this.filterForm.value;
  
      this.userPet.fetchPets(filters).subscribe((value: PagedList<Pet>) => {
          this.pets = value.data.itens;
          console.log(this.pets);
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
    this.textModal = ModalModePet.NovoServico
    this.isLoading = true;
    this.cleanCreatePetForm()

    this.fetchUsers();
  }

  editServiceModalOpen(pet : Pet): void {
    this.isLoading = true;

    console.log(pet)

    this.textModal = ModalModePet.EditandoServico

    this.editUserPetType = this.getPetTypeLabel(pet.petType);
    this.editUserPet = pet;
    this.selectedPet = pet;

    this.createPetForm.reset({
      name: pet.name,
      petType: pet.petType,
      race: pet.race,
      birthDate: [this.generalFormat.formatDateForInput(this.editUserPet.birthDate)]
    });

    this.isLoading = false;
  }

  deleteServiceModalOpen(pet: Pet): void {
    this.isLoading = true;
    this.textModal = ModalModePet.DeleteServico
    this.cleanCreatePetForm()

    this.selectedPetToDelete = pet;

    this.fetchUsers();
  }

  fetchUsers(): void {
    this.petService.fetchPets().subscribe({
      next: (response: PagedList<Pet>) => {
        this.pets = response.data.itens;
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

    const petTypeValue = this.createPetForm.get('petType')?.value;

    const petTypeEnumValue = petTypeEnumMapping[petTypeValue as keyof typeof petTypeEnumMapping];

    const birthDate = this.createPetForm.get('birthDate')?.value;

    const birthDateUTC = new Date(birthDate).toISOString();

    const serviceParams: PetParams = {
    name: this.createPetForm.get('name')?.value,
    petType: petTypeEnumValue,
    race: this.createPetForm.get('race')?.value,
    birthDate: birthDateUTC,
  };

  this.userPet.createPet(serviceParams).subscribe({
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

    const petParams: PetParams = {
    petId: this.editUserPet?.id || '',
    name: this.createPetForm.get('name')?.value,
    petType: this.createPetForm.get('petType')?.value,
    race: this.createPetForm.get('race')?.value,
    birthDate: this.createPetForm.get('birthDate')?.value
  };

  this.userPet.editPet(petParams).subscribe({
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

  deletePet(): void {
    this.isLoading = true;
    this.textModal = ModalModePet.DeleteServico
    this.cleanCreatePetForm()

    const id = this.selectedPetToDelete?.id

    this.userPet.deletePet(id).subscribe({
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

  getPetTypeLabel(petType?: number): string {
    const petTypeKeys = Object.keys(this.EPetType) as Array<keyof typeof EPetType>;

    var resp = "desconhecido"
    
    if (petType) {
      resp = this.EPetType[petTypeKeys[petType]]
      return resp;
    } 

    return resp;
  }
}
