import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerCountTableComponent } from './manufacturer-count-table.component';

describe('ManufacturerCountTableComponent', () => {
  let component: ManufacturerCountTableComponent;
  let fixture: ComponentFixture<ManufacturerCountTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerCountTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerCountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
