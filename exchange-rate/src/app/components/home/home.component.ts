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

  code: string = '';

  currentValue: string = '';
  currentFromSymbol: string = '';
  currentToSymbol: string = '';
  currentLastUpdate: string = '';

  cards: any[] = [];
  dailyHigh: string = '';
  dailyLow: string = '';
  dailyOpen: string = '';
  dailyClose: string = '';
  dailyDate: string = '';

  openDetailCurrentExchangeRate: boolean = false;
  openDetailDailyExchangeRate: boolean = false;

  consultExchange(form: any) {
    this.code = form.value.exchangeCode;

    if (this.code == '' || this.code == undefined) {
      Swal.fire({
        text: 'Fill the currency code!',
        icon: 'warning',
      });
      return;
    }

    if (
      this.code != 'usd' &&
      this.code != 'eur' &&
      this.code != 'gbp' &&
      this.code != 'jpy'
    ) {
      Swal.fire({
        text: 'Enter any of the following currency codes, USD, EUR, GBP or JPY!',
        icon: 'warning',
      });
      return;
    }

    this.authService.getCurrentExchangeRate(this.code).subscribe({
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
          'dd/MM/yyyy - HH:mm',
          'pt-BR'
        );
        this.currentValue = formatNumber(1 / response.exchangeRate, 'pt-BR');
      },
      error: (error) => {
        Swal.fire({
          text: 'Error!',
          icon: 'error',
        });
      },
    });
  }

  consultLastDays() {
    this.authService.getDailyExchangeRate(this.code).subscribe({
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
          this.openDetailDailyExchangeRate = false;
          return;
        }

        this.openDetailDailyExchangeRate = true;
        this.cards = response.data;
      },
      error: (error) => {
        Swal.fire({
          text: 'Error!',
          icon: 'error',
        });
      },
    });
  }

  formatDate(date: any): string {
    return formatDate(date, 'dd/MM/yyyy', 'pt-BR');
  }

  formatNumber(number: any): string {
    return formatNumber(1 / number, 'pt-BR', '1.4-4');
  }

  formatPercent(number: any): string {
    let percent = formatNumber(number, 'pt-BR', '1.2-2');
    return number >= 0 ? `+${percent}%` : `${percent}%`;
  }
}
