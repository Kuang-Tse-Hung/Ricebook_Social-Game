import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for logging in a user
  it('should log in a user', () => {
    // Assuming you have a login method on your component and isLoggedIn state
    component.login();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should be valid user', () => {
    // Assuming you have a login method on your component and isLoggedIn state
    component.confirmUser();
    expect(component.LoggedInError).toBeFalse();
  });
});
