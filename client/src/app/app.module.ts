import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {LoginPageComponent} from './page/login-page/login-page.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterPageComponent} from './page/register-page/register-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {TokenInterceptor} from './shared/clasess/token.interceptor';
import {OverviewPageComponent} from './page/overview-page/overview-page.component';
import {AnalyticsPageComponent} from './page/analytics-page/analytics-page.component';
import {OrderPageComponent} from './page/order-page/order-page.component';
import {CategoriesPageComponent} from './page/categories-page/categories-page.component';
import {HistoryPageComponent} from './page/history-page/history-page.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CategoriesFormComponent } from './page/categories-page/categories-form/categories-form.component';
import { PositionsFormComponent } from './page/categories-page/categories-form/positions-form/positions-form.component';
import { OrderCategoriesComponent } from './page/order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './page/order-page/order-positions/order-positions.component';
import { HistoryListComponent } from './page/history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './page/history-page/history-filter/history-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    OrderPageComponent,
    CategoriesPageComponent,
    HistoryPageComponent,
    LoaderComponent,
    CategoriesFormComponent,
    PositionsFormComponent,
    OrderCategoriesComponent,
    OrderPositionsComponent,
    HistoryListComponent,
    HistoryFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: TokenInterceptor}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
