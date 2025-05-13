import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ComponentOptions, FilterDropBox } from '../../../../utils/types/app';
import { ImageName } from '../../../../utils/types/config';
import { ApiService } from '../../../../services/api.services';
import { NgFor, NgStyle } from '@angular/common';
import { AppEnum } from '../../../../utils/enum/app.enum';

@Component({
  selector: 'app-prop-selection',
  imports: [NgStyle, NgFor],
  templateUrl: './prop_selection.component.html',
  styleUrls: ['./prop_selection.component.css', '../selection.css'],

})
export class PropSelectionComponent implements OnChanges {
  @Input()
  options!: Partial<FilterDropBox>

  @Input()
  all!: ComponentOptions[]

  @Input()
  props!: any

  
  @Input()
  currentValue!: string

  @Input()
  currentProp!: string

  @Input()
  currentPropName!: string

  @Output()
  public onChanged = new EventEmitter<{ option: Partial<FilterDropBox>, currentProp: string | undefined }>()

  valuesCopy!: string[]

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
      let prop = this.props[this.options.propName as string]
      this.options.currentValue = prop?.currentvalue
      this.options.currentValue = prop?.currentvalue
      this.options.values = [AppEnum.ALL]
      if (this.options.open) {
        if ((prop as FilterDropBox).sort) {
          this.options.values = (prop as FilterDropBox).sort(this.props, this.all)
        } 
        else {
          this.all.forEach((item: ComponentOptions) => {
            let value: string = (item.component as any)[this.options.propName as string]
            === null || (item.component as any)[this.options.propName as string] === '' ? "null" : (item.component as any)[this.options.propName as string]
            let index = (this.options.values as string[])?.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
              this.options.values?.push(value)
          })
        }
        this.valuesCopy = Array.from(this.options.values as [])
      }
  }

  openClose(value: string | void): void {

    let currentProp = this.options.propName
    if (value) {
      this.options.currentValue = value
    }

    if (this.options.open) {
      currentProp = undefined
    }
    // console.log({ option: this.options, currentProp: currentProp })
    this.onChanged.emit({ option: this.options, currentProp: currentProp })
  }


  search(event: any): void {
    let value: string = event.target.value
    this.valuesCopy = [];
    (this.options.values as string[])?.forEach((item: string) => {
      if (this.include(item, value)) {
        this.valuesCopy.push(item)
      }
    })
  }

  include(item: string, value: string): boolean {
    let length: number = item.length >= value.length ? value.length : item.length
    let extractedPart = item.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      }
    }
    return true;
  }
}
