import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-checkbox',
  imports: [NgFor],
  templateUrl: './list-checkbox.component.html',
  styleUrls: ['./list-checkbox.component.css', '../styles/select-list.css']
})
export class ListCheckboxComponent {
  @Input()
  label!: string
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
 
  openList!: boolean
  @Input()
  id!: string
  @Input()
  values: string[] = []
  @Output()
  onValueChanged: EventEmitter<string[]> = new EventEmitter()
}
