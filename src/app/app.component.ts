import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from "./shared/components/alert/alert.component";

import { Subscription } from 'rxjs';
import { AlertConfig, AlertService } from './_core/services/alert.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent,NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QualaSucursalesAng';
  alerts: AlertConfig[] = [];
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.alerts$.subscribe(
      alerts => this.alerts = alerts
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onAlertClose(id: string) {
    this.alertService.dismiss(id);
  }

  trackByAlertId(index: number, alert: AlertConfig): string {
    return alert.id || index.toString();
  }
}
