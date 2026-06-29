import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-action-button',
  imports: [CommonModule, ButtonModule],
  template: `
    <button
      pButton
      [class]="customClass() || defaultClass"
      (click)="buttonClicked.emit()"
    >
      @if(icon()){
        <i
          pButtonIcon
          [class]="'pi ' + icon()"      
        ></i>
      }
      <span 
        pButtonLabel
      >{{text()}}</span>
    </button>
  `,
  styles: ``,
})
export class ActionButton {
  text = input.required<string>();
  icon = input<string>('');
  customClass = input<string>('');

  buttonClicked = output<void>();

  protected readonly defaultClass = `
    !px-4 !bg-indigo-600 !hover:bg-indigo-700 !text-white !rounded-2xl !text-xs !font-bold !transition-all !shadow-sm !flex !items-center !gap-1.5 !border-none
  `;
}
