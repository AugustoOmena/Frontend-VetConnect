import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  isMenuOpen = false;
  perfil!: any;

  constructor(
    private appService: AppService
  ) {}

  ngOnInit(): void {
    const accessUser = JSON.parse(localStorage.getItem('accessUser') || '{}');

    this.perfil = accessUser;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getStatusClass(attendanceStatus: number): string {
    return EUserType[attendanceStatus]
  }

  validateProfile = (profiles: EUserType[]) => this.appService.validateProfile(profiles);
}