import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  baseUrl = '';

  constructor(
    private httpClient: HttpClient,
  ) { }

  //service for adding subscriber's email to the database
  createRecipient(email: string) {
    const body = JSON.stringify({ email: email });
    const promise = new Promise((resolve, reject) => {
      this.httpClient.post(this.baseUrl, body, { headers: this.headers }).toPromise().then(
        response => {
          console.log(response)
          resolve();
        },
        error => {
          console.log(error);
          reject(error);
        })
    });
    return promise
  }

  // this will create a post
  addPost(post): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.httpClient
      .post(
        'localhost:3000/posts/create',
        post,
        { headers: httpOptions.headers }
      )
      .pipe(map(res => res));
  }
}
