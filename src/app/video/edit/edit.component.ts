import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalService } from 'src/app/services/modal.service';
import { ClipService } from 'src/app/services/clip.service';

import { IClip } from 'src/app/models/clip.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedClip: IClip | null = null;
  @Output() update = new EventEmitter();

  showAlert = false;
  alertMessage = 'Please wait...';
  alertColor = 'blue';
  inSubmission = false;

  clipId = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  ngOnInit(): void {
    this.modalService.register('edit-clip-modal');
  }

  ngOnDestroy(): void {
    this.modalService.unregister('edit-clip-modal');
  }

  ngOnChanges(): void {
    if (!this.selectedClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.selectedClip.docId as string);
    this.title.setValue(this.selectedClip.title);
  }

  async submit() {
    if (!this.selectedClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Please wait...';
    this.alertColor = 'blue';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.alertMessage = 'Error updating clip.';
      this.alertColor = 'red';
      this.inSubmission = false;
      console.error(error);
      return;
    }

    this.selectedClip.title = this.title.value;
    this.update.emit(this.selectedClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Clip updated!';
  }
}
