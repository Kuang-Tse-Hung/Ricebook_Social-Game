import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../../interfaces/form';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, filter, iif, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  hidePwd = true;
  isLoggedIn = false; // Add the isLoggedIn state here
  LoggedInError = false;
  
  model = new FormGroup<LoginForm>({
    accountName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('registerInfo');
  }

  login() {
    this.isLoggedIn = true;
    
    if (this.model.invalid) {
      this.model.markAllAsTouched()
      return;
    }
   
    this.confirmUser();
  }

  confirmUser() {
    this.authService.getUser().pipe(
      // tap((x) => console.log(x)),
      map((x) => x.filter((u) => u.username === this.model.controls.accountName.value && u.address.street === this.model.controls.password.value)),
      tap((x) => {
        if (x.length > 0) {
          this.isLoggedIn = true; // Set isLoggedIn to true if user is valid
      
          this.router.navigate(['hw4/main']);
          localStorage.setItem('loginUserName', x[0].username)
          localStorage.setItem('loginUserId', x[0].id.toString())
        }
        else {
          this.LoggedInError = true;
          this.isLoggedIn = false; // Set isLoggedIn to false if user is not valid
          this.model.setErrors({ invalidUser: true });
        }
      })
    ).subscribe()
  }
}
