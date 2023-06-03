import { Component } from '@angular/core';
import { formatDate, registerLocaleData, formatNumber } from '@angular/common';
import Swal from 'sweetalert2';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);

// Auth
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  currentValue: string = '';
  currentFromSymbol: string = '';
  currentToSymbol: string = '';
  currentLastUpdate: string = '';
  currentExchangeRate: number = 0;

  openDetailCurrentExchangeRate: boolean = false;

  consultExchange(form: any) {
    let code = form.value.exchangeCode;

    if (code == '' || code == undefined) {
      Swal.fire({
        text: 'Fill the currency code!',
        icon: 'warning',
      });
      return;
    }

    if (code != 'usd' && code != 'eur' && code != 'gbp' && code != 'jpy') {
      Swal.fire({
        text: 'Enter any of the following currency codes, USD, EUR, GBP or JPY!',
        icon: 'warning',
      });
      return;
    }

    this.authService.getCurrentExchangeRate(code).subscribe({
      next: (response) => {
        if (
          response == null ||
          response == undefined ||
          response.success == false
        ) {
          Swal.fire({
            text: 'Error!',
            icon: 'error',
          });
          this.openDetailCurrentExchangeRate = false;
          return;
        }

        this.openDetailCurrentExchangeRate = true;
        this.currentFromSymbol = response.fromSymbol;
        this.currentToSymbol = response.toSymbol;
        this.currentLastUpdate = formatDate(
          response.lastUpdatedAt,
          'dd/MM/yyyy - hh:mm',
          'pt-BR'
        );
        this.currentExchangeRate = response.exchangeRate;

        let value = 1 / this.currentExchangeRate;
        this.currentValue = formatNumber(value, 'pt-BR');

        console.log(response);
      },
      error: (error) => {
        Swal.fire({
          text: 'Error!',
          icon: 'error',
        });
      },
    });
  }
}
