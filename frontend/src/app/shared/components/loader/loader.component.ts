import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col items-center gap-4">
          <!-- Spinner -->
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <!-- Message -->
          @if (message()) {
            <p class="text-white text-lg font-medium">{{ message() }}</p>
          } @else {
            <p class="text-white text-lg font-medium">Cargando...</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class LoaderComponent {
  // Input signals
  show = input(true);
  message = input<string>();
}
