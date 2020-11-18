import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  fl: any;
  error: Boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private main: MainService) { }

  ngOnInit(): void {

    this.activatedRoute.pathFromRoot[1].url.subscribe((segments: UrlSegment[]) => {
      // Getting the last segment of URL path
      const id = segments.pop().path;

      this.main.job.subscribe((post: any[]) => {
        console.log('here')
        this.fl = post.find(s => s.id == id);

        if (!this.fl) {
          this.error = true;

        }
      })
    });
  }

}
