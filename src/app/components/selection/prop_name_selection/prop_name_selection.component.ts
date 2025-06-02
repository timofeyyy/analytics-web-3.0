import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class PropNameSelectionComponent implements OnChanges {

  @Input()
  componentType!: string | null
  options!: Partial<FilterDropBox>
  @Input()
  currentProp!: string | null
  @Output()
  public onChanged = new EventEmitter<string>()
  constructor() { }
 
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.componentType)
    let props: ComponentProp[] = propsNamesMap.get(this.componentType as string) ?? []
    props.unshift({
      allias: AppEnum.NONE,
      value: AppEnum.NONE
    })
    this.options = {
      currentValue: props[0].allias,
      values: props,
      open: this.currentProp === "props"
    };
  }

  selectProp(value: ComponentProp): void {
    this.options.open = false
    this.options.currentValue = value.allias
    this.onChanged.emit(value.value)
  }
}
