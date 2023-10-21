import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject, filter, forkJoin, map, scan, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { Post, PostForm, PostWithAuthor } from '../../interfaces/post';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginForm } from 'src/app/pages/auth/interfaces/form';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  post$ = new ReplaySubject<PostWithAuthor[]>()
  postRef = this.post$.pipe(
    switchMap(() => this.mainService.getPosts()),
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
    tap(data => {
      this.posts = [...data];
      this.originalPosts = [...data];
    }),
    shareReplay()
  ).subscribe();

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
    private router: Router
  ) { }

  ngOnInit(): void {
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

  publishPost() {
    const postItem = {
      userId: 0,
      author: localStorage.getItem('loginUserName') ?? '',
      id: 0,
      title: this.model.controls.title.value!.trim() ?? '',
      body: this.model.controls.body.value!.trim() ?? '',
      isNew: true,
      image: this.selectedFile ? this.selectedFile.name : null
    };
    if (this.selectedFile) {
      postItem.image = this.selectedFile.name; // set the image property only if there's a selected file
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
}
