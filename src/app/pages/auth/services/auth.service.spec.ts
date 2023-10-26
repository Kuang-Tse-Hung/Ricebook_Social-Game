import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Ensure that no requests are outstanding.
  });

  it('should retrieve all users', () => {
    const mockUsers = [
      { 
        id: 1, 
        username: 'John', 
        accountName: 'John1', 
        name: 'John Doe', 
        email: 'john1@example.com', 
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '123-456-7890',
        website: 'johndoe.com',
        company: { name: '', catchPhrase: '', bs: '' }
      },
      { 
        id: 2, 
        username: 'Jane', 
        accountName: 'Jane1', 
        name: 'Jane Doe', 
        email: 'jane1@example.com', 
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '123-456-7891',
        website: 'janedoe.com',
        company: { name: '', catchPhrase: '', bs: '' }
      }
    ];

    service.getUser().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve usernames', () => {
    const mockUsers = [
      { username: 'John' }, 
      { username: 'Jane' }
    ];

    service.getUsernames().subscribe(usernames => {
      expect(usernames).toEqual(['John', 'Jane']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve a user by name', () => {
    const mockUsers = [
      { 
        id: 1, 
        username: 'John', 
        accountName: 'John1', 
        name: 'John Doe', 
        email: 'john1@example.com', 
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '123-456-7890',
        website: 'johndoe.com',
        company: { name: '', catchPhrase: '', bs: '' }
      }
    ];

    service.getUserByName('John').subscribe(user => {
      expect(user).toEqual(mockUsers[0]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users?username=John`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should register a user', () => {
    const mockUserResponse = {
      id: 1,
      username: 'John',
      name: 'John Doe',
      email: 'johndoe@example.com',
      accountName: 'JohnDoe',
      password: 'password123',
      confirmPassword: 'password123',
      address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
      phone: '123-456-7890',
      website: 'johndoe.com',
      company: { name: '', catchPhrase: '', bs: '' },
      dateOfBirth: '2000-01-01',
      zipcode: '12345'
    };
    
    service.registerUser(mockUserResponse).subscribe(user => {
      expect(user).toEqual(mockUserResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserResponse);
  });
});
