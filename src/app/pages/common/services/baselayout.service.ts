import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/pages/auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class BaselayoutService {
  isShowNav = new BehaviorSubject<boolean>(false);
  followers: User[] = []; 

  constructor() { }

  showNav(): void {
    this.isShowNav.next(true);
  }

  hideNav(): void {
    this.isShowNav.next(false);
  }
  getFollowers(): User[] {
    return this.followers;
  }
}
