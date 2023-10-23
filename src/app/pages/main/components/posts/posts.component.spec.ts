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
  
  
});
