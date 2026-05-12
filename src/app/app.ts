import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/presentation/components/navbar/navbar';
import { SidebarComponent } from './shared/presentation/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
