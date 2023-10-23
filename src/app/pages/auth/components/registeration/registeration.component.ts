import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Adjust the path if necessary


@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.scss']
})
export class RegisterationComponent implements OnInit {
  hidePwd = true;
  usernameTaken: boolean = false;

  registerModel = new FormGroup({
    accountName: new FormControl('', [Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$')]),
    dateOfBirth: new FormControl('', [Validators.required, this.dateOfBirthValidator()]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]) // US zip code format
  }, { validators: this.passwordsMatchValidator() });

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password && confirmPassword && password === confirmPassword ? null : { notMatching: true };
    };
  }

  dateOfBirthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date();
      const birthDate = new Date(control.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        return { tooYoung: true };
      }
      return null;
    };
  }

  register() {
    if (this.registerModel.valid) {
      const enteredAccountName = this.registerModel.get('accountName')?.value || '';

      
      this.authService.getUsernames().subscribe(usernames => {
        if (usernames.includes(enteredAccountName)) {
          this.usernameTaken = true;
        } else {
          this.usernameTaken = false;
          const formData = this.registerModel.value;
          const registerInfo = {
            accountName: enteredAccountName,
            password: this.registerModel.get('password')?.value ?? '',
            emailAddress: this.registerModel.get('emailAddress')?.value ?? '',
            phoneNumber: this.registerModel.get('phoneNumber')?.value ?? '',
            zipcode: this.registerModel.get('zipcode')?.value ?? '',
          }
          localStorage.setItem('registerInfo', JSON.stringify(registerInfo));
          localStorage.setItem('loginUserName', enteredAccountName);
          this.router.navigate(['hw4/main']);
        }
      });
    } else {
      // Handle invalid form data
      // Inform the user about the validation errors
    }
  }
}
