import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterationComponent } from './registeration.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
class MockAuthService {
  getUsernames() {
    return of(['testUser1', 'testUser2']);
  }
}

// Mocking Router
class MockRouter {
  navigate(routes: any[]) { }
}

describe('RegisterationComponent', () => {
  let authService: AuthService;
  let router: Router;
  let component: RegisterationComponent;
  let fixture: ComponentFixture<RegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RegisterationComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate if password and confirmPassword match', () => {
    let passwordsGroup = component.registerModel;
  
    // Matching passwords
    passwordsGroup.get('password')?.setValue('Password123');
    passwordsGroup.get('confirmPassword')?.setValue('Password123');
    expect(component.passwordsMatchValidator()(passwordsGroup)).toBeNull();
  
    // Mismatching passwords
    passwordsGroup.get('password')?.setValue('Password123');
    passwordsGroup.get('confirmPassword')?.setValue('OtherPassword123');
    expect(component.passwordsMatchValidator()(passwordsGroup)).toEqual({ notMatching: true });
  });
  it('should validate age based on date of birth', () => {
    const control = component.registerModel.get('dateOfBirth');
    if (control) { // Check if control is non-null
      // Age less than 18
      control.setValue('2010-01-01');
      expect(component.dateOfBirthValidator()(control)).toEqual({ tooYoung: true });
  
      // Age 18 or more
      control.setValue('2000-01-01');
      expect(component.dateOfBirthValidator()(control)).toBeNull();
    } else {
      fail('dateOfBirth control should exist.');
    }
  });
     
  it('should handle registration process', () => {
    spyOn(authService, 'getUsernames').and.returnValue(of(['testUser1', 'testUser2']));
    spyOn(router, 'navigate');
  
    // Assume the form is valid and the username is not taken
    component.registerModel.patchValue({
      accountName: 'testUser1',
      password: 'Password123',
      confirmPassword: 'Password123',
      emailAddress: 'test@email.com',
      phoneNumber: '123-456-7890',
      dateOfBirth: '2000-01-01',
      zipcode: '12345'
    });
  
    component.register();
    expect(component.usernameTaken).toBe(true);
    //expect(router.navigate).toHaveBeenCalledWith(['hw4/main']);
  });
  
  it('should not attempt registration if form is invalid', () => {
    spyOn(authService, 'getUsernames'); // Ensure this method isn't called
    spyOn(router, 'navigate');

    // Make form invalid by keeping some fields empty
    component.registerModel.patchValue({
        accountName: '',
        password: '',
        confirmPassword: '',
        emailAddress: '',
        phoneNumber: '',
        dateOfBirth: '',
        zipcode: ''
    });

    component.register();

    // Ensure getUsernames wasn't called because the form is invalid
    expect(authService.getUsernames).not.toHaveBeenCalled();
    // Ensure we didn't navigate because the form is invalid
    expect(router.navigate).not.toHaveBeenCalled();
});

it('should handle successful registration', () => {
    spyOn(authService, 'getUsernames').and.returnValue(of(['testUser1', 'testUser2']));
    spyOn(router, 'navigate');

    // Assume the form is valid and the username is not taken
    component.registerModel.patchValue({
        accountName: 'newUser3',
        password: 'Password123',
        confirmPassword: 'Password123',
        emailAddress: 'testnew@email.com',
        phoneNumber: '123-456-7890',
        dateOfBirth: '2000-01-01',
        zipcode: '12345'
    });

    component.register();

    // Username is not in the list, so it's not taken
    expect(component.usernameTaken).toBe(false);
    // Check if the user info has been saved to localStorage
    const registerInfo = JSON.parse(localStorage.getItem('registerInfo') || '{}');
    expect(registerInfo.accountName).toBe('newUser3');
    expect(localStorage.getItem('loginUserName')).toBe('newUser3');
    // Ensure we navigate to the correct route after successful registration
    expect(router.navigate).toHaveBeenCalledWith(['hw4/main']);
});
});
