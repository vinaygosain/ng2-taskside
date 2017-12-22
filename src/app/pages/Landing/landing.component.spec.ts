import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';

import { LandingComponent } from './landing.component';
// import { AppBarComponent } from '../../ui';
// import { NoteContainerComponent } from '../../containers';

describe('LandingComponent',() => {

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent, AppBarComponentStub, NoteContainerComponentStub  ],

    }).compileComponents();
  });

  it("landing component instantiated", () => {
      let fixture = TestBed.createComponent(LandingComponent);
      let landingpart = fixture.componentInstance;
      expect(landingpart).toBeTruthy();
  });
});

@Component({
selector: 'ts-app-bar',
template: '<h1></h1>'
})
export class AppBarComponentStub {

}

@Component({
  selector: 'ts-note-container',
  template: '<h1></h1>'
})
export class NoteContainerComponentStub {

}
