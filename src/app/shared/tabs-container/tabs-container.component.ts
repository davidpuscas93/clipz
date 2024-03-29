import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> =
    new QueryList();

  constructor() {}

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((tab) => (tab.active = false));
    tab.active = true;

    /** Alternative way to prevent default link behaviour. */
    return false;
  }

  generateClasses(tab: TabComponent) {
    return {
      'hover:text-indigo-400': !tab.active,
      'hover:text-white text-white bg-indigo-400': tab.active,
    };
  }
}
