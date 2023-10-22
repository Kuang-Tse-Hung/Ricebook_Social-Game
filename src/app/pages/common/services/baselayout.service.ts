import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class BaselayoutService {
  // isShowNav = new BehaviorSubject<boolean>(false);
  storedFollow = JSON.parse(localStorage.getItem('followers') ?? '');
  private trackedUsersSubject = new BehaviorSubject<User[]>(this.storedFollow);
  trackedUsers$ = this.trackedUsersSubject.asObservable();

  constructor() { }

  // showNav(): void {
  //   this.isShowNav.next(true);
  // }

  // hideNav(): void {
  //   this.isShowNav.next(false);
  // }

  addTrackedUser(user: User) {
    const currentUsers = this.trackedUsersSubject.getValue();
    const updatedUsers = [...currentUsers, user];
    this.trackedUsersSubject.next(updatedUsers);
  }

  removeTrackedUser(user: User) {
    const currentUsers = this.trackedUsersSubject.getValue();
    const updatedUsers = currentUsers.filter(u => u.id !== user.id);
    this.trackedUsersSubject.next(updatedUsers);
  }

  // getFollowers(): User[] {
  //   return this.followers;
  // }
}
