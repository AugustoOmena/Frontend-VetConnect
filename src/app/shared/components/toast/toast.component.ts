import { Component, AfterViewInit } from '@angular/core';

declare const bootstrap: any; // Declaração para acessar o Bootstrap JavaScript

@Component({
  selector: 'shared-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements AfterViewInit {

  ngAfterViewInit() {
   
  }
}
