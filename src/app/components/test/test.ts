import { JsonPipe } from '@angular/common';
import { Component, signal} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-test',
  imports: [FormField, ReactiveFormsModule, JsonPipe, FormsModule],
  templateUrl: './test.html',
})
export class Test {

  // Signal Form
  loginModel = signal<{email: string, password: string}>({
    email: '',
    password: ''
  })
  loginFormSignal = form(this.loginModel)

  // Reactive Form
  favoriteColorControlReactive = new FormControl('')

  // Template Form
  favoriteColorControlTemplate = signal('')
  constructor(){
  }
}
