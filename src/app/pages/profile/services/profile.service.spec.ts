import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { User } from '../../auth/interfaces/user';
import { environment } from 'src/environments/environment';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    const dummyUser: User = {
      id: 1,
      name: 'John Doe',
      username: 'john.doe',
      email: 'john.doe@example.com',
      address: {
        street: '123 Elm Street',
        suite: 'Apt. 456',
        city: 'Sample City',
        zipcode: '12345',
        geo: {
          lat: '34.0522',
          lng: '-118.2437'
        }
      },
      phone: '123-456-7890',
      website: 'https://johndoe.com',
      company: {
        name: 'Doe Enterprises',
        catchPhrase: 'Innovation through Simplicity',
        bs: 'innovative solutions for modern challenges'
      }
    };

    const userId = '1';

    service.getUser(userId).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });
});
