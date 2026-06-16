import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Theme {

  // Extracting Browser data
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId)

  // Initilize signal based on localstorage or system preference
  private isDarkModeSignal = signal<boolean>(this.getInitialTheme());

  // Provide readonly signals to the components to consume
  readonly isDarkMode = this.isDarkModeSignal.asReadonly();

  constructor(){
    effect(()=>{
      this.updateThemeClass(this.isDarkModeSignal())
    })
  }

  // User event is happening on this
  toggleTheme():void {
    this.isDarkModeSignal.update(current => !current)
  }

  // Gets the initial theme from the saved preference or the users windows setup
  private getInitialTheme():boolean {
    // Check browser or not to avoid SSR issue of faulty UI
    if(!this.isBrowser) return false;

    const savedTheme = localStorage.getItem("hms-theme");
    if(savedTheme){
      return savedTheme == "dark"
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Updting the Themeclass on user events such as toggle theme
  private updateThemeClass(isDark: boolean):void{
    // Check browser or not to avoid SSR issue of faulty UI
    if(!this.isBrowser) return
    const root = document.documentElement;

    if(isDark){
      root.classList.add('dark');
      localStorage.setItem('hms-theme', 'dark')
    }
    else{
      root.classList.remove('dark');
      localStorage.setItem('hms-theme', 'light')
    }
  }
}
