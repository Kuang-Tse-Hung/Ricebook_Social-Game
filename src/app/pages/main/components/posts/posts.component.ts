import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { ReplaySubject, forkJoin, map, switchMap, tap } from 'rxjs';
import { PostForm, PostWithAuthor } from '../../interfaces/post';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaselayoutService } from 'src/app/pages/common/services/baselayout.service';
import { User } from 'src/app/pages/auth/interfaces/user';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  followers: User[] = [];
  currentUserId: number | null = null;
  
  post$ = new ReplaySubject<PostWithAuthor[]>()
  postRef2 = this.post$.pipe(
    switchMap(() => this.baselayoutService.trackedUsers$),
    map((data) => data.map((x) => x.id)),
    switchMap((followerIds) => (
      this.mainService.getPosts().pipe(
        map(posts => {
          let loginUserId = localStorage.getItem('loginUserId');
          followerIds.push(Number(loginUserId));
          const filteredPosts = posts.filter(post => followerIds.includes(post.userId));
          console.log(filteredPosts);
          return filteredPosts;
        })
      )
    )),
    switchMap((data) => {
      const distinctUserIds = [...new Set(data.map(post => post.userId.toString()))];
      const userObservables = distinctUserIds.map(userId =>
        this.profileService.getUser(userId)
      );
      return forkJoin(userObservables).pipe(
        map(users => data.map(post => {
          const user = users.find(u => u.id === post.userId);
          return { ...post, author: user ? user.name : 'Unknown' };
        }))
      );
    }),
    map((data) => data.map(post => ({
      ...post,
      commentsHidden: false,
      comments: [
        {
          author: 'John Doe',
          text: 'Great post!',
          date: '2023/10/01'
        },
        {
          author: 'Jane Smith',
          text: 'I totally agree!',
          date: '2023/10/02'
        },
        {
          author: 'Commenter 3',
          text: 'WTF brooooo',
          date: '2023/10/10'
        },
        {
          author: 'Commenter 4',
          text: 'Miss u so much bae',
          date: '2023/10/05'
        }
      ]
    }))),
    tap((data) => {
      data.forEach(post => {
        if (!post.date) {
          post.date = this.generateRandomDateWithinPastYear();
        }
      });
      data.sort((a, b) => {
        const dateA = new Date(a.date || '1900/01/01');
        const dateB = new Date(b.date || '1900/01/01');
        return dateB.getTime() - dateA.getTime();
      });
    }),
    tap((x) => this.posts = x),
    tap((x) => this.originalPosts = x)
  ).subscribe();
  generateRandomDateWithinPastYear(): string {
    const currentDate = new Date();
    const start = new Date(new Date(currentDate).setFullYear(currentDate.getFullYear() - 1));
    const end = currentDate;
  
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return `${randomDate.getFullYear()}/${String(randomDate.getMonth() + 1).padStart(2, '0')}/${String(randomDate.getDate()).padStart(2, '0')}`;
  }
  
  // postRef = this.post$.pipe(
  //   switchMap(() => this.mainService.getPosts()),
  //   switchMap((data) => {
  //     const distinctUserIds = [...new Set(data.map(post => post.userId.toString()))];
  //     const userObservables = distinctUserIds.map(userId =>
  //       this.profileService.getUser(userId)
  //     );
  //     return forkJoin(userObservables).pipe(
  //       map(users => data.map(post => {
  //         const user = users.find(u => u.id === post.userId);
  //         return { ...post, author: user ? user.name : 'Unknown' };
  //       }))
  //     );
  //   }),
  //   tap(data => {
  //     // Get the user IDs of followers from local storage
  //     const storedFollowers = localStorage.getItem('followers');
  //     if (storedFollowers) {
  //       const followers = JSON.parse(storedFollowers);
  //       const followerUserIds = followers.map((follower: User) => follower.id);
  //       // Filter posts to show only those from followers in local storage
  //       this.posts = data
  //         .filter(post => followerUserIds.includes(post.userId))
  //         .map(post => ({
  //           ...post,
  //           commentsHidden: false,
  //           comments: [
  //             {
  //               author: 'John Doe',
  //               text: 'Great post!',
  //               date: '2023/10/01'
  //             },
  //             {
  //               author: 'Jane Smith',
  //               text: 'I totally agree!',
  //               date: '2023/10/02'
  //             },
  //             {
  //               author: 'Commenter 3',
  //               text: 'WTF brooooo',
  //               date: '2023/10/10'
  //             },
  //             {
  //               author: 'Commenter 4',
  //               text: 'Miss u so much bae',
  //               date: '2023/10/05'
  //             }
  //           ]
  //         }));

  //       this.originalPosts = [...this.posts];
  //     } else {
  //       // Handle the case where there are no followers in local storage
  //       // You may want to display a message or handle it differently
  //       console.log('No followers in local storage.');
  //       this.posts = [];
  //       this.originalPosts = [];
  //     }
  //   }),
  //   shareReplay()
  // ).subscribe();


  originalPosts: PostWithAuthor[] = [];
  posts: PostWithAuthor[] = [];

  model = new FormGroup<PostForm>({
    userId: new FormControl(0),
    id: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  })

  selectedFile: any = null;
  searchText = '';

  constructor(
    private mainService: MainService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private baselayoutService: BaselayoutService
  ) { }
  sortPostsByDate(posts: PostWithAuthor[]): PostWithAuthor[] {
    return posts.sort((a, b) => {
        const dateA = new Date(a.date || '1900/01/01');
        const dateB = new Date(b.date || '1900/01/01');
        return dateB.getTime() - dateA.getTime();
    });
  } 
  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUserId = JSON.parse(currentUser).id;
    }
    const registerInfo = localStorage.getItem('registerInfo');
    if (registerInfo) {
      return;
    }

    this.post$.next([]);
    // this.route.queryParams.pipe(
    //   tap(params => {
    //     const isRegister = params['register'];
    //     if (isRegister !== 'true') {
    //       this.post$.next([]);
    //     }
    //   })
    // ).subscribe();
    
  }
  getCurrentDateString(): string {
    const date = new Date();
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  }
  publishPost() {
    const postItem = {
      userId: 0,
      author: localStorage.getItem('loginUserName') ?? '',
      id: 0,
      title: this.model.controls.title.value!.trim() ?? '',
      body: this.model.controls.body.value!.trim() ?? '',
      isNew: true,
      date: this.getCurrentDateString(),
      image: this.selectedFile ? this.selectedFile.name : null,
      commentsHidden: false,
      comments: [
        {
          author: 'Commenter 1',
          text: 'Nice new post!',
          date: '2023/10/03'
        },
        {
          author: 'Commenter 2',
          text: 'I like it!',
          date: '2023/10/04'
        },
        {
          author: 'Commenter 3',
          text: 'WTF brooooo',
          date: '2023/10/10'
        },
        {
          author: 'Commenter 4',
          text: 'Miss u so much bae',
          date: '2023/10/05'
        }
      ]
    };
    if (this.selectedFile) {
      postItem.image = this.selectedFile.name;
    }
    this.model.controls.title.setValue('');
    this.model.controls.body.setValue('');
    this.posts.unshift(postItem);
  }


  cancel() {
    this.model.controls.title.setValue('');
    this.model.controls.body.setValue('');
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;

  }

  clearSearch() {
    this.posts = [...this.originalPosts];
    this.searchText = '';
  }

  inputSearch() {
    if (!this.searchText) {
      this.posts = [...this.originalPosts];
      return;
    }

    let resArr: PostWithAuthor[] = [];
    this.originalPosts.forEach(item => {
      if (item.body.includes(this.searchText) || item.author.includes(this.searchText)) {
        resArr.push(item);
      }
    });

    this.posts = resArr;
  }
  toggleComments(post: PostWithAuthor) {
    post.commentsHidden = !post.commentsHidden;  // toggles the state
  }

}
