import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PriorityField {
  label: string,
  value: number
}

@Component({
  selector: 'app-input-numeric',
  imports: [NgClass],
  templateUrl: './input-numeric.component.html',
  styleUrl: './input-numeric.component.css'
})
export class InputNumericComponent {
  @Input()
  label!: string
  @Input()
  column!: string
  @Input()
  max!: number
  @Input()
  min!: number
  @Input()
  step!: number
  @Input()
  value!: number
  @Input()
  disabled!: boolean
  @Input()
  warning!: boolean
  @Output()
  public onChanged = new EventEmitter<PriorityField>()

  increment(): void {
    if (!this.disabled) {
      console.log(this.value)
      if (this.value < this.max || this.max === undefined) {
        this.value++
      }
      this.onChanged.emit({ label: this.column, value: this.value })
    }
  }

  decrement(): void {
    if (!this.disabled) {
      if (this.value > this.min || this.min === undefined) {
        this.value--
      }
      this.onChanged.emit({ label: this.column, value: this.value })
    }
  }
}
