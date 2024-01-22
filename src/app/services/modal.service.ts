import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string): void {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string): void {
    this.modals = this.modals.filter((modal: IModal) => modal.id !== id);
  }

  isVisible(id: string): boolean {
    return !!this.modals.find((modal: IModal) => modal.id === id)?.visible;
  }

  toggle(id: string): void {
    const modal = this.modals.find((modal: IModal) => modal.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
