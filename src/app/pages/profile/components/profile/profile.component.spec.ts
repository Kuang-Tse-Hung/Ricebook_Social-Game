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
    localStorage.clear();
  });

  it('should fetch logged-in user profile username', () => {
    localStorage.setItem('loginUserId', 'testUserId');
    fixture.detectChanges();
    expect(mockProfileService.getUser).toHaveBeenCalledWith('testUserId');
    expect(component.profileForm.controls.username.value).toBe('testUsername');
  });

  it('should handle file selection', () => {
    const mockEvent = {
      target: {
        files: [ 'test-file' ]
      }
    };
    component.onFileSelected(mockEvent);
    expect(component.selectedFile).toBe('test-file');
  });

  it('should toggle edit mode', () => {
    component.isEditMode = false;
    component.toggleEditMode();
    expect(component.isEditMode).toBe(true);
    component.toggleEditMode();
    expect(component.isEditMode).toBe(false);
  });

  it('should not save the profile when the form is invalid', () => {
    const spyToggleEditMode = spyOn(component, 'toggleEditMode');
    component.profileForm.setErrors({ invalid: true });
    component.saveProfile();
    expect(spyToggleEditMode).not.toHaveBeenCalled();
  });

  it('should save the profile when the form is valid', () => {
    const spyToggleEditMode = spyOn(component, 'toggleEditMode');
    component.profileForm.controls.username.setValue('testUser');
    component.profileForm.controls.phone.setValue('123-456-7890');
    component.profileForm.controls.email.setValue('test@example.com');
    component.profileForm.controls.zipcode.setValue('12345');
    component.profileForm.controls.password.setValue('testPassword');
    component.saveProfile();
    expect(spyToggleEditMode).toHaveBeenCalled();
  });
  
 
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
