import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EUserType } from '../../Enums/eusertype';
import { AppService } from '../../../core/services/app.services';

@Component({
  selector: 'dashboardUser-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isMenuOpen = false;

  constructor(
    private appService: AppService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  validateProfile = (profiles: EUserType[]) => this.appService.validateProfile(profiles);
}