import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { BaselayoutService } from 'src/app/pages/common/services/baselayout.service';



@Component({
  selector: 'app-baselayout',
  templateUrl: './baselayout.component.html',
  styleUrls: ['./baselayout.component.scss']
})
export class BaselayoutComponent implements OnInit {
  loginUser = '';
  loginUserId = 0;
  userStatus = '';
  inputStatus = '';
  inputFollower = '';
  followers: User[] = [];
  LoggedOutState = false;
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private baselayoutService: BaselayoutService
  ) { }

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('loginUserName') ?? '';
    this.loginUserId = Number(localStorage.getItem('loginUserId'));

    // Load user status from local storage
    const storedStatus = localStorage.getItem('userStatus');
    if (storedStatus) {
      this.userStatus = storedStatus;
    }

    // Load followers from local storage
    const storedFollowers = localStorage.getItem('followers');
    if (storedFollowers) {
      this.followers = JSON.parse(storedFollowers);
    } else {
      // If no followers are stored, fetch the default ones from the API
      if (this.loginUserId) {
        this.authService.getUser().pipe(
          tap((data) => {
            let userId = this.loginUserId % 10;

            // Only set the userStatus from the API if it's not already set from localStorage
            if (!this.userStatus) {
              this.userStatus = data[userId - 1].company.catchPhrase;
            }

            console.log(userId - 1);
            for (let i = 0; i < 3; i++) {
              this.followers.push(data[userId]);
              userId++;
            }
            // Add the current user to the followers list in memory
            //this.baselayoutService.followers = this.followers;
            // After fetching the default followers, store them in local storage
            localStorage.setItem('followers', JSON.stringify(this.followers));
            console.log(this.followers, 'followers not stored');
            // this.baselayoutService.followers = this.followers;
          })
        ).subscribe();
      }
    }
  }

  editStatus() {
    // Store the inputStatus to localStorage before clearing it
    localStorage.setItem('userStatus', this.inputStatus);
    this.userStatus = this.inputStatus;
    this.inputStatus = '';
  }

  logout() {
    this.router.navigate(['../']);
    localStorage.removeItem('loginUserName');
    localStorage.removeItem('loginUserId');
    localStorage.removeItem('registerInfo');
    localStorage.removeItem('userStatus');  // Removing user status as well
    localStorage.removeItem('followers');   // Clearing followers from local storage on logout
    this.LoggedOutState = true;
  }

  addFollower() {
    if (this.inputFollower) {
      this.authService.getUserByName(this.inputFollower).subscribe(userToAdd => {
        if (userToAdd) {
          if (!this.followers.some(follower => follower.id === userToAdd.id)) {
            this.followers.push(userToAdd);
            this.baselayoutService.addTrackedUser(userToAdd);

          } else {
            this.notificationMessage = "User is already a follower";
          }
        } else {
          this.notificationMessage = "User not found in the API";
        }
      });
    }
  }

  unfollow(user: User) {
    const index: number = this.followers.indexOf(user);
    if (index !== -1) {
      this.followers.splice(index, 1);
    }
    this.baselayoutService.removeTrackedUser(user);
    //console.log('Followers List:', this.followers);
    // Store updated followers in local storage
    //localStorage.setItem('followers', JSON.stringify(this.followers));
  }
}
