import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-list',
  imports: [NgFor, NgStyle],
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.css', '../styles/input.css']
})
export class SelectListComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.values = this.values.filter(val => val != undefined)
  }
  onValueSelected($event: any) {
    this.onValueChanged.emit($event.target.value)
  }
  @Input()
  values: string[] = []
  @Input()
  currentIndex: number = 0
  @Input()
  currentValue!: string
  @Output()
  onValueChanged: EventEmitter<string> = new EventEmitter()
  openList!: boolean
  @Input()
  fitstSelectedValue!: boolean

}
