import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isCollapsed = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
  if (window.scrollY > 10) {
    document.getElementById('navi').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
document.getElementById('brando').style.color = '#fff';
document.getElementById('log').style.color ='#fff';
    document.getElementById('navi').classList.add('navbar-dark');

  }
  if (window.scrollY < 10) {
    document.getElementById('navi').style.backgroundColor = 'transparent';
    document.getElementById('brando').style.color = 'rgb(2, 42, 153)';
    document.getElementById('navi').classList.remove('navbar-dark');
  }
  }

  logout() {


        // removing the userdata from the localstorage
        localStorage.removeItem('admin');
        this.router.navigate(['']);

        this.closeCollapse();
      }

      closeCollapse() {
        this.isCollapsed = false;
      }
}
