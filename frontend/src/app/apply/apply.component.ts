import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { UploadCountService } from '../services/upload-count.service';


@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {
  createForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  showSnackbar:Boolean = false;
  message:String;
  localStorage: UploadCountService;
  error:Boolean = false;
  btnWait: Boolean = false;
  maxUpload: Boolean = false;
  missingDoc: Boolean = true;
  wrongType: Boolean = false;
  sizeLimit: Boolean = false;
  otherErr: Boolean = false;
  doc: any;
  application: any;
  fileMessage: string = "No document uploaded";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private main: MainService) {
      this.localStorage = new UploadCountService();
    }

    get f() { return this.createForm.controls}


  ngOnInit(): void {

    this.application = localStorage.getItem('post_id');

    this.createForm = this.formBuilder.group({
      firstname: ['',  Validators.compose([
        Validators.required
      ])],
      lastname: ['',  Validators.compose([
        Validators.required])],
      phone: ['',
        Validators.required],
      cv: [''],
      email: ['',  Validators.compose([
        Validators.required ])],
      comments: ['',  Validators.compose([
        Validators.required ])]
    });

  }

    // Handle selected image
    selectDoc(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.doc = file;
        this.fileMessage = file.name;
        this.missingDoc = false;
        this.sizeLimit = false;
        this.wrongType = false;
      }
    }

  onSubmit() {
    this.submitted = true;
    let date_applied = new Date().toLocaleDateString('en-GB');
    let job = this.application;

    if (this.createForm.invalid) {

      return;
    }
    if (!this.validateUploadCount()){
      this.maxUpload = true;
      return;
    }
    this.loading = true;
    const data = {

      firstname: this.createForm.value.firstname,
      lastname: this.createForm.value.lastname,
      phone: this.createForm.value.phone,
      email: this.createForm.value.email,
      cv: this.createForm.value.cv,
      comments: this.createForm.value.comments,
      date_applied,
      job
    }

    this.main.createApplication(data).subscribe((data: any) => {

      if(data.success) {

        this.onSuccess(data);
        this.createForm.reset();

        this.onComplete();
      }

      else (err => {
        this.onError(err);

      })

      localStorage.removeItem('post_id');
  });
  }

  // Prevent too many uploads from single user
  validateUploadCount(){
    const max = 5;
    let uploads:[] = this.localStorage.getUploaded();

    if (!uploads) return true;

    if (uploads.length >= max) return false;
    else return true;
  }

  // Successful application upload
  onSuccess(data) {
    this.submitted = false;
    this.createForm.reset();
    this.message = 'Your application was successfully created!';
    this.showSnackbar = true;
    this.error = false;
    this.localStorage.setUploaded(data['id']);
  }

  // Error on profile upload
  onError(err) {
    this.message = 'Oops! Unable to process your application, please try again later';
    this.showSnackbar = true;
    this.error = true;
    // this.handleError(err);
    this.btnWait = true;
  }

  onComplete() {
    this.loading = false;

    setTimeout(() => {
      this.showSnackbar = false;
      this.btnWait = false;
      if (!this.error) {
        this.router.navigate(['']);
      }
    }, (this.error) ? 3000 : 2000);

}
}
