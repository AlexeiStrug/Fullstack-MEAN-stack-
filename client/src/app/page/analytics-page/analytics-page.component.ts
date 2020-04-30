import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from '../../services/analytics.service';
import {AnalyticsPage} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  // @ts-ignore
  @ViewChild('gain') gainRef: ElementRef;
  // @ts-ignore
  @ViewChild('order') orderRef: ElementRef;
  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private service: AnalyticsService) {
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Revenue',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    };
    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      // ****** temp Gain ******
      gainConfig.labels.push('27.04.2020');
      gainConfig.data.push(1000);

      gainConfig.labels.push('28.04.2020');
      gainConfig.data.push(1500);
      // ****** temp Gain ******

      // ****** temp Order ******
      orderConfig.labels.push('27.04.2020');
      orderConfig.data.push(2);

      orderConfig.labels.push('28.04.2020');
      orderConfig.data.push(8);
      // ****** temp Order ******


      const gainContext = this.gainRef.nativeElement.getContext('2d');
      gainContext.canvas.height = '300px';

      const orderContext = this.orderRef.nativeElement.getContext('2d');
      orderContext.canvas.height = '300px';

      // tslint:disable-next-line:no-unused-expression
      new Chart(gainContext, creatChartConfig(gainConfig));

      // tslint:disable-next-line:no-unused-expression
      new Chart(orderContext, creatChartConfig(orderConfig));

      this.pending = false;
    });
  }

}

function creatChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };

}
