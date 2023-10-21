import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../services/profile.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockProfileService: any;

  beforeEach(async () => {
    // Create a mock profile service
    mockProfileService = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({
        username: 'testUsername',
        phone: '123-456-7890',
        email: 'test@example.com',
        address: {
          zipcode: '12345',
          street: 'testStreet'
        }
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ProfileService, useValue: mockProfileService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    // Clear local storage before each test
    localStorage.clear();
  });

  it('should fetch logged-in user profile username', () => {
    // Simulate that registerInfo is not in localStorage, but loginUserId is
    localStorage.setItem('loginUserId', 'testUserId');

    // Trigger the ngOnInit method
    fixture.detectChanges();

    expect(mockProfileService.getUser).toHaveBeenCalledWith('testUserId');
    expect(component.profileForm.controls.username.value).toBe('testUsername');
  });

  // Add more tests as needed
});
