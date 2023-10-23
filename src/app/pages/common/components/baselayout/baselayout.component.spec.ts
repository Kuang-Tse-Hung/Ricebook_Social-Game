import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaselayoutComponent } from './baselayout.component';
import { MatMenuModule } from '@angular/material/menu';
import { BaselayoutService } from '../../services/baselayout.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { of } from 'rxjs';

class MockBaselayoutService {
  // Provide mock methods if required by the component
}

// Mock the AuthService (minimal structure)
class MockAuthService {
  getUser() {
    // Return a dummy observable
    return of([]);
  }
  getUserByName(name: string) {
    // Return a dummy observable
    return of(null);
  }
}

describe('BaselayoutComponent', () => {
  let component: BaselayoutComponent;
  let fixture: ComponentFixture<BaselayoutComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [BaselayoutComponent],
      imports: [
        HttpClientTestingModule,
        MatMenuModule
      ],
      providers: [
        { provide: BaselayoutService, useClass: MockBaselayoutService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaselayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out a user and clear login state', () => {
    // Mock initial login state
    localStorage.setItem('loginUserName', 'testuser');
    localStorage.setItem('loginUserId', '123');
    localStorage.setItem('registerInfo', 'info');
    localStorage.setItem('userStatus', 'status');
    localStorage.setItem('followers', 'followers');

    component.logout();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../']);
    expect(localStorage.getItem('loginUserName')).toBeNull();
    expect(localStorage.getItem('loginUserId')).toBeNull();
    expect(localStorage.getItem('registerInfo')).toBeNull();
    expect(localStorage.getItem('userStatus')).toBeNull();
    expect(localStorage.getItem('followers')).toBeNull();
    expect(component.LoggedOutState).toBeTrue();
  });
});
