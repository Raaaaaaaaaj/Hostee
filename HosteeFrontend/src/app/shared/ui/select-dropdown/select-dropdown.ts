import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-dropdown',
  imports: [FormsModule, SelectModule],
  template: `
    <div class="flex justify-center">
      <p-select
        [options]="items()"
        [(ngModel)]="value"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [placeholder]="placeholder()"
        [filter]="filter()"
        [filterBy]="filterBy()"
        [showClear]="showClear()"
        [disabled]="disabled()"
        [loading]="loading()"
        [editable]="editable()"
        [required]="required()"
        [invalid]="invalid()"
        [class]="customClass()"
      >
        <!-- Selected Item -->
        <ng-template #selectedItem let-selected>
          @if (selected) {
            {{ selected[optionLabel()] }}
          }
        </ng-template>

        <!-- Dropdown Item -->

        <ng-template let-item #item>
          {{ item[optionLabel()] }}
        </ng-template>
      </p-select>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdown {
  // Data
  items = input<any[]>([]);
  // Selected Value
  value = model<any>();
  // Config
  optionLabel = input('name');
  optionValue = input<'string' | undefined>(undefined);

  placeholder = input('');

  filter = input(true);
  filterBy = input('name');

  showClear = input(true);

  disabled = input(false);

  loading = input(false);

  editable = input(false);

  required = input(false);

  invalid = input(false);

  customClass = input(
    '!bg-slate-50 !text-white !rounded-2xl !text-xs !font-semibold !transition-all !flex !items-center !gap-1',
  );
}
