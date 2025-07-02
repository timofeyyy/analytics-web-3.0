import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { chartNamesMap } from '../../../assets/fetch.config';

@Component({
  selector: 'app-chart-types-checkboxes',
  imports: [NgFor],
  templateUrl: './chart_types_checkboxes.component.html',
  styleUrl: './chart_types_checkboxes.component.css'
})
export class ChartTypesCheckboxesComponent implements OnInit {

  @Output()
  public onChnage = new EventEmitter<string>();
  list!: any[]
  currentValue!: string
  ngOnInit(): void {
    this.list = [{
        checked: true,
        value:"donut"
      },
      {
        checked: false,
        value: "bar"
      },
      {
        checked: false,
        value: "pie"
      },
      {
        checked: false,
        value: "mixed"
      }]
      this.onSelected("bar")
  }

  onSelected(value: string): void {
    this.currentValue = value
    this.onChnage.emit(value)
  }

  getName(value: string): string | undefined {
    return chartNamesMap.get(value)
  }
}
