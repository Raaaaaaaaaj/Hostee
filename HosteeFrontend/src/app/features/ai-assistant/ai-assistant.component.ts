import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isInsight?: boolean;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col justify-between bg-slate-950 text-white font-sans">
      
      <!-- AI Sidebar Header -->
      <div class="p-6 border-b border-slate-900 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <i class="pi pi-sparkles text-xs"></i>
          </div>
          <div>
            <h3 class="text-sm font-extrabold tracking-tight">Notion AI Engine</h3>
            <span class="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">Grand Luxe Intelligence</span>
          </div>
        </div>
        
        <button 
          (click)="closeAssistant.emit()"
          class="w-8 h-8 rounded-lg hover:bg-slate-900 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          title="Close">
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Chat Bubble History -->
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        @for (msg of chatHistory(); track $index) {
          <div 
            class="flex flex-col max-w-[85%]"
            [ngClass]="msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'">
            
            <div 
              class="px-4 py-3 rounded-2xl text-xs leading-relaxed font-sans shadow-sm"
              [ngClass]="msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'">
              
              @if (msg.isInsight) {
                <div class="flex items-center gap-1.5 text-indigo-400 font-bold mb-2">
                  <i class="pi pi-chart-line text-[10px]"></i>
                  <span>HOTEL OCCUPANCY PREDICTION</span>
                </div>
              }
              
              <p class="whitespace-pre-line">{{ msg.text }}</p>
            </div>
            
            <span class="text-[9px] text-slate-600 font-semibold mt-1">{{ msg.time }}</span>
          </div>
        }

        @if (isGenerating()) {
          <!-- Typing Loader -->
          <div class="self-start flex flex-col items-start gap-1">
            <div class="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
            </div>
            <span class="text-[9px] text-slate-600 font-semibold font-sans">Generating...</span>
          </div>
        }
      </div>

      <!-- Suggested Prompt Chips & Input Panel -->
      <div class="p-6 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <!-- Suggested Prompts Chips -->
        <span class="text-[9px] uppercase font-bold text-slate-600 tracking-wider font-sans block mb-2.5">Suggested Prompts</span>
        <div class="flex flex-wrap gap-1.5 mb-4">
          @for (chip of suggestionChips(); track chip) {
            <button 
              (click)="selectChip(chip)" 
              class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all text-left truncate max-w-full">
              {{ chip }}
            </button>
          }
        </div>

        <!-- Chat Input Bar -->
        <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
          <input 
            type="text" 
            [(ngModel)]="userInput"
            (keydown.enter)="sendMessage()"
            placeholder="Ask AI anything about the PMS..." 
            class="flex-1 bg-transparent border-none outline-none text-xs px-3 text-slate-100 placeholder-slate-500 font-sans" 
          />
          <button 
            (click)="sendMessage()" 
            class="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/20 shrink-0">
            <i class="pi pi-send text-[10px]"></i>
          </button>
        </div>
      </div>

    </div>
  `
})
export class AiAssistantComponent {
  readonly closeAssistant = output();

  readonly userInput = signal('');
  readonly isGenerating = signal(false);

  readonly chatHistory = signal<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am Grand Luxe Notion AI. I can compile live metrics, query suite occupancies, suggest pricing strategy, or detail clean schedules. How may I assist you today?',
      time: '12:00 PM'
    }
  ]);

  readonly suggestionChips = signal<string[]>([
    'Generate Occupancy Insights',
    'Rooms Status Report',
    'Compare ADR & RevPAR Trend',
    'List dirty rooms'
  ]);

  selectChip(prompt: string): void {
    this.userInput.set(prompt);
    this.sendMessage();
  }

  sendMessage(): void {
    const val = this.userInput().trim();
    if (!val) return;

    // Add user message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.chatHistory.update(prev => [...prev, {
      sender: 'user',
      text: val,
      time: now
    }]);

    this.userInput.set('');
    this.isGenerating.set(true);

    // Simulate response generation delay
    setTimeout(() => {
      let replyText = 'I am scanning the live PMS database. Here is what I found:';
      let isInsight = false;

      const lower = val.toLowerCase();
      if (lower.includes('occupancy') || lower.includes('insights')) {
        replyText = `Based on current reservations, Grand Luxe is operating at 75.6% occupancy today. 
        
        Our machine learning algorithms project a 12.4% increase in booking density over the upcoming weekend (June 2 - 4) driven by corporate conventions.
        
        Recommendation: Increase Superior Room retail rates by $20/night to maximize ADR yield.`;
        isInsight = true;
      } else if (lower.includes('dirty') || lower.includes('rooms')) {
        replyText = `There are currently 2 rooms categorized as "Dirty" awaiting housekeeping crew:
        
        • Room 101 (Deluxe Suite): Checkout dirty. Priority HIGH. Assigned cleaner: Marcus Brody.
        • Room 103 (Superior Room): Stayover dirty. Priority MEDIUM. Assigned cleaner: Sarah Connor.
        
        Housekeeping crews have been notified.`;
      } else if (lower.includes('adr') || lower.includes('revpar')) {
        replyText = `Audit Statistics for May 2026:
        
        • ADR (Average Daily Rate): $285.50 (increased $12.40 month-over-month)
        • RevPAR (Revenue Per Available Room): $215.80 (75.6% occupancy density)
        • Active month-to-date Revenue: $48,950.00.
        
        Performance charts reflect outstanding executive suites yield.`;
      } else {
        replyText = `Query processed. The system validates all current metrics as optimal. 
        
        Is there a specific operational workflow, guest detail check, or financial KPI trend you would like me to generate next?`;
      }

      this.chatHistory.update(prev => [...prev, {
        sender: 'assistant',
        text: replyText,
        time: now,
        isInsight
      }]);

      this.isGenerating.set(false);
    }, 1500);
  }
}
