import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { Sidebar } from './Components/sidebar/sidebar';
import { NotificationContainer } from './Components/notification-container/notification-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Sidebar, NotificationContainer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

}
