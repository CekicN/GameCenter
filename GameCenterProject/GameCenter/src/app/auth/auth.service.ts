import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURLAuth = "http://localhost:3000/auth"

  private isLoggedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLogged$:Observable<boolean> = this.isLoggedSubject.asObservable();

  private errorMessage:BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);
  public errorMessage$:Observable<string|null> = this.errorMessage.asObservable();
  constructor(
    private http: HttpClient
  ) {}

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLAuth}/login`, { email, password }).pipe(
          catchError(err => {
            this.setMessage(err.error.message)
            return throwError(() => err)
          })
        );
  }
  signupUser(email:string, password:string, confirmPassword:string)
  {
    return this.http.post<any>(`${this.apiURLAuth}/register`, {email, password, confirmPassword}).pipe(
          catchError(err => {
            this.setMessage(err.error.message)
            return throwError(() => err)
          })
        );
  }
  changeisAuthenticatedState()
  {
    this.isLoggedSubject.next(!this.isLoggedSubject.value)
  }

  setMessage(msg:string|null)
  {
    this.errorMessage.next(msg);
  }
}