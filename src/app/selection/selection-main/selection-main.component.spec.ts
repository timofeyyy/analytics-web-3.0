import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionMainComponent } from './selection-main.component';

describe('SelectionMainComponent', () => {
  let component: SelectionMainComponent;
  let fixture: ComponentFixture<SelectionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
