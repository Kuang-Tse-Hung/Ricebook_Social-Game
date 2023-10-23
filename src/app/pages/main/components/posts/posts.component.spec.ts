import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostsComponent } from './posts.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PostWithAuthor } from '../../interfaces/post';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;

  // Dummy data for the tests
  const dummyPosts: PostWithAuthor[] = [{
    id: 1,
    title: 'Test Post',
    author: 'Test Author',
    comments: [],
    userId: 1, // Change '1' to 1 (number)
    body: 'Test Body',
    // add other necessary properties here
  }];
  const dummyUserId = 1; // Change '1' to 1 (number)

  beforeEach(waitForAsync(() => { // Use waitForAsync
    TestBed.configureTestingModule({
      declarations: [ PostsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;

    // Mock a logged-in user
    localStorage.setItem('loginUserId', JSON.stringify(dummyUserId));

    fixture.detectChanges();
  }));

  it('should fetch posts for the current logged-in user when post$ is triggered', waitForAsync(() => {
    component.post$.next(dummyPosts); // Simulating a trigger to fetch posts

    fixture.detectChanges();

    fixture.whenStable().then(() => { // Use fixture.whenStable()
      console.log('Expected Posts:', dummyPosts);
      console.log('Actual Posts:', component.posts);
      // Verify the behavior you expect after the post$ observable is triggered
      expect(component.posts).toEqual(dummyPosts);
    });
  }));

  afterEach(() => {
    localStorage.clear();
  });
});
