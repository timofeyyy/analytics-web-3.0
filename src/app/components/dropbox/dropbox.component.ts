import { NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterDropBox } from '../../../utils/types/app';

@Component({
  selector: 'app-dropbox',
  imports: [NgStyle, NgFor],
  templateUrl: './dropbox.component.html',
  styleUrl: './dropbox.component.css'
})
export class DropboxComponent {
  @Input()
  name: string | undefined
  @Input()
  currentName: string | undefined
  @Input()
  allias: string | undefined
  @Input()
  values!: string[]
  @Output()
  public onChanged = new EventEmitter<{ currentValue: string | void, currentName: string | undefined }>()
  @Input()
  currentValue!: string
  openClose(value: string | void): void {
    this.onChanged.emit({ currentValue: value, currentName: this.currentName === this.name ? undefined : this.name })
  }
}
