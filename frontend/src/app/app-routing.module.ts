import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ApplyComponent } from './apply/apply.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PostsComponent } from './posts/posts.component';
import { ViewappsComponent } from './viewapps/viewapps.component';

const routes: Routes = [
  {path: '', component: LandingComponent },
  {path: 'home', component: LandingComponent },
  {path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuardService] },
  {path: 'create-vacancy', component: AddVacancyComponent, canActivate : [AuthGuardService] },
  {path: 'vacancies/view/:id', component: ViewPostComponent},
  {path: 'posts', component: PostsComponent, canActivate : [AuthGuardService] },
  {path: 'view-apps', component: ViewappsComponent, canActivate : [AuthGuardService] },
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'apply', component: ApplyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
