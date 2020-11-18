import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './landing/landing.component';
import { ApiService } from './api.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { ApplicationsComponent } from './applications/applications.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ApplyComponent } from './apply/apply.component';
import { PostsComponent } from './posts/posts.component';
import { ViewappsComponent } from './viewapps/viewapps.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent,
    AddVacancyComponent,
    ApplicationsComponent,
    NavBarComponent,
    ViewPostComponent,
    SignInComponent,
    SignUpComponent,
    ApplyComponent,
    PostsComponent,
    ViewappsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgProgressModule.forRoot(),
    NgProgressHttpClientModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
