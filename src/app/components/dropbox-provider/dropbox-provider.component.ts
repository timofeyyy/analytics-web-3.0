import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropboxComponent } from "../dropbox/dropbox.component";
import { ComponentOptions, FilterDropBox } from '../../../utils/types/app';
import { NgIf, NgStyle } from '@angular/common';
import componentTypeFilters from '../../../utils/fnc1/filters/componentType';
import { InputComponent } from "../input/input.component";
import { AppEnum } from '../../../utils/enum/app.enum';

@Component({
  selector: 'app-dropbox-provider',
  imports: [DropboxComponent, NgStyle, NgIf, InputComponent],
  templateUrl: './dropbox-provider.component.html',
  styleUrl: './dropbox-provider.component.css'
})
export class DropboxProviderComponent implements OnInit, OnChanges {
  @Input()
  propsMap!: Map<string, any>
  currentValue!: string
  input!: boolean
  @Input()
  inputValue!: string
  @Input()
  inputDisabled!: boolean
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isTableProp() && !this.isTableInput()) {
      console.log(this.propsMap.get(this.name))
      if (this.propsMap.get(this.name).sort) {
        this.values = this.propsMap.get(this.name).sort(this.propsMap, this.all)
      }
      else {
        if (!this.values.length && this.all.length) {
          this.values = componentTypeFilters(this.name, this.all)
        }
      }
      this.currentValue = this.propsMap.get(this.name).currentValue
    }
  }

  changeCurrentValueByName(name: string, value: string): never | void {
    let obj = this.propsMap.get(name)
    if (!obj) throw Error('was not found in changeCurrentValueByName(name)')
    this.propsMap.get(name).currentValue = value
  }
  @Input()
  all!: Partial<ComponentOptions>[]
  @Input()
  name!: string
  @Input()
  currentName: string | undefined
  @Input()
  alliasName!: string
  @Output()
  public onStateChanged = new EventEmitter<{ propsMap: Map<string, any>, currentName: string | undefined }>()

  openClose(obj: { currentValue: string | void, currentName: string | undefined }): void {
    if (obj.currentValue !== undefined) {
      if (this.isTableProp()) {
        this.changeCurrentValueByName(this.name, obj.currentValue)
      }
      if (this.name === 'ruComponentType') {
        this.changeCurrentValueByName('ruComponentKind', AppEnum.ALL)
        this.changeCurrentValueByName('manufacturerName', AppEnum.ALL)
      }
      if (this.name === 'manufacturerName') {
        this.changeCurrentValueByName('ruComponentKind', AppEnum.ALL)
      }
      // if (this.isCompoenntProp()) {
      //   let componentProps: Map<string, any> = propsMap.get('ruComponentType').componentProps
      //   for (const value of componentProps.values()) {
      //     if (value[`${this.name}`]) {
      //       value[`${this.name}`].currentValue = obj.currentValue
      //     }
      //   }
      // }
    }
    this.onStateChanged.emit({ propsMap: this.propsMap, currentName: obj.currentName })
  }
  err!: Error
  values: string[] = []
  ngOnInit(): void {
    if (!this.isTableProp()) {
      this.err = new Error(`${this.name} key in propsMap does not exist`);
      throw this.err
    }
    if (this.isTableProp()) {
      let isInput: boolean | undefined = this.isTableInput()
      if (isInput !== undefined) {
        this.input = isInput
      }
    }

    // console.log(this.name)
    // console.log(this.input)
  }

  isTableProp(): boolean {
    return this.propsMap.get(this.name) !== undefined
  }
  // isCompoenntProp(): boolean {
  //   let isComponentProp: boolean = false
  //   let componentProps: Map<string, any> = propsMap.get('ruComponentType').componentProps
  //   for (const value of componentProps.values()) {
  //     if (value[`${this.name}`]) {
  //       isComponentProp = true
  //     }
  //   }
  //   return isComponentProp
  // }
  // isCompoenntPropInput(): boolean | undefined {
  //   let componentProps: Map<string, any> = propsMap.get('ruComponentType').componentProps
  //   for (const value of componentProps.values()) {
  //     if (value[`${this.name}`]) {
  //       return value[`${this.name}`].input
  //     }
  //   }
  //   return undefined
  // }
  isTableInput(): boolean | undefined {
    // console.log(propsMap.get(this.name))
    if (this.propsMap.get(this.name)) {
      return this.propsMap.get(this.name).input
    }
    return undefined
  }
  // getCompoenntPropCurrentValue(): string | undefined {
  //   let res: string | undefined;
  //   let componentProps: Map<string, any> = propsMap.get('ruComponentType').componentProps
  //   for (const value of componentProps.values()) {
  //     if (value[`${this.name}`]) {
  //       res = value[`${this.name}`].currentValue
  //     }
  //   }
  //   return res
  // }
}
