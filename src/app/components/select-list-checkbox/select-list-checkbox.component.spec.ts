import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectListCheckboxComponent } from './select-list-checkbox.component';

describe('SelectListCheckboxComponent', () => {
  let component: SelectListCheckboxComponent;
  let fixture: ComponentFixture<SelectListCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectListCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectListCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
