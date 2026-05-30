import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Sidebar } from './components/sidebar/sidebar';
import { NotificationContainer } from './components/notification-container/notification-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Sidebar, NotificationContainer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

}
