import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigator',
  imports: [NgStyle, NgClass],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent implements OnInit {
  isOpen!: boolean
  chartSection!: boolean
  selectionSection!: boolean
  @Input()
  chartBlocked!: boolean
  @Input()
  current!: string

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isOpen = false
    this.initSelectionSectionState()
    this.initChartSectionState()
    this.initChartBlockedState()
  }
  openClose(): void {
    this.isOpen = !this.isOpen
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
  initSelectionSectionState(): void {
    let hasPrefixTable = this.current.toLocaleLowerCase().includes("table")
    let obj = JSON.parse(window.localStorage.getItem('selectionSection') as string)
    if (obj) {
      this.selectionSection = obj.selectionSection
    }
    else {
      this.selectionSection = false
    }
    if(hasPrefixTable) {
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
  initChartBlockedState(): void {
    let obj = JSON.parse(window.localStorage.getItem('selection') as string)
    if (obj && new Map(Object.entries(obj.chartPages)).size) {
      this.chartBlocked = false
    }
    else {
      this.chartBlocked = true
    }
  }
  openCloseSelectionSection(): void {
    this.selectionSection = !this.selectionSection
    window.localStorage.setItem('selectionSection', JSON.stringify({ selectionSection: this.selectionSection }))
  }
  openCloseChartSection(): void {
    this.chartSection = !this.chartSection
    window.localStorage.setItem('chartSection', JSON.stringify({ chartSection: this.chartSection }))
  }
}
