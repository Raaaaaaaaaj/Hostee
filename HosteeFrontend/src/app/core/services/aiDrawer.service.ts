import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AIDrawer {
  public isOpen = signal<boolean>(false);

  public openAIDrawer():void {
    this.isOpen.set(true);
  }
 
  public closeAIDrawer():void {
    this.isOpen.set(false);
  }
}
