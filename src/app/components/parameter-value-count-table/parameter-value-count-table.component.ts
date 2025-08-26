import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgStyle } from '@angular/common';
import gteParameterValueCountStat from '../../../utils/fnc1/other/paramter-value-count-stat.fnc';

@Component({
  selector: 'app-parameter-value-count-table',
  imports: [NgFor, NgStyle],
  templateUrl: './parameter-value-count-table.component.html',
  styleUrls: ['./parameter-value-count-table.component.css', '../styles/input.css']
})
export class ParameterValueCountTableComponent implements OnChanges {

  rows!: any[]
  @Input()
  all!: any[]
  @Input()
  parameter!: string     
  @Input()
  borderRadius: string = '.5vw'
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.rows = gteParameterValueCountStat(this.all, this.parameter) as any[]
  }
  @Output()
  public onValueChanged = new EventEmitter<string>()
  @Input()
  currentValue: string | undefined
  getValue(value: string): void {
    this.currentValue = value
    // this.currentValue = (this.currentValue == value ? undefined : value)
    this.onValueChanged.emit(value)
  }
}
