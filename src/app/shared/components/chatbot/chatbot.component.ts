import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

interface ChatMessage { role: 'user' | 'bot'; text: string; }

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chatbot Window -->
    <div class="chatbot-window" [class.open]="isOpen" id="chatbot-window">
      <!-- Header -->
      <div class="flex items-center gap-3 p-4 border-b border-white/8"
        style="background:linear-gradient(135deg,rgba(6,182,212,0.1),rgba(124,58,237,0.1));">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style="background:linear-gradient(135deg,#06b6d4,#7c3aed);">🤖</div>
        <div>
          <div class="text-white font-semibold text-sm font-grotesk">CODIXY AI Assistant</div>
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-emerald-400 text-xs font-outfit">Online</span>
          </div>
        </div>
        <button class="ml-auto text-slate-400 hover:text-white transition-colors" (click)="toggle()">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex flex-col gap-3 p-4 overflow-y-auto h-72 hide-scrollbar" #messageArea>
        <div *ngFor="let msg of messages"
          class="flex" [class.justify-end]="msg.role==='user'">
          <div class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-outfit"
            [class.rounded-br-sm]="msg.role==='user'"
            [class.rounded-bl-sm]="msg.role==='bot'"
            [style.background]="msg.role==='user' ? 'linear-gradient(135deg,#06b6d4,#7c3aed)' : 'rgba(255,255,255,0.06)'"
            [style.color]="msg.role==='user' ? '#fff' : '#cbd5e1'">
            {{msg.text}}
          </div>
        </div>
        <div *ngIf="isTyping" class="flex gap-2 items-center px-4 py-2.5 rounded-2xl rounded-bl-sm w-fit"
          style="background:rgba(255,255,255,0.06);">
          <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay:0ms;"></span>
          <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay:150ms;"></span>
          <span class="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style="animation-delay:300ms;"></span>
        </div>
      </div>

      <!-- Quick Replies -->
      <div class="px-4 pb-3 flex flex-wrap gap-2">
        <button *ngFor="let q of quickReplies"
          class="text-xs px-3 py-1.5 rounded-full font-outfit transition-all duration-200 hover:scale-105"
          style="background:rgba(6,182,212,0.1);color:rgba(6,182,212,0.9);border:1px solid rgba(6,182,212,0.2);"
          (click)="sendQuick(q)">{{q}}</button>
      </div>

      <!-- Input -->
      <div class="p-4 pt-0 flex gap-2">
        <input type="text" [(ngModel)]="userInput" placeholder="Type a message..."
          class="form-input text-sm py-2.5 flex-1"
          (keyup.enter)="sendMessage()">
        <button class="btn-primary px-4 py-2.5 text-sm" (click)="sendMessage()">
          <svg class="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- WhatsApp Floating Button -->
    <a href="https://wa.me/916300358759" target="_blank"
      class="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 md:bottom-24 md:right-6 z-[9999] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 group"
      style="background:#25D366; box-shadow: 0 0 20px rgba(37, 211, 102, 0.4);"
      aria-label="Contact on WhatsApp">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

    <!-- Toggle Button -->
    <button
      class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 md:bottom-6 md:right-6 z-[9999] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 group"
      style="background:linear-gradient(135deg,#06b6d4,#7c3aed);box-shadow:0 0 30px rgba(6,182,212,0.4);"
      (click)="toggle()" aria-label="Toggle AI Chatbot">
      <svg *ngIf="!isOpen" class="w-6 h-6 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <svg *ngIf="isOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <!-- Pulse ring -->
      <span *ngIf="!isOpen" class="absolute inset-0 rounded-full animate-ping opacity-20"
        style="background:linear-gradient(135deg,#06b6d4,#7c3aed);"></span>
    </button>
  `,
  styles: [`:host{display:block;}`]
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  isTyping = false;
  userInput = '';
  messages: ChatMessage[] = [];
  quickReplies = ['Our Services', 'Get in Touch', 'Our Tech Stack', 'Careers'];

  private responses: Record<string, string> = {
    default: "Thank you for reaching out! I'm CODIXY AI. For detailed inquiries, please email connect@codixytechnologies.com or call +91 6300358759.",
    services: "CODIXY offers: AI & Automation, Web Development, Mobile Apps, Enterprise Software, UI/UX Design, and DevOps & Cloud solutions. Which interests you most?",
    contact: "📧 connect@codixytechnologies.com\n📞 +91 6300358759\n📍 Hyderabad, India",
    tech: "Our stack includes Angular, React, Node.js, Python, Flutter, AWS, Docker, MongoDB, Firebase, and more! We choose the best tech for each project.",
    careers: "We're hiring! Open roles: Full Stack Developer, React JS Developer, Node.js Developer, Java Developer, UI/UX Designer. Email: connect@codixytechnologies.com",
    hello: "Hello! 👋 Welcome to CODIXY Technologies — Engineering the Future. How can I assist you today?",
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.addBot("Hi! 👋 I'm CODIXY AI Assistant. How can I help you today?");
    }, 800);
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  sendQuick(text: string): void {
    this.userInput = text;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;
    const input = this.userInput.trim();
    this.messages.push({ role: 'user', text: input });
    this.userInput = '';
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.addBot(this.getResponse(input));
    }, 1000 + Math.random() * 500);
  }

  private addBot(text: string): void {
    this.messages.push({ role: 'bot', text });
  }

  private getResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.match(/service|offer|do you/)) return this.responses['services'];
    if (lower.match(/contact|email|phone|reach/)) return this.responses['contact'];
    if (lower.match(/tech|stack|framework|language/)) return this.responses['tech'];
    if (lower.match(/career|job|hiring|role|work/)) return this.responses['careers'];
    if (lower.match(/hello|hi|hey|greet/)) return this.responses['hello'];
    return this.responses['default'];
  }
}
