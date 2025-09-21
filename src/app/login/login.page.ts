import { Component, inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';

  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        header: 'Login Failed',
        message: 'Please enter both email and password.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.navCtrl.navigateRoot('/tabs');
    } catch (error: any) {
      const alert = await this.alertCtrl.create({
        header: 'Login Failed',
        message: error.message || 'An unexpected error occurred.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
