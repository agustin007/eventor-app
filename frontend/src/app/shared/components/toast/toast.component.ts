import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-slide-in transition-all duration-300 transform"
          [ngClass]="getToastClasses(toast.type)">
          
          <!-- Icon -->
          <div class="flex-shrink-0">
            @switch (toast.type) {
              @case ('success') { <span class="text-xl">✅</span> }
              @case ('error') { <span class="text-xl">❌</span> }
              @case ('warning') { <span class="text-xl">⚠️</span> }
              @case ('info') { <span class="text-xl">ℹ️</span> }
            }
          </div>

          <!-- Message -->
          <p class="text-sm font-medium text-white flex-1">{{ toast.message }}</p>

          <!-- Close Button -->
          <button (click)="toastService.remove(toast.id)" class="text-white/60 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 shadow-green-500/10';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 shadow-red-500/10';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 shadow-yellow-500/10';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 shadow-blue-500/10';
      default:
        return 'bg-gray-800/80 border-white/10';
    }
  }
}
