import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PropSelectionComponent } from '../selection/prop_selection/prop_selection.component';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import manufacturerNameFilters from '../../../utils/fnc1/filters/manufacturerName';
import componentKindFilters from '../../../utils/fnc1/filters/componentKind';
import componentTypeFilters from '../../../utils/fnc1/filters/componentType';
import { NgFor, NgIf } from '@angular/common';
import { ComponentOptions, FilterDropBox } from '../../../utils/types/app';
import { ApiService1 } from '../../../services/api.services1';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-filters',
  imports: [PropSelectionComponent, NgIf, NgFor, HttpClientModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
  providers: [ApiService1]
})
export class FiltersComponent implements OnInit {

  @Input()
  all!: ComponentOptions[]

  props: any
  currentPropName!: string
  isSelectedComponentType!: boolean
  additional!: any[]
  componentTypeProp: any
  allias: Map<string, string> = new Map<string, string>()

  constructor(
    private api: ApiService1
  ) { }

  @Output()
  public onChange = new EventEmitter<any>()

  cancel(): void {
    this.onChange.emit()
  }
  apply(): void {
    let payload: Map<string, string> = new Map();
    for (const key in this.props) {
      if (!this.props[key].componentProps) {
        payload.set(key, this.props[key].currentvalue)
      }
      else {
        let map: Map<string, string> = this.props[key].componentProps;
        payload.set(key, this.props[key].currentvalue)
        if (this.props[key].currentvalue !== AppEnum.ALL) {
          map.forEach((value, key_) => {
            if (key_ === this.props[key].currentvalue) {
              for (const key__ in value as any) {
                payload.set(key__, (value as any)[key__].currentvalue)
              }
            }
          })
        }
      }
    }
    // console.log(payload)
    this.onChange.emit(payload)
  }

  update(options: { option: Partial<FilterDropBox>, currentProp: string | undefined }): void {
    let componentProps: Map<string, { [key: string]: FilterDropBox }> = this.props['ruComponentType'].componentProps
    this.currentPropName = options.currentProp as string

    let mainCategoryProp: boolean = true
    for (const key of componentProps.keys()) {
      for (const key_ in componentProps.get(key)) {
        if (key_ === options.option.propName) {
          mainCategoryProp = false;
          (componentProps as Map<string, any>).get(this.props['ruComponentType'].currentvalue)[key_].currentvalue = options.option.currentValue
        }
      }
    }
    if (mainCategoryProp) {
      this.props[options.option.propName as string].currentvalue = options.option.currentValue
    }

    if (!options.currentProp && options.option.propName === 'ruComponentType') {
      this.props['ruComponentKind'].currentvalue = AppEnum.ALL
      this.props['manufacturerName'].currentvalue = AppEnum.ALL
    }
    if (!options.currentProp && options.option.propName === 'ruComponentKind') {
      this.props['manufacturerName'].currentvalue = AppEnum.ALL
    }

    let currentcomponentTypeValue: string = this.props['ruComponentType'].currentvalue

    this.componentTypeProp = componentProps.get(currentcomponentTypeValue)
    this.isSelectedComponentType = currentcomponentTypeValue !== AppEnum.ALL
    this.additional = []
    if (this.componentTypeProp) {
      for (const key in this.componentTypeProp) {
        this.additional.push(key)
      }
    }
  }

  ngOnInit(): void {
    this.isSelectedComponentType = false
    this.additional = []
    this.props = {}
    this.props['manufacturerName'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: ComponentOptions[]) => manufacturerNameFilters(props, all)
    }
    this.props['ruComponentKind'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: ComponentOptions[]) => componentKindFilters(props, all)
    }
    this.props['ruComponentType'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: ComponentOptions[]) => componentTypeFilters(props, all),
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
    this.api.getAlias()?.pipe().subscribe(
      (data) => {
        this.allias = new Map<string, string>(Object.entries(data))
        // console.log(this.allias)
      }
    )
  }
}
