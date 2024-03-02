import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent  implements OnInit, OnDestroy {

  hideTabs: boolean = false;
  hideHeader: boolean = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) { }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.hideTabs = event.url.includes('/user/workout-in-progress');
        this.hideHeader = event.url.includes('/user/workout-in-progress');
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
