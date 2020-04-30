import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {MaterialService} from '../../clasess/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild('floating') floatingRef: ElementRef;

  links = [
    {url: '/overview', name: 'Overview'},
    {url: '/analytics', name: 'Analytics'},
    {url: '/history', name: 'History'},
    {url: '/order', name: 'Add Order'},
    {url: '/category', name: 'Categories'}
  ];

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
