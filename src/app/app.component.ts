import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fed-murakami-pay';
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const excludedRoutes = ['/login', '/error'];
      this.showSidebar = !excludedRoutes.includes(this.router.url);
    });
  }
}
