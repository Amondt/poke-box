import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberComparisonComponent } from './number-comparison.component';

describe('NumberComparisonComponent', () => {
  let component: NumberComparisonComponent;
  let fixture: ComponentFixture<NumberComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
