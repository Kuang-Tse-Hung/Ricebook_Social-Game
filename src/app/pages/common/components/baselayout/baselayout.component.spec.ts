import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaselayoutComponent } from './baselayout.component';
import { MatMenuModule } from '@angular/material/menu';
import { BaselayoutService } from '../../services/baselayout.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { of } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user';

class MockBaselayoutService {
  addTrackedUser(user: any) {
    // mock implementation or just leave it empty if you don't need a specific behavior
    return of(true);
  }

  removeTrackedUser(user: any) {
    // mock implementation or just leave it empty if you don't need a specific behavior
    return of(true);
  }
}


class MockAuthService {
  getUser() {
    return of([]);
  }

  getUserByName(name: string) {
    return of(null as any);
  }
}

describe('BaselayoutComponent', () => {
  let component: BaselayoutComponent;
  let fixture: ComponentFixture<BaselayoutComponent>;
  let mockRouter: any;
  let mockAuthService: MockAuthService;

  beforeEach(() => setupTestEnvironment());

  it('should create the component', () => verifyComponentCreation());

  it('should handle user logout', () => testUserLogout());

  it('should update user status', () => testEditUserStatus());

  it('should add a new follower', () => testAddNewFollower());

  it('should avoid adding an existing follower', () => testDuplicateFollowerAddition());

  it('should allow follower removal', () => testFollowerRemoval());

  // Setup and Helper Functions
  function setupTestEnvironment() {
    mockRouter = createMockRouter();
    mockAuthService = new MockAuthService();

    TestBed.configureTestingModule(defineTestModuleConfig()).compileComponents();

    fixture = TestBed.createComponent(BaselayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function createMockRouter() {
    return { navigate: jasmine.createSpy('navigate') };
  }

  function defineTestModuleConfig() {
    return {
      declarations: [BaselayoutComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
      providers: [
        { provide: BaselayoutService, useClass: MockBaselayoutService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    };
  }

  function verifyComponentCreation() {
    expect(component).toBeTruthy();
  }

  function testUserLogout() {
    setMockLoginState();

    component.logout();

    expectUserLoggedOutSuccessfully();
  }

  function setMockLoginState() {
    localStorage.setItem('loginUserName', 'testuser');
    localStorage.setItem('loginUserId', '123');
    localStorage.setItem('registerInfo', 'info');
    localStorage.setItem('userStatus', 'status');
    localStorage.setItem('followers', 'followers');
  }

  function expectUserLoggedOutSuccessfully() {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../']);
    expect(localStorage.getItem('loginUserName')).toBeNull();
    expect(localStorage.getItem('loginUserId')).toBeNull();
    expect(localStorage.getItem('registerInfo')).toBeNull();
    expect(localStorage.getItem('userStatus')).toBeNull();
    expect(localStorage.getItem('followers')).toBeNull();
    expect(component.LoggedOutState).toBeTrue();
  }

  function testEditUserStatus() {
    const mockStatus = 'New Status';
    component.inputStatus = mockStatus;

    component.editStatus();

    expect(localStorage.getItem('userStatus')).toBe(mockStatus);
    expect(component.userStatus).toBe(mockStatus);
    expect(component.inputStatus).toBe('');
  }

  function testAddNewFollower() {
    const mockUser = createMockUser();
    component.inputFollower = 'johndoe';
    spyOn(mockAuthService, 'getUserByName').and.returnValue(of(mockUser));

    component.addFollower();

    expect(component.followers).toContain(mockUser);
    expect(component.notificationMessage).toBe('');
  }

  function testDuplicateFollowerAddition() {
    const mockUser = createMockUser();
    component.inputFollower = 'johndoe';
    component.followers.push(mockUser);
    spyOn(mockAuthService, 'getUserByName').and.returnValue(of(mockUser));

    component.addFollower();

    expect(component.followers.filter(user => user.id === mockUser.id).length).toBe(1);
    expect(component.notificationMessage).toBe('User is already a follower');
  }

  function testFollowerRemoval() {
    const mockUser = createMockUser();
    component.followers.push(mockUser);

    component.unfollow(mockUser);

    expect(component.followers).not.toContain(mockUser);
  }

  function createMockUser(): User {
    return {
      id: 10,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 4B',
        city: 'Townsville',
        zipcode: '12345',
        geo: { lat: '10', lng: '10' }
      },
      phone: '123-456-7890',
      website: 'johndoe.com',
      company: {
        name: 'Doe Inc.',
        catchPhrase: 'Doe a deer',
        bs: 'doe-bs'
      }
    };
  }
});
