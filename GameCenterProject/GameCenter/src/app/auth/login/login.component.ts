import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  type: string = "password";
  isText : boolean = false;
  loginForm!: FormGroup;
  
  constructor(private fb: FormBuilder)
  {
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
      
      console.log(email, password)
    }
    else
    {
      this.validateAllFormsFields(this.loginForm)
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
