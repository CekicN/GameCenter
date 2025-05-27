import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorAlertComponent } from '../../error-alert/error-alert.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
type: string = "password";
  isText : boolean = false;
  registerForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router)
  {
  }

  ngOnInit():void{
    this.registerForm=this.fb.group({
      email: ['',[Validators.required]],
      password:['',[Validators.required]],
      confirm_password:['', [Validators.required]]
    })
  }

  onSubmit()
  {
    if(this.registerForm.valid)
    {
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      const confirmPassword = this.registerForm.value.confirm_password;
      this.authService.signupUser(email, password, confirmPassword).subscribe(user => {
          this.authService.loginUser(email, password).subscribe(token => {
            this.authService.changeisAuthenticatedState();
            localStorage.setItem("ACCESS_TOKEN", token.accessToken)
            this.router.navigateByUrl("/games")
          })
      })
    }
    else
    {
      this.validateAllFormsFields(this.registerForm)
      alert("Form is incorrect");
    }
  }
  private validateAllFormsFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({
          onlySelf:true
        });
      }else if(control instanceof FormGroup){
        this.validateAllFormsFields(control);
      }
    })
  }
}
