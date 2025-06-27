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
  @Output()
  public onChanged = new EventEmitter<{ currentValue: string, currentName: string }>()
  onValueChanged(event: any): void {
    let value: string = event.target.value
    console.log(value)
    this.onChanged.emit({ currentValue: value, currentName: this.name })
  }
}
