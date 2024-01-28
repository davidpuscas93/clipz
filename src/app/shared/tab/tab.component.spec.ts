import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabComponent],
    });
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    /** Best solution */
    const element = fixture.debugElement.query(By.css('.hidden'));
    /** Solution for DOM but not other environments */
    const elementTwo = fixture.nativeElement.querySelector('.hidden');
    /** Not recommended */
    const elementThree = document.querySelector('.hidden');

    expect(element).toBeTruthy();
  });

  it('should NOT have .hidden class', () => {
    component.active = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.hidden'));

    expect(element).not.toBeTruthy();
  });
});
