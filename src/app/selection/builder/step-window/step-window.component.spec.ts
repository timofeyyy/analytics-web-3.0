import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepWindowComponent } from './step-window.component';

describe('StepWindowComponent', () => {
  let component: StepWindowComponent;
  let fixture: ComponentFixture<StepWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
