import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterSortingComponent } from './parameter-sorting.component';

describe('ParameterSortingComponent', () => {
  let component: ParameterSortingComponent;
  let fixture: ComponentFixture<ParameterSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterSortingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
