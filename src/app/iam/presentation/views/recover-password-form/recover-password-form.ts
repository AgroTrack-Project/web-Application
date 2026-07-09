import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-password-form',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './recover-password-form.html',
  styleUrl: './recover-password-form.css',
})
export class RecoverPasswordForm {
  form = {
    email: '',
  };

  readonly message = signal<string | null>(null);

  onSubmit() {
    this.message.set('función no disponible xd');
  }
}
