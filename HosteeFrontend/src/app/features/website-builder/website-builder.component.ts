import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-website-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-8 font-sans">
      
      <!-- Stepper/Controls Banner -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-extrabold text-slate-800 tracking-tight">Direct Landing Website Builder</h3>
          <p class="text-[11px] text-slate-400 font-medium">Design and publish high-performance direct-booking websites for your property</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            (click)="triggerDeploy()"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <i class="pi pi-globe"></i>
            Publish Direct Site
          </button>
        </div>
      </div>

      <!-- Split Layout: Builder Tools & Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar: Builder Layout Components (Visual widgets!) -->
        <div class="lg:col-span-3 flex flex-col gap-6">
          <!-- Branding Details -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <span class="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-50 pb-2">Site Styling</span>
            
            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] uppercase font-bold text-slate-400">Branding Theme Color</label>
              <div class="flex gap-2">
                @for (color of brandColors(); track color) {
                  <button 
                    (click)="selectedColor.set(color)" 
                    class="w-6 h-6 rounded-full border transition-transform duration-200 hover:scale-110"
                    [style.background]="color"
                    [class.border-slate-800]="selectedColor() === color">
                  </button>
                }
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] uppercase font-bold text-slate-400">Typography Typography</label>
              <select 
                [(ngModel)]="selectedFont"
                class="bg-slate-50 border border-slate-200 text-xs font-semibold px-2 py-1.5 rounded-xl text-slate-600 outline-none w-full">
                <option value="font-serif">Luxury Serif (Playfair)</option>
                <option value="font-sans">Modern Sans (Plus Jakarta)</option>
                <option value="font-mono">Clean Monospace (Roboto)</option>
              </select>
            </div>
          </div>

          <!-- Drag and Drop Sections mock list -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <span class="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-50 pb-2">Active Site Sections</span>
            
            <div class="flex flex-col gap-2">
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 cursor-grab hover:bg-slate-100 transition-colors">
                <span class="flex items-center gap-2"><i class="pi pi-bars text-slate-400"></i> Header Navigation</span>
                <i class="pi pi-check-circle text-emerald-500"></i>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 cursor-grab hover:bg-slate-100 transition-colors">
                <span class="flex items-center gap-2"><i class="pi pi-bars text-slate-400"></i> Luxury Hero Banner</span>
                <i class="pi pi-check-circle text-emerald-500"></i>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 cursor-grab hover:bg-slate-100 transition-colors">
                <span class="flex items-center gap-2"><i class="pi pi-bars text-slate-400"></i> Rooms Showcase Grid</span>
                <i class="pi pi-check-circle text-emerald-500"></i>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 cursor-grab hover:bg-slate-100 transition-colors">
                <span class="flex items-center gap-2"><i class="pi pi-bars text-slate-400"></i> Amenities Slideshow</span>
                <i class="pi pi-check-circle text-emerald-500"></i>
              </div>
              <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-600 cursor-grab hover:bg-slate-100 transition-colors">
                <span class="flex items-center gap-2"><i class="pi pi-bars text-slate-400"></i> Guest Reviews Grid</span>
                <i class="pi pi-check-circle text-emerald-500"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Live Canvas Preview Grid (Luxury premium mockup!) -->
        <div class="lg:col-span-9 bg-slate-100 border border-slate-200/50 p-6 rounded-[28px] shadow-inner relative min-h-[600px] overflow-hidden">
          
          <div class="bg-white border border-slate-100 rounded-2xl shadow-premium overflow-hidden flex flex-col justify-between" [ngClass]="selectedFont()">
            <!-- Site Header -->
            <div class="px-6 py-4 bg-white border-b border-slate-50 flex items-center justify-between">
              <span class="text-xs font-extrabold tracking-widest text-slate-800">GRAND LUXE RESORTS</span>
              <div class="flex items-center gap-4 text-[10px] text-slate-500 font-bold">
                <span>Rooms</span>
                <span>Spa</span>
                <span>Culinary</span>
                <button 
                  class="px-3 py-1.5 text-white rounded-lg text-[9px] font-bold shadow-sm"
                  [style.background]="selectedColor()">
                  Book Direct
                </button>
              </div>
            </div>

            <!-- Site Hero Banner -->
            <div class="relative py-28 px-12 text-white bg-slate-900 text-center overflow-hidden">
              <div class="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200')] bg-cover bg-center"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div class="relative z-10 flex flex-col items-center gap-4">
                <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-300">ULTRA LUXURY REDEFINED</span>
                <h1 class="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight max-w-xl">
                  Boutique Hospitality In Unrivaled Splendor.
                </h1>
                <p class="text-xs text-slate-300 max-w-sm font-sans leading-relaxed">
                  Five-star luxury oceanfront estates meticulously designed for discerning global travelers seeking quiet indulgence.
                </p>
                <button 
                  class="px-5 py-2.5 text-white rounded-xl text-xs font-bold mt-4 shadow-lg hover:scale-105 transition-transform"
                  [style.background]="selectedColor()">
                  Explore Active Suites
                </button>
              </div>
            </div>

            <!-- Rooms Section -->
            <div class="p-8 bg-white">
              <h2 class="text-lg font-serif text-slate-800 text-center font-bold mb-6">Our Luxurious Curated Suites</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=250&fit=crop" class="w-full h-36 object-cover" />
                  <div class="p-4">
                    <h3 class="text-xs font-extrabold text-slate-700">Penthouse Presidential Suite</h3>
                    <span class="text-[10px] text-slate-400 block mt-1">Starting from $950 / night</span>
                  </div>
                </div>

                <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=250&fit=crop" class="w-full h-36 object-cover" />
                  <div class="p-4">
                    <h3 class="text-xs font-extrabold text-slate-700">Deluxe Oceanfront Suite</h3>
                    <span class="text-[10px] text-slate-400 block mt-1">Starting from $250 / night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom preview label overlay -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-2xl text-[10px] font-extrabold tracking-widest uppercase shadow-lg flex items-center gap-1.5 backdrop-blur-md">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            Direct Live Visual Sandbox Preview
          </div>
        </div>

      </div>

    </div>
  `
})
export class WebsiteBuilderComponent {
  readonly selectedColor = signal('#4F46E5');
  readonly selectedFont = signal('font-serif');

  readonly brandColors = signal<string[]>([
    '#4F46E5', // Indigo
    '#D4AF37', // Gold
    '#0F172A', // Slate
    '#059669', // Emerald
    '#BE123C'  // Rose
  ]);

  triggerDeploy(): void {
    alert('Grand Luxe boutique direct site generated! Pushing CDN deployment logs to edge nodes.');
  }
}
