import { Component, output, input } from '@angular/core';
import { PageHeaderSearchInput } from './pageheadersearchinput.component';
import { PageHeaderViewSwitcher } from './pageheaderviewswitcher.component';
import { ViewMode } from './pageheaderviewswitcher.component';
@Component({
  selector: 'app-page-header',
  imports: [PageHeaderSearchInput, PageHeaderViewSwitcher],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <app-page-header-search-input></app-page-header-search-input>
      <app-page-header-view-switcher
        [viewMode]="viewMode()"
        (viewModeChange)="viewModeChange.emit($event)"
      >
      </app-page-header-view-switcher>
    </div>
  `,
  styles: ``,
})
export class PageHeader {
  viewMode = input.required<ViewMode>()
  viewModeChange = output<ViewMode>()
}
