import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropboxComponent } from "../dropbox/dropbox.component";

import { NgIf, NgStyle } from '@angular/common';
import componentTypeFilters from '../../../utils/fnc1/filters/component-type';
import { InputComponent } from "../input/input.component";
import { AppEnum } from '../../../utils/enum/app.enum';
import { SelectListComponent } from "../select-list/select-list.component";

@Component({
  selector: 'app-dropbox-provider',
  imports: [NgStyle, NgIf, InputComponent, SelectListComponent],
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
  all!: any[]
  @Input()
  name!: string
  @Input()
  currentName: string | undefined
  @Input()
  aliasName!: string
  @Output()
  public onStateChanged = new EventEmitter<{ propsMap: Map<string, any>, currentName: string | undefined }>()

  openClose(obj: { currentValue: string | void, currentName: string | undefined }): void {
    if (obj.currentValue !== undefined) {
      if (this.isTableProp()) {
        this.changeCurrentValueByName(this.name, obj.currentValue)
      }
      if (this.name === 'RuComponentType') {
        this.changeCurrentValueByName('RuComponentKind', AppEnum.ALL)
        this.changeCurrentValueByName('ManufacturerName', AppEnum.ALL)
      }
      if (this.name === 'ManufacturerName') {
        this.changeCurrentValueByName('RuComponentKind', AppEnum.ALL)
      }
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
  }

  isTableProp(): boolean {
    return this.propsMap.get(this.name) !== undefined
  }

  isTableInput(): boolean | undefined {
    if (this.propsMap.get(this.name)) {
      return this.propsMap.get(this.name).input
    }
    return undefined
  }
}
