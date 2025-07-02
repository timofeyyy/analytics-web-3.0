import { NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterDropBox } from '../../../utils/types/app';

@Component({
  selector: 'app-dropbox',
  imports: [NgStyle, NgFor],
  templateUrl: './dropbox.component.html',
  styleUrl: './dropbox.component.css'
})
export class DropboxComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.copy = this.values
  }
  @Input()
  name: string | undefined
  @Input()
  currentName: string | undefined
  @Input()
  allias: string | undefined
  @Input()
  values!: string[]
  copy!: string[]
  @Output()
  public onChanged = new EventEmitter<{ currentValue: string | void, currentName: string | undefined }>()
  @Input()
  currentValue!: string
  openClose(value: string | void): void {
    this.onChanged.emit({ currentValue: value, currentName: this.currentName === this.name ? undefined : this.name })
  }
  search(event: any): void {
    let value: string = event.target.value
    this.copy = []
    this.values.forEach((item: string) => {
      if (this.include(item, value)) {
        this.copy.push(item)
      }
    })
  }

  include(item: string, value: string): boolean {
    let searchValue: string = item
    let length: number = searchValue.length >= value.length ? value.length : searchValue.length
    let extractedPart = searchValue.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      }
    }
    return true;
  }
}
