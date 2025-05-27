import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.css'
})
export class ErrorAlertComponent implements OnInit {
  errorMessage: string | null = null;
  @Output() clear = new EventEmitter<void>();

  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.authService.errorMessage$.subscribe(msg => this.errorMessage = msg);  
  }


  clearError() {
    this.authService.setMessage(null);
    this.clear.emit();
  }
}
