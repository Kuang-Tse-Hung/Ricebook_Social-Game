import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MainService } from './main.service';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/post';

describe('MainService', () => {
  let service: MainService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve posts', () => {
    const mockPosts: Post[] = [
      {
        userId: 1,
        id: 101,
        title: 'Test Post 1',
        body: 'This is a test post 1.',
        date: '2023-10-25'
      },
      {
        userId: 2,
        id: 102,
        title: 'Test Post 2',
        body: 'This is a test post 2.',
        date: '2023-10-26'
      }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
