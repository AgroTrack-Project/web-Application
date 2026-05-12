import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [
    NavbarComponent,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
