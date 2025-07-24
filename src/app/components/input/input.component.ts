import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input()
  name!: string
  @Input()
  allias: string | undefined
  @Input()
  currentValue!: string
  @Input()
  inputDisabled!: boolean
  @Output()
  public onChanged = new EventEmitter<{ currentValue: string, currentName: string }>()
  onValueChanged(event: any): void {
    this.currentValue= event.target.value
    this.onChanged.emit({ currentValue: this.currentValue, currentName: this.name })
  }
}
