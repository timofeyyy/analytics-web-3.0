import { NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-list-checkbox',
  imports: [NgFor, NgStyle],
  templateUrl: './select-list-checkbox.component.html',
  styleUrl: './select-list-checkbox.component.css'
})
export class SelectListCheckboxComponent {
  isChecked(val: string): boolean {
    for (const element of this.selected) {
      if (element == val) {
        return true
      }
    }
    return false
  }
  @Input()
  selected: (string | undefined)[] = []
  onValueSelected(event: any, val: string) {
    const checked = (event.target as any).checked
    const index = this.values.findIndex((value) => value == val)
    if (index != -1) {
      if (checked) {
        this.selected[index] = val
      }
      else {
        this.selected[index] = undefined
      }
    }

    this.onValueChanged.emit(this.selected as string[])
  }
  isSelected(index: number): boolean {
    let res = false
    for (const element of this.selected) {
      if (element == `${index}`) {
        res = true
        break;
      }
    }
    return res
  }
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if ((event.target as any).id != this.id && (event.target as any).parentElement.id != `${this.id}_inner` && (event.target as any).parentElement.parentElement.id != `${this.id}_inner`) {
      this.openList = false
    }
  }
  openList!: boolean
  @Input()
  id!: string
  @Input()
  label!: string
  @Input()
  values: string[] = []
  @Output()
  onValueChanged: EventEmitter<string[]> = new EventEmitter()
}

