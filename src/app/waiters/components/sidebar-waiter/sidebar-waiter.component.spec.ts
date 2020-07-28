import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarWaiterComponent } from './sidebar-waiter.component';

describe('SidebarWaiterComponent', () => {
  let component: SidebarWaiterComponent;
  let fixture: ComponentFixture<SidebarWaiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarWaiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
