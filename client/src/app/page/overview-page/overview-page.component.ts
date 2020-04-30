import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from '../../services/analytics.service';
import {Observable} from 'rxjs';
import {OverviewPage} from '../../shared/interfaces';
import {MaterialInstance, MaterialService} from '../../shared/clasess/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  // @ts-ignore
  @ViewChild('tapTarget') tapTargetRef: ElementRef;
  tapTarget: MaterialInstance;
  data$: Observable<OverviewPage>;

  yesterday = new Date();

  constructor(private service: AnalyticsService) {
  }

  ngOnInit() {
    this.data$ = this.service.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo() {
    this.tapTarget.open();
  }


}
