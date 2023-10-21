import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../../interfaces/form';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, filter, iif, map, of, tap } from 'rxjs';
import { AbstractControl } from '@angular/forms';



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
      map(users => users.filter(user => user.username === this.model.controls.accountName.value)),
      tap(matchingUsers => {
        if (matchingUsers.length === 0) {
          this.LoggedInError = true;
          this.isLoggedIn = false; // User not found
          this.model.controls.accountName.setErrors({ userNotFound: true });
        } else if (matchingUsers.length === 1) {
          const user = matchingUsers[0];
          if (user.address.street === this.model.controls.password.value) { // Note: Consider using a more secure password strategy
            this.isLoggedIn = true; 
            this.LoggedInError = false;
            this.router.navigate(['hw4/main']);
            localStorage.setItem('loginUserName', user.username);
            localStorage.setItem('loginUserId', user.id.toString());
          } else {
            this.LoggedInError = true;
            this.isLoggedIn = false; // Incorrect password
            this.model.controls.password.setErrors({ incorrectPassword: true });
          }
        } else { 
          // Multiple users with the same username is a problem, consider reporting or handling this case
          this.LoggedInError = true;
          this.isLoggedIn = false;
          this.model.setErrors({ nonUniqueUsername: true });
        }
      })
    ).subscribe();
  }
}
