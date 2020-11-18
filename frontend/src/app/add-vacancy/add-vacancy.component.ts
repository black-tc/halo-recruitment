import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import {MainService } from '../services/main.service';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.css']
})
export class AddVacancyComponent implements OnInit {
  createForm: FormGroup;
  CurrentDate = new Date();
  submitted = false;
  message: string;

  constructor(private fb: FormBuilder, private main: MainService) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      // category: ['', [Validators.required]],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1500),
        ],
      ],
      duties: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000),
        ],
      ],
      where: ['', Validators.required],
      contact: [''],
      image: [
        '',
        [

          Validators.pattern(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
          ),
        ],
      ],
      date: ['', Validators.required],
    });

  }

  handleCancelCreate() {
    this.createForm.reset();
  }

  addVacancy() {
    this.submitted = true;
    let posted_date = new Date().toLocaleDateString('en-GB');

    const data = {
      title:  this.createForm.value.title,
    description:  this.createForm.value.description,
    date: this.createForm.value.date,
    duties: this.createForm.value.duties,
    where:  this.createForm.value.where,
    image: this.createForm.value.image ,
    contact:  this.createForm.value.contact,
    posted_date
    };

    this.main.addVacancy(data).subscribe((data: any) => {
      if(data.success) {

        this.message = 'Vacancy uploaded successfully!';
        this.createForm.reset();
        console.log(this.message);
      }
      else {
        this.message = 'Error uploading vacancy'
        console.log(this.message);
      }
    });

  }



}
