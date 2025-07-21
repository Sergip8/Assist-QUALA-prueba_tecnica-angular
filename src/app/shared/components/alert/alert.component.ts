import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [NgIf],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: AlertType = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() autoClose: boolean = false;
  @Input() autoCloseTime: number = 5000; // 5 segundos por defecto
  @Input() showIcon: boolean = true;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<void>();

  isVisible: boolean = true;
  private autoCloseTimer?: number;

  ngOnInit() {
    if (this.autoClose) {
      this.startAutoCloseTimer();
    }
  }

  close() {
    this.isVisible = false;
    this.onClose.emit();
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  action() {
    this.onAction.emit();
  }

  private startAutoCloseTimer() {
    this.autoCloseTimer = window.setTimeout(() => {
      this.close();
    }, this.autoCloseTime);
  }

  getIconClass(): string {
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    return iconMap[this.type];
  }
}