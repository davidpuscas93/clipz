import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

import { IClip } from '../models/clip.model';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: Player;
  clip?: IClip;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.player = videojs(this.target?.nativeElement);

    this.activatedRoute.data.subscribe((data) => {
      this.clip = data.clip as IClip;

      this.player?.src({
        src: this.clip?.url,
        type: 'video/mp4',
      });
    });
  }
}
