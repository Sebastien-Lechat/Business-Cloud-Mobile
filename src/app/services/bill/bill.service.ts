import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BillCreateI, BillUpdateI } from 'src/interfaces/billInterface';
import { Stripe } from '@capacitor-community/stripe';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getBillList() {
    return this.http.get<any>(this.url + `bills`);
  }

  getOneBill(id: string) {
    return this.http.get<any>(this.url + `bill/` + id);
  }

  create(data: BillCreateI) {
    return this.http.post<any>(this.url + `bill`, data);
  }

  update(data: BillUpdateI) {
    return this.http.put<any>(this.url + `bill`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `bill/` + id);
  }

  sendMail(billId: string, clientId: string) {
    return this.http.post<any>(this.url + `bill/` + billId + `/customer/` + clientId + `/mail`, {});
  }

  async createPaymentSheet(amount: number) {
    const { paymentIntent, ephemeralKey, customer } = await this.http.post<{
      paymentIntent: string;
      ephemeralKey: string;
      customer: string;
    }>(this.url + 'bill/payment-sheet', { amount }).pipe(first()).toPromise(Promise);

    Stripe.createPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      merchantDisplayName: 'BusinessCloud Mobile',
      customerEphemeralKeySecret: ephemeralKey,
      // style: 'alwaysDark',
    });
  }
}
