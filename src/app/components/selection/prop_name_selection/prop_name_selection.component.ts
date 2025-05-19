import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterDropBox } from '../../../../utils/types/app';
import { ImageName } from '../../../../utils/types/config';
import { NgFor, NgStyle } from '@angular/common';
import { ComponentProp, propsNamesMap } from '../../../../assets/fetch.config';
import { AppEnum } from '../../../../utils/enum/app.enum';

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
  constructor() { }

  ngOnInit(): void {
    let props: ComponentProp[] = propsNamesMap.get(this.componentType as string) ?? []
    props.unshift({
      allias: AppEnum.NONE,
      value: AppEnum.NONE
    })
    this.options = {
      currentValue: props[0].allias,
      values: props,
      open: false
    };
  }
  selectProp(value: ComponentProp): void {
    this.options.open = false
    this.options.currentValue = value.allias
    this.onChanged.emit(value.value)
  }
}
