import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-viewapps',
  templateUrl: './viewapps.component.html',
  styleUrls: ['./viewapps.component.css']
})
export class ViewappsComponent implements OnInit {

  public applications = [];
  job: any;

  constructor(private main: MainService) { }

  ngOnInit(): void {

    this.getApps();
    this.job = localStorage.getItem('job_id');
  }

  getApps() {
    this.main.getApps()
      .subscribe((res: any) => {
        if (res.success) {
          res.data.forEach((post, i) => {

            let apps = {
              number: i + 1,
              firstname: post.firstname,
              lastname: post.lastname,
              phone: post.phone,
              email: post.email,
              cv: post.cv,
              comments: post.comments,
              date_applied: post.date_applied,
              _id: post._id,
              job: post.job,
            }
            this.applications.push(apps);
            // this.job_id =
            console.log(apps);
          }, err => {
           console.log(err);
          });



        }
      });
  }

}
