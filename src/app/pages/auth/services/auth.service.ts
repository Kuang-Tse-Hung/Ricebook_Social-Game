import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getUser(){
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUsernames() {
    return this.getUser().pipe(
      map((users: User[]) => users.map(user => user.username))
    );
  }
}

