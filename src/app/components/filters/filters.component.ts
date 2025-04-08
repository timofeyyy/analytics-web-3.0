import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PropNameSelectionComponent } from '../selection/prop-name-selection/prop-name-selection.component';
import { PropSelectionComponent } from '../selection/prop-selection/prop-selection.component';
import { Option, Test } from '../../../utils/types/app';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import manufacturerNameFilters from '../../../utils/fnc/filters/manufacturerName';
import componentKindFilters from '../../../utils/fnc/filters/componentKind';
import componentTypeFilters from '../../../utils/fnc/filters/componentType';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-filters',
  imports: [PropSelectionComponent, NgIf, NgFor],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {

  @Input()
  all!: Test[]

  props: any
  currentPropName!: string
  isSelectedComponentType!: boolean
  additional!: any[]
  componentTypeProp: any

  @Output()
  public onChange = new EventEmitter<boolean>()

  cancel(): void {
    this.onChange.emit(false)
  }
  apply(): void {
    this.onChange.emit(true)
  }

  update(options: { option: Partial<Option>, currentProp: string | undefined }): void {
    let componentProps: Map<string, { [key: string]: Option }> = this.props['ruComponentType'].componentProps

    this.currentPropName = options.currentProp as string

    let mainCategoryProp: boolean = true
    console.log(componentProps.keys())
    for (const key of componentProps.keys()) {
      for (const key_ in componentProps.get(key)) {
        if (key_ === options.option.propName) {
          mainCategoryProp = false;
          (componentProps as Map<string, any>).get(this.props['ruComponentType'].currentvalue)[key_].currentvalue = options.option.currentvalue
        }
      }

    }
    console.log(this.props, mainCategoryProp)
    if (mainCategoryProp)
      this.props[options.option.propName as string].currentvalue = options.option.currentvalue
    // console.log(this.currentPropName, options, this.props)

    let currentcomponentTypeValue: string = this.props['ruComponentType'].currentvalue

    this.componentTypeProp = componentProps.get(currentcomponentTypeValue)
    this.isSelectedComponentType = currentcomponentTypeValue !== AppEnum.ALL
    console.log(this.isSelectedComponentType, currentcomponentTypeValue)
    this.additional = []
    if (this.componentTypeProp) {
      for (const key in this.componentTypeProp) {
        this.additional.push(key)
      }
      // this.additional = Array.from((this.componentTypeProp as Map<string, Partial<Option>>).keys());
    }


    // console.log(this.componentTypePropMap)
    // console.log(this.additional);

  }

  ngOnInit(): void {
    this.isSelectedComponentType = false
    this.additional = []
    this.props = {}
    this.props['manufacturerName'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: Test[]) => manufacturerNameFilters(props, all)
    }
    this.props['ruComponentKind'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: Test[]) => componentKindFilters(props, all)
    }
    this.props['ruComponentType'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: Test[]) => componentTypeFilters(props, all),
      componentProps: (new Map())
        .set(
          ComponentTypeRuEnum.MICROCHIP,
          {
            'bitDepthValue': {
              currentvalue: AppEnum.ALL
            },
            'ruTechnologyName': {
              currentvalue: AppEnum.ALL
            }
          }
        )
        .set(
          ComponentTypeRuEnum.CAPACITOR,
          {
            'outputType': {
              currentvalue: AppEnum.ALL
            }
          }
        ),
    }
    // this.props = new Map()
    // this.props.set('manufacturerName', {
    //   currentvalue: AppEnum.ALL,
    //   sort: manufacturerNameFilters
    // }),
    // this.props.set('ruComponentType', {
    //   currentvalue: AppEnum.ALL,
    //   sort: componentKindFilters
    // })
    // this.props.set('ruComponentKind', {
    //   currentvalue: AppEnum.ALL,
    //   sort: componentTypeFilters
    // })
    // console.log(this.props)
  }
}
