import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { QuerySettingsService } from '../../../services/query-settings.service';

@Component({
  selector: 'app-navigator',
  imports: [NgStyle, NgClass],
  providers: [QuerySettingsService],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent implements OnInit {
  openSelectionPage() {
    this.querySettings.redirectSelectionPage().then(res => {
      if(!res) this.router.navigate(['/selection-main']) 
    })
  }
  isOpen!: boolean
  chartSection!: boolean
  viewSection!: boolean
  selectionSection!: boolean
  @Input()
  chartBlocked!: boolean
  @Input()
  lastSavedBlocked!: boolean
  @Input()
  current!: string

  constructor(
    private router: Router,
    private querySettings: QuerySettingsService
  ) { }

  ngOnInit(): void {
    this.initMenuState()
    this.initSelectionSectionState()
    this.initChartSectionState()
    this.initViewSectionState()
    // this.initChartBlockedState()
    // this.initTableUrlBlockedState()
  }
  initMenuState(): void {
    const state = JSON.parse(window.localStorage.getItem('isMenuOpen') as string)
    if (state) {
      this.isOpen = state
    }
    else {
      localStorage.setItem('isMenuOpen', 'false')
      this.isOpen = false
    }
  }
  openClose(): void {
    this.isOpen = !this.isOpen
    localStorage.setItem('isMenuOpen', `${this.isOpen}`)
  }
  openNewPage(url: string): void {

    this.router.navigateByUrl(url)
      .then(
        () => {
          window.location.reload()
        }
      )
  }
  openChartPage(url: string): void {
    if (!this.chartBlocked) {
      this.openNewPage(url)
    }
  }

  // openLastSaved(): void {
  //   let obj = JSON.parse(window.localStorage.getItem('selection') as string)
  //   if (obj && obj.tableUrl) {
  //     this.router.navigateByUrl(obj.tableUrl)
  //   }
  // }

  initSelectionSectionState(): void {
    let hasPrefixTable = this.current.toLocaleLowerCase().includes("selection")
    let obj = JSON.parse(window.localStorage.getItem('selectionSection') as string)
    if (obj) {
      this.selectionSection = obj.selectionSection
    }
    else {
      this.selectionSection = false
    }
    if (hasPrefixTable) {
      this.selectionSection = true
    }
  }
  initChartSectionState(): void {
    let obj = JSON.parse(window.localStorage.getItem('chartSection') as string)
    if (obj) {
      this.chartSection = obj.chartSection
    }
    else {
      this.chartSection = false
    }
  }
  initViewSectionState(): void {
    let obj = JSON.parse(window.localStorage.getItem('viewSection') as string)
    if (obj) {
      this.viewSection = obj.viewSection
    }
    else {
      this.viewSection = false
    }
  }

  // initChartBlockedState(): void {
  //   let obj = JSON.parse(window.localStorage.getItem('selection') as string)
  //   if (obj && obj.chartPages) {
  //     this.chartBlocked = false
  //   }
  //   else {
  //     this.chartBlocked = true
  //   }
  // }

  // initTableUrlBlockedState(): void {
  //   let obj = JSON.parse(window.localStorage.getItem('selection') as string)
  //   if (obj && obj.tableUrl) {
  //     this.lastSavedBlocked = false
  //   }
  //   else {
  //     this.lastSavedBlocked = true
  //   }
  // }

  openCloseSelectionSection(): void {
    this.selectionSection = !this.selectionSection
    window.localStorage.setItem('selectionSection', JSON.stringify({ selectionSection: this.selectionSection }))
  }
  openCloseChartSection(): void {
    this.chartSection = !this.chartSection
    window.localStorage.setItem('chartSection', JSON.stringify({ chartSection: this.chartSection }))
  }
  openCloseViewSection(): void {
    this.viewSection = !this.viewSection
    window.localStorage.setItem('viewSection', JSON.stringify({ viewSection: this.viewSection }))
  }
}
