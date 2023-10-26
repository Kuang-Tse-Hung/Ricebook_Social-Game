import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostsComponent } from './posts.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PostWithAuthor } from '../../interfaces/post';
import { MainService } from './../../services/main.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { BaselayoutService } from 'src/app/pages/common/services/baselayout.service';
import { of } from 'rxjs';
// I'm assuming you have BaselayoutService somewhere; import it here
// import { BaselayoutService } from 'path-to-baselayout-service';

describe('PostsComponent', () => {
    let component: PostsComponent;
    let fixture: ComponentFixture<PostsComponent>;

    let mockMainService: any;
    let mockProfileService: any;
    let mockBaselayoutService: any;  // Mock for BaselayoutService

    const mockPosts: PostWithAuthor[] = [{
        id: 1,
        title: 'Test Post',
        author: 'Test Author',
        comments: [],
        userId: 1,
        body: 'Test Body',
        date: '2023/04/29'
    },
    {
        id: 3,
        title: 'Test Post 2',
        author: 'Test Author 2',
        comments: [],
        userId: 3,
        body: 'Test Body 2',
        date: '2023/04/30'
    }
  
  ];
    const mockFollowedUsers = [{ id: 1 }, { id: 2 }];  // Define it here
    beforeEach(waitForAsync(() => {
        mockMainService = {
            getPosts: jasmine.createSpy('getPosts').and.returnValue(of(mockPosts))
        };

        mockProfileService = {
            getUser: jasmine.createSpy('getUser').and.returnValue(of({ id: 1, name: 'Test Author' }))
        };

        mockBaselayoutService = {
            trackedUsers$: of([{ id: 1 }, { id: 2 }])
        };

        TestBed.configureTestingModule({
            declarations: [PostsComponent],
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: MainService, useValue: mockMainService },
                { provide: ProfileService, useValue: mockProfileService },
                { provide: BaselayoutService, useValue: mockBaselayoutService }  // Include the mock service in providers
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PostsComponent);
        component = fixture.componentInstance;
        localStorage.setItem('loginUserId', JSON.stringify(1));
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch posts for the current logged-in user when post$ is triggered', waitForAsync(() => {
        component.post$.next([]);
        fixture.detectChanges();
        
        expect(mockMainService.getPosts).toHaveBeenCalled();
        expect(mockProfileService.getUser).toHaveBeenCalledWith('1');
        expect(component.posts).toEqual([
            {
                ...mockPosts[0],
                commentsHidden: false,
                comments: jasmine.any(Array)
            }
        ]);
    }));

    it('should add articles when adding a follower', waitForAsync(() => {
        component.post$.next([]);
        fixture.detectChanges();

        const initialPostsCount = component.posts.length;

        mockBaselayoutService.trackedUsers$ = of([...mockFollowedUsers, { id: 3}]);
        component.post$.next([]);
        fixture.detectChanges();

        const newPostsCount = component.posts.length;
        expect(newPostsCount).toBeGreaterThan(initialPostsCount);
    }));

    afterEach(() => {
        localStorage.clear();
    });
    it('should remove articles when removing a follower', waitForAsync(() => {
      component.post$.next([]);
      fixture.detectChanges();
  
      const initialPostsCount = component.posts.length;
  
      // Simulating the addition of a follower with id: 3
      mockBaselayoutService.trackedUsers$ = of([...mockFollowedUsers, { id: 3 }]);
      component.post$.next([]);
      fixture.detectChanges();
  
      // Check the posts after adding user with id: 3
      const addedPostsCount = component.posts.length;
  
      // Simulating the removal of a follower with id: 3
      mockBaselayoutService.trackedUsers$ = of(mockFollowedUsers);
      component.post$.next([]);
      fixture.detectChanges();
  
      const newPostsCount = component.posts.length;
      
      expect(addedPostsCount).toBeGreaterThan(initialPostsCount);
      expect(newPostsCount).toBeLessThan(addedPostsCount);
  }));
  
  it('should generate a date within the past year', () => {
    const generatedDate = component.generateRandomDateWithinPastYear();
    const currentDate = new Date();
    const oneYearAgo = new Date(new Date().setFullYear(currentDate.getFullYear() - 1));

    expect(new Date(generatedDate).getTime()).toBeGreaterThanOrEqual(oneYearAgo.getTime());
    expect(new Date(generatedDate).getTime()).toBeLessThanOrEqual(currentDate.getTime());
});
 

  it('should return the current date string in the format YYYY/MM/DD', () => {
    const date = new Date();
    const expectedDateString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    
    const result = component.getCurrentDateString();

    expect(result).toEqual(expectedDateString);
  });
   
   
  it('should add a new post to the posts array', () => {
    const initialPostsLength = component.posts.length;

    component.model.controls.title.setValue('Test Title');
    component.model.controls.body.setValue('Test Body');
    component.publishPost();

    const newPostsLength = component.posts.length;
    expect(newPostsLength).toBe(initialPostsLength + 1);
    expect(component.posts[0].title).toEqual('Test Title');
    expect(component.posts[0].body).toEqual('Test Body');
  });
   
   
  
  it('should call post$.next on initialization', () => {
    spyOn(component.post$, 'next');
    component.ngOnInit();
    expect(component.post$.next).toHaveBeenCalled();
});

it('should correctly sort posts by date', () => {
    const mockPosts: PostWithAuthor[] = [
        {
            userId: 1,
            id: 1,
            title: 'Post 1',
            body: 'Body of Post 1',
            date: '2023/04/29',
            author: 'Author1',
            comments: [],
            commentsHidden: false
            // add other properties as needed
        },
        {
            userId: 2,
            id: 2,
            title: 'Post 2',
            body: 'Body of Post 2',
            date: '2022/04/28',
            author: 'Author2',
            comments: [],
            commentsHidden: true
            // add other properties as needed
        },
        {
            userId: 3,
            id: 3,
            title: 'Post 3',
            body: 'Body of Post 3',
            date: '2023/04/30',
            author: 'Author3',
            comments: [],
            commentsHidden: false
            // add other properties as needed
        },
    ];

    const sortedPosts = component.sortPostsByDate(mockPosts);
    expect(sortedPosts[0].title).toEqual('Post 3');
    expect(sortedPosts[1].title).toEqual('Post 1');
    expect(sortedPosts[2].title).toEqual('Post 2');
});


});
