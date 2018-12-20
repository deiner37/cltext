import {NgModule, ModuleWithProviders, PipeTransform, Pipe} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {NotificationsService} from './notifications.service';
import {SimpleNotificationsComponent} from './simple-notifications.component';
import {NotificationComponent} from './notification.component';
import {MaxPipe} from './max.pipe';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [SimpleNotificationsComponent, NotificationComponent, MaxPipe, SafeHtmlPipe],
  providers: [],
  exports: [SimpleNotificationsComponent]
})
export class SimpleNotificationsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimpleNotificationsModule,
      providers: [
        NotificationsService
      ]
    };
  }
}
