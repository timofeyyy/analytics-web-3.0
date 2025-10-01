import { StickyDirection } from '@angular/cdk/table';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-window',
  imports: [],
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css', '../../components/styles/button.css']
})
export class PopupWindowComponent {
  close() {
    this.onWarningClose.emit()
  }
  @Input()
  message!: string
  @Output()
  public onWarningClose = new EventEmitter()
}
