import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTablenameComponent } from './step-tablename.component';

describe('StepTablenameComponent', () => {
  let component: StepTablenameComponent;
  let fixture: ComponentFixture<StepTablenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTablenameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepTablenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
