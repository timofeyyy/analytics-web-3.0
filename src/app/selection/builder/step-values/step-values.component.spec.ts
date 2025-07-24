import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepValuesComponent } from './step-values.component';

describe('StepValuesComponent', () => {
  let component: StepValuesComponent;
  let fixture: ComponentFixture<StepValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
