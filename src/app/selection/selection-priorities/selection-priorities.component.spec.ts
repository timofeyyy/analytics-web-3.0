import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPrioritiesComponent } from './selection-priorities.component';

describe('SelectionPrioritiesComponent', () => {
  let component: SelectionPrioritiesComponent;
  let fixture: ComponentFixture<SelectionPrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionPrioritiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
