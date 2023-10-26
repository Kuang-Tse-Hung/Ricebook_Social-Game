import { TestBed } from '@angular/core/testing';
import { BaselayoutService } from './baselayout.service';
import { User } from 'src/app/pages/auth/interfaces/user';

describe('BaselayoutService', () => {
  let service: BaselayoutService;

  const mockUser1: User = {
    id: 1,
    name: 'John Doe',
    username: 'john_doe',
    email: 'john.doe@example.com',
    address: {
      street: '123 Elm Street',
      suite: 'Apt 4B',
      city: 'Sample City',
      zipcode: '12345',
      geo: {
        lat: '34.0522',
        lng: '-118.2437'
      }
    },
    phone: '123-456-7890',
    website: 'johndoe.com',
    company: {
      name: 'Doe Corp',
      catchPhrase: 'Innovate and Lead',
      bs: 'synergize scalable solutions'
    }
  };

  const mockUser2: User = {
    id: 2,
    name: 'Jane Smith',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    address: {
      street: '456 Maple Avenue',
      suite: 'Suite 1A',
      city: 'Another City',
      zipcode: '67890',
      geo: {
        lat: '34.0722',
        lng: '-118.2537'
      }
    },
    phone: '987-654-3210',
    website: 'janesmith.com',
    company: {
      name: 'Smith Corp',
      catchPhrase: 'Lead and Innovate',
      bs: 'optimize reliable technologies'
    }
  };

  beforeEach(() => {
    localStorage.clear(); // clear local storage before every test to ensure a fresh start
    TestBed.configureTestingModule({
      providers: [BaselayoutService]
    });
    service = TestBed.inject(BaselayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a tracked user', (done: DoneFn) => {
    service.addTrackedUser(mockUser1);
    
    service.trackedUsers$.subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].id).toEqual(mockUser1.id);
      done();
    });
  });

  it('should remove a tracked user', (done: DoneFn) => {
    service.addTrackedUser(mockUser1);
    service.addTrackedUser(mockUser2);

    service.removeTrackedUser(mockUser1);
    
    service.trackedUsers$.subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].id).toEqual(mockUser2.id);
      done();
    });
  });

  afterEach(() => {
    localStorage.clear(); // clear local storage after each test
  });
});
