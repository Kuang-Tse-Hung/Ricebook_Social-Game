import { User } from './../../../auth/interfaces/user';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileForm } from '../../interfaces/profile-form';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loginUserId = '';
  loginUserInfo?: User;
  isEditMode = false; // To control the edit mode
  selectedFile: any = null;

  profileForm = new FormGroup<ProfileForm>({
    username: new FormControl('', [Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    const registerInfo = localStorage.getItem('registerInfo');
    if (registerInfo) {
      const registerInfoOb = JSON.parse(registerInfo);
      this.profileForm.controls.username.setValue(registerInfoOb.accountName);
      this.profileForm.controls.phone.setValue(registerInfoOb.phoneNumber);
      this.profileForm.controls.email.setValue(registerInfoOb.emailAddress);
      this.profileForm.controls.zipcode.setValue(registerInfoOb.zipcode);
      this.profileForm.controls.password.setValue(registerInfoOb.password);
    }
    else {
      this.loginUserId = localStorage.getItem('loginUserId') ?? '';
      this.profileService.getUser(this.loginUserId).subscribe((data) => {
        this.profileForm.controls.username.setValue(data.username);
        this.profileForm.controls.phone.setValue(data.phone);
        this.profileForm.controls.email.setValue(data.email);
        this.profileForm.controls.zipcode.setValue(data.address.zipcode);
        this.profileForm.controls.password.setValue(data.address.street);
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveProfile(): void {
    // Update the loginUserInfo object with new values
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileForm.controls.username.setValue(this.profileForm.controls.username.value);
    this.profileForm.controls.phone.setValue(this.profileForm.controls.phone.value);
    this.profileForm.controls.email.setValue(this.profileForm.controls.email.value);
    this.profileForm.controls.zipcode.setValue(this.profileForm.controls.zipcode.value);
    this.profileForm.controls.password.setValue(this.profileForm.controls.password.value);
    this.toggleEditMode();
  }

}
