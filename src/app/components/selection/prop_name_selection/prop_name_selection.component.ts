import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterDropBox } from '../../../../utils/types/app';
import { ImageName } from '../../../../utils/types/config';
import { ApiService } from '../../../../services/api.services';
import { NgFor, NgStyle } from '@angular/common';
import { propsNamesMap } from '../../../../assets/fetch.config';

@Component({
  selector: 'app-prop-name-selection',
  imports: [NgStyle, NgFor],
  templateUrl: './prop_name_selection.component.html',
  styleUrls: ['./prop_name_selection.component.css', '../selection.css'],

})
export class PropNameSelectionComponent implements OnInit {
  
  @Input()
  componentType!: string | null
  options!: Partial<FilterDropBox>
  @Output()
  public onChanged = new EventEmitter<string>()
  constructor() {}

  ngOnInit(): void {
    let props = propsNamesMap.get(this.componentType??"")??[]
    this.options = {
      currentValue: props.length ? "битность" : "-",
      values: props??[],
      open: false
    };
  }
  selectProp(value: string): void {
    this.onChanged.emit(value)
  }
}
