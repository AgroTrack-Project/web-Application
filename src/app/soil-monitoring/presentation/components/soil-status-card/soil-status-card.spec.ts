import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilStatusCard } from './soil-status-card';

describe('SoilStatusCard', () => {
  let component: SoilStatusCard;
  let fixture: ComponentFixture<SoilStatusCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoilStatusCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilStatusCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
