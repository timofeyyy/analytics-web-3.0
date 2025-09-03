import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSortingComponent } from './record-sorting.component';

describe('RecordSortingComponent', () => {
  let component: RecordSortingComponent;
  let fixture: ComponentFixture<RecordSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordSortingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
