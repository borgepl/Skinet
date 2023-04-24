import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, User } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor( private http: HttpClient, private router: Router, @Inject(DOCUMENT) private document: Document) { }

  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
        //return user;
      })
    );
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getCurrentUser() {
    return this.http.get<User>(this.baseUrl + 'account');
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address)
  }

  loadCurrentUser(token: string) {


    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.baseUrl + 'account', {headers}).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);

        }

      })
    );
  }

  loginWithGoogle(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/logingoogle', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  googlelogin() {
    return this.http.get<User>(this.baseUrl + 'account/googlelogin').pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
        //return user;
      })
    );
  }

  loginToGoogle() {
    this.document.location.href = this.baseUrl + 'account/googlelogin';
}

}
