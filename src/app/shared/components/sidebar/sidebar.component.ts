import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'dashboardUser-sidebar',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu toggle state:', this.isMenuOpen);
  }
}