import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilRecordSummary } from './soil-record-summary';

describe('SoilRecordSummary', () => {
  let component: SoilRecordSummary;
  let fixture: ComponentFixture<SoilRecordSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoilRecordSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilRecordSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
