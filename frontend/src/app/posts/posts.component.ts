import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  public posts = [];
  constructor(private main: MainService, private router: Router) { }

  ngOnInit(): void {

    this.getVacancies();
  }

  getVacancies() {
    this.main.getVacancies()
      .subscribe((res: any) => {
        if (res.success) {
          res.data.forEach((post, i) => {

            let vacancies = {
              number: i + 1,
              title: post.title,
              description: post.description,
              date: post.date,
              duties: post.duties,
              where: post.where,
              contact: post.contact,
              posted_date: post.posted_date,
              _id: post._id,
              image: `${post.image}`,
            }
            this.posts.push(vacancies);
            // this.job_id =
            // console.log(vacancies);
          }, err => {
           console.log(err);
          });



        }
      });
  }

  view(id) {
    localStorage.setItem("job_id", id);
    this.router.navigate(["/view-apps"]);
  }

}
