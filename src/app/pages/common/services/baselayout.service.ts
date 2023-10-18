import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaselayoutService {
  isShowNav = new BehaviorSubject<boolean>(false);

  constructor() { }

  showNav(): void {
    this.isShowNav.next(true);
  }

  hideNav(): void {
    this.isShowNav.next(false);
  }
}
