// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject = new BehaviorSubject<any>(null);
  public user$ = this.userDataSubject.asObservable();

  constructor() { }

  setUser(userData: any) {
    console.log("in setUSer",userData);
    this.userDataSubject.next(userData);
  }

  getUser(): any {
    return this.userDataSubject.getValue();
  }

  getUserEmail(): string {
    console.log("hi");
    // Assuming that the user object has an 'email' property
    const user = this.getUser();
    console.log("in user.ts ",user.email);
    return user ? user.email : '';

  }

  clearUser() {
    this.userDataSubject.next(null);
  }
}