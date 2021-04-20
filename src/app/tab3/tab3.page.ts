import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('chart') chart: any;

  constructor(private router: Router, private location: Location) { }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  nagivateBack() {
    this.location.back();
  }

  ionViewDidEnter() {
    // this.createBarChart();
  }

  createBarChart() {
    this.chart = new Chart(this.chart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jav', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'], // , 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'
        datasets: [{
          label: 'Revenus',
          backgroundColor: '#009E0F',
          data: [
            6534, 4864, 8645, 6487, 13468, 4879, 4689, 658, 123, 14587, 548, 3695
          ]
        }, {
          label: 'Dépenses',
          backgroundColor: '#F20C0C',
          data: [
            -1245, -6550, -3750, -7459, -680, -3548, -9, -14500, -24785, -369, -123, -266
          ]
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom',
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 15000,
              min: -10000,
              display: false // This will remove only the label
            },
            gridLines: {
              display: true,
            },
          }],
          xAxes: [{
            gridLines: {
              display: true,
            },
            stacked: true,
          }]
        }
      }
    });
  }
}
