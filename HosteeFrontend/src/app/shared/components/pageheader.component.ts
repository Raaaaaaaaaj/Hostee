import { Component } from '@angular/core';
@Component({
  selector: 'app-page-header',
  imports: [],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-4">

      <!-- Left -->
      <div class="flex-1">
        <ng-content select="[header-left]"></ng-content>
      </div>

      <!-- Center -->
      <div class="flex items-center justify-center">
        <ng-content select="[header-center]"></ng-content>
      </div>

      <!-- Right -->
      <div class="flex items-center">
        <ng-content select="[header-right]"></ng-content>
      </div>

    </div>
  `,
  styles: ``,
})
export class PageHeader {
}
