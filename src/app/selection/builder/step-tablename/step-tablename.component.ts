import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppEnum, ComponentTypeEnEnum } from '../../../../utils/enum/app.enum';
import { RuComponentTypeFormatPipe } from '../../../pipes/ruComponentTypesFormat.pipe';



@Component({
  selector: 'app-step-tablename',
  imports: [NgClass, RuComponentTypeFormatPipe, NgFor],
  templateUrl: './step-tablename.component.html',
  styleUrls: ['./step-tablename.component.css', '../step-window/step-window.component.css']
})

export class StepTablenameComponent {

  @Input()
  index!: number
  @Input()
  enComponentTypes!: ComponentTypeEnEnum[];
  @Output()
  public typeChanged = new EventEmitter<string>()
  @Output()
  public sourceChanged = new EventEmitter<[string, any[]]>()
  current!: string
  @Input()
  storage!: Map<string, any>

  onTypeSelected(event: any): void {
    this.typeChanged.emit(event.target.innerText)
  }
  changeState(enComponentType: string): void {
    this.current = (this.current === enComponentType ? "" : enComponentType)
    this.sourceChanged.emit([enComponentType, this.storage.get(enComponentType)])
  }
}
