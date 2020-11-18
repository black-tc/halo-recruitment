import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';

// declare var particlesJS: any;


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  newsletterForm: FormGroup;
  submitted: boolean;
  errorMsg = '';
  public posts = [];
  public job_id: any;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    private main: MainService,
    private router: Router,
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f() { return this.newsletterForm.controls; }

  registerData() {
    this.submitted = true;
    if (this.newsletterForm.invalid) {
      return (this.newsletterForm.reset());
    }
    var formData = new FormData();
    formData.append("email", this.newsletterForm.get('email').value);

    this.apiService.createRecipient(this.newsletterForm.get('email').value)
      .then(
        response => {
          Swal.fire({
            title: "Good job!",
            text: "You email was posted! Check your inbox.",
            icon: "success",
          });
          console.log(response)
        }
      ).catch(
        error => {
          Swal.fire({
            title: "Hold on!",
            text: "That email was already registered. Try another email. :) ",
            icon: "warning",
          });
          console.log(error)
        }
      )
    this.newsletterForm.reset();


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
            console.log(vacancies);
          }, err => {
           console.log(err);
          });

        }
      });
  }

  apply(id) {
    localStorage.setItem("post_id", id);
    this.router.navigate(["/apply"]);
  }
  getJob(post) {
    if (!post) return;

    this.job_id = post.id;
    this.router.navigate([`/vacancies/view/${post._id}`]);
  }

  ngOnInit() {

    this.getVacancies();
  }


}
