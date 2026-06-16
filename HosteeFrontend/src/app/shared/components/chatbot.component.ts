import { Component, inject } from "@angular/core";
import { Drawer } from "primeng/drawer";
import { AiAssistantComponent } from "../../features/ai-assistant/ai-assistant.component";
import { AIDrawer } from "../../core/services/aiDrawer.service";
@Component({
    selector: 'app-chatbotdrawer',
    standalone: true,
    imports: [
        Drawer,
        AiAssistantComponent
    ],
    template: `
        <p-drawer 
        [(visible)]="aidrawerService.isOpen" 
        position="right" 
        [modal]="true"
        [dismissible]="true"
        [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'"
        styleClass="w-96 p-0 border-l border-slate-100">
        <app-ai-assistant (closeDrawer)="aidrawerService.closeAIDrawer()"></app-ai-assistant>
      </p-drawer>
    `,
    styles: `

    `
})

export class ChatBotDrawer{
  protected readonly aidrawerService = inject(AIDrawer)
}