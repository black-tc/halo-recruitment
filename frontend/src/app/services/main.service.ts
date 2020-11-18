import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private jobs: ReplaySubject<any>;
  job_id: string;

  constructor(private http: HttpClient) {
    this.jobs = new ReplaySubject<any>();
   }

   get job() {
     return this.jobs.asObservable();

   }
   set job(fl: any) {
    this.jobs.next(fl);
  }

// method to register a new user
registerUser(user): any {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  return this.http
    .post('http://localhost:5200/users/register', user, {
      headers: httpOptions.headers
    })
    .pipe(map(res => res));
}

  addVacancy(data) {

    return this.http
      .post<any>('http://localhost:5200/vacancies/add', data)
      .pipe(map(res => res));
  }

  // get all the vacancies
  getVacancies() {
    return this.http
      .get<any>('http://localhost:5200/vacancies/get-all', {
        headers: httpOptions.headers
      })
      .pipe(retry(2), map(res => res));
  }

  createApplication(data) {

    return this.http
      .post<any>('http://localhost:5200/vacancies/create-app', data)
      .pipe(map(res => res));
  }

  // get all the vacancies
  getApps() {
    return this.http
      .get<any>('http://localhost:5200/vacancies/get-apps', {
        headers: httpOptions.headers
      })
      .pipe(retry(2), map(res => res));
  }
}


