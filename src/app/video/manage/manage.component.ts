import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

import { IClip } from 'src/app/models/clip.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  selectedClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort($event: Event) {
    const { value } = $event.target as HTMLSelectElement;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sort: value },
    });
  }

  openEditModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.selectedClip = clip;
    this.modalService.toggle('edit-clip-modal');
  }

  update($event: IClip) {
    this.clips.forEach((clip, index) => {
      if (clip.docId === $event.docId) {
        this.clips[index] = $event;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.clipService.deleteClip(clip);

    this.clips = this.clips.filter((element) => element.docId !== clip.docId);
  }

  async copyLink($event: MouseEvent, clipDocId: string | undefined) {
    $event.preventDefault();

    if (!clipDocId) {
      return;
    }

    const url = `${location.origin}/clip/${clipDocId}`;

    await navigator.clipboard.writeText(url);

    alert('Link copied to clipboard!');
  }
}
