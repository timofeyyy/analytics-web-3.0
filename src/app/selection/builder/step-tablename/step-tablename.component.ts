import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppEnum } from '../../../../utils/enum/app.enum';
import { ComponentTypes, ErrorStepHandling } from '../../../../utils/types/app';
import { ApiService } from '../../../../services/api.services1';
import { HttpClientModule } from '@angular/common/http';
import { resetWarning, selectionStorage, setWarning } from '../../../../utils/redux/selection';
@Component({
  selector: 'app-step-tablename',
  imports: [NgClass, NgFor, HttpClientModule],
  providers: [ApiService],
  templateUrl: './step-tablename.component.html',
  styleUrls: ['./step-tablename.component.css', '../step-window/step-window.component.css', '../../../components/styles/categories.css',]
})

export class StepTablenameComponent implements OnInit, ErrorStepHandling {
  constructor(private api: ApiService) { }
  findError(): void {
    if (this.current) {
      selectionStorage.dispatch(resetWarning(this.index))
    }
    else {
      selectionStorage.dispatch(setWarning([this.index, "Прежде чем перейти на следующий шаг, выберите таблицу компонента"]))
    }
  }

  ngOnInit(): void {
    this.api.getComponentNames()?.subscribe(res => {
      this.componentTypes = res
    })
    this.findError()
  }

  @Input()
  index!: number
  @Output()
  public typeChanged = new EventEmitter<[string, string, any[]]>()
  current!: string
  @Input()
  storage!: Map<string, any>
  @Input()
  alias!: Map<string, any>
  @Input()
  columns: any[] = []
  @Input()
  dropBoxPropsMapConfig!: Map<string, any>
  componentTypes: ComponentTypes[] = [];

  onValueSelected(value: ComponentTypes): void {
    this.current = (this.current === value.ruComponentType ? "" : value.ruComponentType)
    this.findError()
    this.typeChanged.emit([value.ruComponentType, value.enComponentType, this.storage.get(value.enComponentType.toLocaleLowerCase())])
  }
}
