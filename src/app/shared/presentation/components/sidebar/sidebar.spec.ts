import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(SidebarComponent);
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
});
