import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectListComponent } from "../select-list/select-list.component";
import { componentStorage } from '../../../utils/redux/component';

@Component({
  selector: 'app-record-sorting',
  imports: [NgForOf],
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
    this.sort(this.current ? this.current[0] : this.labels[0][0])
  }
  onLabelSelected(event: any): void {
    const label = event.target.value
    this.sort(label)
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
  sort(label: string): void {
    const obj: any = this.labels.find((val) => val[0] === label)
    this.rows.sort((a: any, b: any) => {
      const A = obj[2] ? a : b
      const B = obj[2] ? b : a
      const pattern = obj[1] ? ('' + A.value).localeCompare(B.value) : A.prodSummary - B.prodSummary
      return pattern
    })
    this.current = obj
  }
}
