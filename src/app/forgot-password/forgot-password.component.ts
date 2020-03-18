import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  profileForm = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
