import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isInsight?: boolean;
}

@Component({
  selector: 'app-ai-assistant-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-8 font-sans max-w-5xl mx-auto h-[calc(100vh-12rem)]">
      
      <!-- Top Title Banner -->
      <div class="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <i class="pi pi-sparkles text-indigo-500"></i>
            Notion AI Assistant Workspace
          </h2>
          <p class="text-xs text-slate-400 font-medium mt-0.5">Explore real-time ADR analysis, clean queues summaries or dynamic yield insights.</p>
        </div>
      </div>

      <!-- Main Conversation Layout -->
      <div class="flex-1 bg-white border border-slate-100 rounded-[28px] shadow-sm flex flex-col justify-between overflow-hidden">
        
        <!-- Conversation Feed -->
        <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          @for (msg of chatHistory(); track $index) {
            <div 
              class="flex flex-col max-w-[80%] font-sans"
              [ngClass]="msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'">
              
              <div 
                class="px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm"
                [ngClass]="msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-none'">
                
                @if (msg.isInsight) {
                  <div class="flex items-center gap-1.5 text-indigo-600 font-extrabold mb-2.5 text-xs">
                    <i class="pi pi-chart-line"></i>
                    <span>GRAND LUXE REAL-TIME OCCUPANCY YIELD</span>
                  </div>
                }
                
                <p class="whitespace-pre-line text-xs font-semibold">{{ msg.text }}</p>
              </div>
              
              <span class="text-[9px] text-slate-400 font-bold mt-1.5 px-1">{{ msg.time }}</span>
            </div>
          }

          @if (isGenerating()) {
            <div class="self-start flex flex-col items-start gap-1">
              <div class="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-3xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              </div>
              <span class="text-[9px] text-slate-400 font-bold block ml-2">Engine generating...</span>
            </div>
          }
        </div>

        <!-- Inputs & Prompt Chips -->
        <div class="p-6 border-t border-slate-50 bg-slate-50/20 backdrop-blur-md">
          <!-- Suggested Prompt Chips -->
          <div class="flex flex-wrap gap-2 mb-4">
            @for (chip of suggestionChips(); track chip) {
              <button 
                (click)="selectChip(chip)" 
                class="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm">
                {{ chip }}
              </button>
            }
          </div>

          <!-- Message input -->
          <div class="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-indigo-500 transition-colors">
            <input 
              type="text" 
              [(ngModel)]="userInput"
              (keydown.enter)="sendMessage()"
              placeholder="Query live suites occupancy, night tariffs trends, or housekeeping dispatch schedules..." 
              class="flex-1 bg-transparent border-none outline-none text-xs px-4 text-slate-700 placeholder-slate-400 font-sans font-bold" 
            />
            <button 
              (click)="sendMessage()" 
              class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-md shadow-indigo-600/10 shrink-0">
              <i class="pi pi-send text-xs"></i>
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AiAssistantPageComponent {
  readonly userInput = signal('');
  readonly isGenerating = signal(false);

  readonly chatHistory = signal<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am the Grand Luxe Notion AI interface. I have live read access to the PMS database. I can audit room yields, summarize cleanliness logs, or predict weekly booking density. What can I query for you today?',
      time: '12:20 PM'
    }
  ]);

  readonly suggestionChips = signal<string[]>([
    'Audit Room Tariffs ADR',
    'Rooms Status Compliance',
    'List unassigned dirty tasks',
    'Occupancy forecast'
  ]);

  selectChip(prompt: string): void {
    this.userInput.set(prompt);
    this.sendMessage();
  }

  sendMessage(): void {
    const val = this.userInput().trim();
    if (!val) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.chatHistory.update(prev => [...prev, {
      sender: 'user',
      text: val,
      time: now
    }]);

    this.userInput.set('');
    this.isGenerating.set(true);

    setTimeout(() => {
      let replyText = 'I am auditing the live Grand Luxe records. Here are my findings:';
      let isInsight = false;

      const lower = val.toLowerCase();
      if (lower.includes('adr') || lower.includes('tariff')) {
        replyText = `PMS AUDIT LEDGER - MAY 2026:
        
        • Average Daily Rate (ADR): $285.50
        • Monthly Gross Revenue: $48,950.00
        • Highest Yield Suite: Room 201 (Penthouse Presidential, $950/night)
        
        Tariff yield exceeds May target by 14.2%. Performance is exceptional.`;
      } else if (lower.includes('dirty') || lower.includes('housekeeping')) {
        replyText = `HOUSEKEEPING AUDIT - ACTIVE QUEUE:
        
        • Dirty Rooms pending: 2 (Rooms 101 and 103)
        • Out-of-order Maintenance: 1 (Room 202, AC compressor replacement)
        
        All clean rooms (6) have been verified and certified. Housekeeping logs match compliance specifications.`;
      } else if (lower.includes('occupancy') || lower.includes('forecast')) {
        replyText = `REAL-TIME COMPLIANCE FORECAST:
        
        • Today's occupancy: 75.6%
        • Projected weekend density (Jun 2 - 4): 88.0%
        
        Corporate check-ins are driving suite demand. Recommended yield action: Maintain current Deluxe Suite tariff at $250/night.`;
        isInsight = true;
      } else {
        replyText = `Query executed. Grand Luxe records are optimal.
        
        Is there any other operational dashboard metric or financial ledger analysis you want me to compile?`;
      }

      this.chatHistory.update(prev => [...prev, {
        sender: 'assistant',
        text: replyText,
        time: now,
        isInsight
      }]);

      this.isGenerating.set(false);
    }, 1200);
  }
}
