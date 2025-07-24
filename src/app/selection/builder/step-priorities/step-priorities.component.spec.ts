import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPrioritiesComponent } from './step-priorities.component';

describe('StepPrioritiesComponent', () => {
  let component: StepPrioritiesComponent;
  let fixture: ComponentFixture<StepPrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPrioritiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
