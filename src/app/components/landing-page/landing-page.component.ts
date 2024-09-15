import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [RouterLink, MatButtonModule, CommonModule, MatIconModule],
})
export class LandingPageComponent {
  features = [
    {
      icon: 'people',
      title: 'Manage Employees',
      description: 'Easily add, edit, and organize employee information',
    },
    {
      icon: 'list',
      title: 'Custom Lists',
      description: 'Create and sort custom employee lists',
    },
    {
      icon: 'access_time',
      title: 'Time Tracking',
      description: 'Monitor work hours and attendance',
    },
    {
      icon: 'security',
      title: 'Data Security',
      description: 'Keep your employee data safe and secure',
    },
  ];
}
