import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router) { }

  createEvent() {
    // TODO: Implementar modal o página de creación de eventos
    alert('Funcionalidad "Crear Evento" próximamente');
  }

  openSettings() {
    this.router.navigate(['/profile']);
  }
}
