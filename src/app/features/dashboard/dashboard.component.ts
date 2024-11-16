import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { CommonModule } from '@angular/common';
import { EUserType } from '../../shared/Enums/eusertype';
import { AppService } from '../../core/services/app.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterModule,
    ButtonComponent,
    CommonModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private appService: AppService
  ) {}

  validateProfile = (profiles: EUserType[]) => this.appService.validateProfile(profiles);
}
