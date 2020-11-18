import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup;
  errorrr = false;
  submitted = false;
  display = 'none';
  emailmatch = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      Cell: ['', Validators.required],
      LastName: ['', Validators.required],
      company: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(8)]]
  });
  }

  get f() { return this.registerForm.controls; }


  SignUp(email, password) {
    this.submitted = true;
    if (this.registerForm.invalid) {
                return;
            }

    const user = {
      FirstName: this.registerForm.value.FirstName,
      LastName: this.registerForm.value.LastName,
      Email: this.registerForm.value.Email,
      Cell: this.registerForm.value.Cell,
      company: this.registerForm.value.company,
      Password: this.registerForm.value.Password,
            };

    this.authService.getEmail(this.registerForm.value.email).subscribe(data => {
              if (data.match && data.success) {
                      this.emailmatch = true;
                      // timout to hide the alert in the html file
                      setTimeout(() => {
                        this.emailmatch = false;
                      }, 5000);
                    } else {
                    this.authService.registerUser(user).subscribe(
                      data => {
                        if (data.success) {
                          const user = {
                            user: data.user,
                            token: data.token,
                            isLoggedin: true
                          };

                          localStorage.setItem('userdata', JSON.stringify(user));

                          // this.alertService.success('Registration successful', true);

                          this.router.navigate(['/user-dashboard']);
                        }
          });
        }
      });
    }
  }
