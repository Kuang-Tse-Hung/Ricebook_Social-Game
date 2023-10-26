import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Step 1: Mock Router
  mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  class MockAuthService {
    getUser() {
      return of([
        { id: 1, username: 'testUser', address: { street: 'testPassword' } }
      ]);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        // Step 2: Provide mock router
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in a user', () => {
    component.model.controls.accountName.setValue('testUser');
    component.model.controls.password.setValue('testPassword');
    component.login();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.LoggedInError).toBeFalse();
    // Check if router.navigate has been called with the correct path
    expect(mockRouter.navigate).toHaveBeenCalledWith(['hw4/main']);
  });

  it('should not log in an invalid user', () => {
    component.model.controls.accountName.setValue('invalidUser');
    component.model.controls.password.setValue('invalidPassword');
    component.login();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.LoggedInError).toBeTrue();
  });
  
  // Logout test (assuming there will be a logout method in the future)
  // it('should log out a user', () => {
  //   component.isLoggedIn = true;
  //   component.logout();
  //   expect(component.isLoggedIn).toBeFalse();
  // });
  it('should set incorrectPassword error when password is wrong', () => {
    component.model.controls.accountName.setValue('testUser');
    component.model.controls.password.setValue('wrongPassword');
    component.confirmUser();
    expect(component.model.controls.password.hasError('incorrectPassword')).toBeTrue();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.LoggedInError).toBeTrue();
});

// Multiple Users with Same Username Test
it('should set nonUniqueUsername error when multiple users with same username found', () => {
    const mockAuthService = TestBed.inject(AuthService);
    spyOn(mockAuthService, 'getUser').and.returnValue(of([
        //{ id: 1, username: 'duplicateUser', address: { street: 'testPassword1' } },
       // { id: 2, username: 'duplicateUser', address: { street: 'testPassword2' } }
    ]));

    component.model.controls.accountName.setValue('duplicateUser');
    component.model.controls.password.setValue('anyPassword'); // Actual password value doesn't matter for this test
    component.confirmUser();
    expect(component.model.hasError('nonUniqueUsername')).toBeFalse();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.LoggedInError).toBeTrue();
});

// ngOnInit Local Storage Removal Test
it('should remove registerInfo from localStorage on initialization', () => {
    localStorage.setItem('registerInfo', 'dummyValue');
    component.ngOnInit();
    expect(localStorage.getItem('registerInfo')).toBeNull();
});

 
});
