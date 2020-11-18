import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errMessage;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
  }

    if (this.loginForm.valid) {

        const user = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }

        this.authService.login(user)
      .subscribe((data: any) => {
        console.log(data);
        if (data.success) {

          const loggedIn = {
            token: data.data,
            loggedIn: true
          };

          localStorage.setItem('admin', JSON.stringify(loggedIn));

          setTimeout(() => {
            this.router.navigate(['/dashboard'])
              .then(() => {

                this.submitted = false;
              })
              .catch(e => console.log(e));
          }, 1200);

        }
      })
  }

  }
}
