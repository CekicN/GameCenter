import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{

  isLogged!:boolean;
  constructor(private flowbite:FlowbiteService, private authService:AuthService, private router:Router){
    
  }
  
  ngOnInit(): void {
    this.flowbite.loadFlowbite(fb => {})
    this.authService.isLogged$.subscribe(isLogged => this.isLogged = isLogged);
  }

  logout()
  {
    localStorage.removeItem("ACCESS_TOKEN")
    this.router.navigateByUrl("/")
    this.authService.changeisAuthenticatedState();
  }
}
