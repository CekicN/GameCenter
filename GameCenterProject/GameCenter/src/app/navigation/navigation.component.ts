import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{
  constructor(private flowbite:FlowbiteService){
    
  }
  
  ngOnInit(): void {
    this.flowbite.loadFlowbite(fb => {})
  }
}
