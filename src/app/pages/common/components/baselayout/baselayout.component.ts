import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { BaselayoutService } from '../../services/baselayout.service';
import { map, tap } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Component({
  selector: 'app-baselayout',
  templateUrl: './baselayout.component.html',
  styleUrls: ['./baselayout.component.scss']
})
export class BaselayoutComponent implements OnInit {
  // showSideBar$ = this.baselayoutService.isShowNav;
  loginUser = '';
  loginUserId = 0;
  userStatus = '';
  inputStatus = '';
  inputFollower = '';
  followers:User[] = [];
  LoggedOutState = false;
  constructor(
    // public baselayoutService: BaselayoutService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('loginUserName') ?? '';
    this.loginUserId = Number(localStorage.getItem('loginUserId'))
    if(this.loginUserId){
      this.authService.getUser().pipe(
        tap((data) => {
          let userId = this.loginUserId % 10;
          this.userStatus = data[userId - 1 ].company.catchPhrase;
          for(let i = 0; i < 3; i++){
            this.followers.push(data[userId])
            userId++;
          }
        })).subscribe()
    }
  }

  logout() {
    this.router.navigate(['../']);
    localStorage.removeItem('loginUserName');
    localStorage.removeItem('loginUserId');
    localStorage.removeItem('registerInfo');
    this.LoggedOutState = true;
  }

  editStatus() {
    this.userStatus = this.inputStatus;
    this.inputStatus = '';
  }

  addFollower(){
    let newFollower:User = {
      id: 0,
      name: '',
      username: this.inputFollower,
      email: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: ''
        }
      },
      phone: '',
      website: '',
      company: {
        name: '',
        catchPhrase: 'new follower',
        bs: ''
      }
    }
    this.followers.push(newFollower);
  }

  unfollow(user:User){
    const index: number = this.followers.indexOf(user);
    if (index !== -1) {
        this.followers.splice(index, 1);
    }
  }

}
