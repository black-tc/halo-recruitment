import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public token: any;

  constructor(private http: HttpClient, private router: Router) {

    interval(7200000).subscribe(() => {
      if (localStorage.removeItem('admin') !== null && localStorage.getItem('admin') !== undefined) {
        localStorage.removeItem('admin');
        this.router.navigate(['/sign-in']);
      }

    });
  }

  //create a user
  registerUser(user): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };

    return this.http
      .post('http://localhost:5200/user/register', user, {
        headers: httpOptions.headers
      })
      .pipe(map(res => res));
  }

   // sign in
   login(user): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http
      .post('http://localhost:5200/user/login', user, {
        headers: httpOptions.headers
      })
      .pipe(map(res => res));
  }


  // sign out
  logout(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'token'
      })
    };
    return this.http
      .post('http://ec2-18-191-201-72.us-east-2.compute.amazonaws.com:5200/user/logout', {
        headers: httpOptions.headers
      })
      .pipe(map(res => res));
  }

  // decrypt data
  decrypt(data?) {

    if (data) {
      return this.http
        .post('http://localhost:5200/user/decrypt', data)
        .pipe(map((res: any) => res))
        .subscribe(tokenRes => {
          this.token = tokenRes.data;
        });
    } else {
      const token = JSON.parse(localStorage.getItem('admin'));
      return this.http
        .post('http://localhost:5200/user/decrypt', token.token)
        .pipe(map((res: any) => res))
        .subscribe(tokenRes => {
          this.token = tokenRes.data;
        });
    }

  }


  // get logged in user
  getLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('admin')) !== null
      && JSON.parse(localStorage.getItem('admin')) !== undefined ? true : false;
  }


  public isAdminAuthenticated(): boolean {
    const user = JSON.parse(localStorage.getItem('admin'));
    if (user) {
      return user && user.loggedIn;
    } else { return false; }
  }

  getEmail(email): any {
    const data = {
      email
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };

    return this.http
      .post('http://localhost:5200/user/Email', data, {
        headers: httpOptions.headers
      })

      .pipe(map(res => res));
  }


}

