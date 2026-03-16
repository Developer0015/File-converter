import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <-- Critical for navigation!

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // <-- Add them here
  templateUrl: './navbar.html'
})
export class Navbar {
  // We can add mobile menu toggle logic here later!
}