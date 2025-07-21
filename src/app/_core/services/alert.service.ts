import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertConfig {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  showIcon?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<AlertConfig[]>([]);
  public alerts$: Observable<AlertConfig[]> = this.alertsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Método genérico para mostrar alertas
  show(config: AlertConfig): string {
    const alert: AlertConfig = {
      id: this.generateId(),
      dismissible: true,
      autoClose: true,
      autoCloseTime: 3000,
      showIcon: true,
      ...config
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);

    // Auto-cerrar si está configurado
    if (alert.autoClose && alert.autoCloseTime) {
      setTimeout(() => {
        this.dismiss(alert.id!);
      }, alert.autoCloseTime);
    }

    return alert.id!;
  }

  // Métodos de conveniencia
  success(message: string, title?: string, options?: Partial<AlertConfig>): string {
    return this.show({
      type: 'success',
      message,
      title,
      ...options
    });
  }

  error(message: string, title?: string, options?: Partial<AlertConfig>): string {
    return this.show({
      type: 'error',
      message,
      title,
      ...options
    });
  }

  warning(message: string, title?: string, options?: Partial<AlertConfig>): string {
    return this.show({
      type: 'warning',
      message,
      title,
      ...options
    });
  }

  info(message: string, title?: string, options?: Partial<AlertConfig>): string {
    return this.show({
      type: 'info',
      message,
      title,
      ...options
    });
  }

  // Cerrar una alerta específica
  dismiss(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }

  // Cerrar todas las alertas
  dismissAll(): void {
    this.alertsSubject.next([]);
  }

  // Cerrar todas las alertas de un tipo específico
  dismissByType(type: 'success' | 'error' | 'warning' | 'info'): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(alert => alert.type !== type));
  }
}