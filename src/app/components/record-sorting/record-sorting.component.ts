import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-record-sorting',
  imports: [NgClass, NgStyle, NgForOf],
  templateUrl: './record-sorting.component.html',
  styleUrl: './record-sorting.component.css'
})
export class RecordSortingComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.labels) {
      this.labels = [
        [this.valueName + ' (возвр)', true, true],
        [this.valueName + ' (убыв)', true, false],
        [this.countName + ' (возвр)', false, true],
        [this.countName + ' (убыв)', false, false],
      ]
    }
    this.onLabelSelcted(this.current ?? this.labels[0])
  }


  isOpen!: boolean
  @Input()
  valueName: string = 'Значение'
  @Input()
  countName: string = 'Количество'
  labels!: [string, boolean, boolean][]
  @Input()
  rows: { value: string, prodSummary: number }[] = []
  current!: [string, boolean, boolean]
  onLabelSelcted(label: [string, boolean, boolean]): void {
    this.rows.sort((a: any, b: any) => {
      const A = label[2] ? a : b
      const B = label[2] ? b : a
      const pattern = label[1] ? ('' + A.value).localeCompare(B.value) : A.prodSummary - B.prodSummary
      return pattern
    })
    this.current = label
  }
}
