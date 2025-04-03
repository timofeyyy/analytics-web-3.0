import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Output()
  public onChange = new EventEmitter<boolean>()

  cancel() : void {
    this.onChange.emit(false)
  }

  apply() : void {
    this.onChange.emit(true)
  }

}
