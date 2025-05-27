import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  type: string = "password";
  isText : boolean = false;
  loginForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router)
  {
    library.add(faGoogle)
  }

  ngOnInit():void{
    this.loginForm=this.fb.group({
      email: ['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }

  onSubmit()
  {
    if(this.loginForm.valid)
    {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      
      this.authService.loginUser(email, password).subscribe(res => {
        this.authService.changeisAuthenticatedState();
        localStorage.setItem("ACCESS_TOKEN", res.accessToken)
        this.router.navigateByUrl("/games")
      })
    }
    else
    {
      this.validateAllFormsFields(this.loginForm)
      alert("Form is incorrect");
    }
  }
  googleLogin()
  {
    window.location.href = "http://localhost:3000/auth/google/login";
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
