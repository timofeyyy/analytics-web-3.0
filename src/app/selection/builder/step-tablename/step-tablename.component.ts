import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppEnum } from '../../../../utils/enum/app.enum';
import { RuComponentTypeFormatPipe } from '../../../pipes/ruComponentTypesFormat.pipe';
import { ComponentTypes } from '../../../../utils/types/app';
import { ApiService1 } from '../../../../services/api.services1';
import { HttpClientModule } from '@angular/common/http';
import { componentStorage, setComponentTypeAllias } from '../../../../utils/redux/storage';



@Component({
  selector: 'app-step-tablename',
  imports: [NgClass, NgFor, HttpClientModule],
  providers: [ApiService1],
  templateUrl: './step-tablename.component.html',
  styleUrls: ['./step-tablename.component.css', '../step-window/step-window.component.css']
})

export class StepTablenameComponent implements OnInit {
  constructor(private api: ApiService1) { }

  ngOnInit(): void {
    this.api.getComponentNames()?.subscribe(res => {
      componentStorage.dispatch(setComponentTypeAllias(res))
      this.componentTypes = res
    })
  }

  @Input()
  index!: number
  @Output()
  public typeChanged = new EventEmitter<string>()
  @Output()
  public sourceChanged = new EventEmitter<[string, any[]]>()
  @Output()
  public valueChanged = new EventEmitter<ComponentTypes>()
  current!: string
  @Input()
  storage!: Map<string, any>
  componentTypes: ComponentTypes[] = [];

  onValueSelected(value: ComponentTypes): void {
    this.typeChanged.emit(value.ruComponentType)
    this.current = (this.current === value.ruComponentType ? "" : value.ruComponentType)
    this.sourceChanged.emit([value.enComponentType, this.storage.get(value.enComponentType.toLocaleLowerCase())])
  }

  // onTypeSelected(event: any): void {
  //   this.typeChanged.emit(event.target.innerText)
  // }
  // changeState(enComponentType: string): void {
  //   this.current = (this.current === enComponentType ? "" : enComponentType)
  //   this.sourceChanged.emit([enComponentType, this.storage.get(enComponentType)])
  // }

}
