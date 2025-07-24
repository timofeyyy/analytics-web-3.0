import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnValuesListComponent } from './column-values-list.component';

describe('ColumnValuesListComponent', () => {
  let component: ColumnValuesListComponent;
  let fixture: ComponentFixture<ColumnValuesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnValuesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnValuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
