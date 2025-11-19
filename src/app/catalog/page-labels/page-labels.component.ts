import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppEnum } from '../../../utils/enum/app.enum';
import { ApiService } from '../../../services/api.services';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { QuerySettingsService } from '../../../services/query-settings.service';

@Component({
  selector: 'app-page-labels',
  providers: [QuerySettingsService],
  imports: [NgStyle, NgClass, NgFor],
  templateUrl: './page-labels.component.html',
  styleUrl: './page-labels.component.css'
})
export class PageLabelsComponent implements OnChanges {

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private querySettings: QuerySettingsService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.from = 0
    this.last = Math.ceil(this.records.length / this.rowsCount) === 0 ? 0 : Math.ceil(this.records.length / this.rowsCount) - 1
    if (query.get('page')) {
      // console.log(query.get('page'))
      if (!isNaN(parseInt(query.get('page') as string))) {
        const value = parseInt(query.get('page') as string)
        if (Math.ceil(this.records.length / this.rowsCount) < value) {
          // this.error = "Ничего не найдено"
          // this.iconName = "not_found"
        }
        else {
          const rest = value % this.step
          this.from = value - rest
          const n = this.step - rest
          this.to = value + n
          if (this.to >= this.last) {
            this.to = this.last + 1
          }
          this.changeCurrentPage(value)
        }
      }
      // else {
      //   this.error = "Некорректный формат страницы"
      //   this.iconName = "invalid_file"
      // }
    }
    else {
      this.to = this.records.length / this.rowsCount <= this.step ? Math.ceil(this.records.length / this.rowsCount) : this.step
    }
    this.updatePages()
    this.selectPage()
  }
  @Input()
  step: number = 0
  @Input()
  rowsCount: number = 0
  @Input()
  records!: any[]
  from: number = 0
  to: number = 1
  currentPage: number = 0
  last: number = 1
  pages: number[] = []
  @Output()
  public onPageSelected = new EventEmitter<number>()
  prevSet(): void {
    if (this.from != 0) {
      this.from -= this.step
      if (this.to % this.step === 0) {
        this.to -= this.step
      }
      else {
        this.to = this.to - (this.to % this.step)
      }
      this.changeCurrentPage(this.from)
      this.updatePages()
      this.selectPage()
    }
  }
  prev(): void {
    if (this.currentPage > 0) {
      this.changeCurrentPage(this.currentPage - 1)
      if (this.currentPage !== 0 && (this.currentPage + 1) % this.step === 0) {
        this.from -= this.step
        if (this.to % this.step === 0) {
          this.to -= this.step
        }
        else {
          this.to = this.to - (this.to % this.step)
        }
        this.updatePages()
      }
      this.selectPage()
    }
  }

  next(): void {
    if (this.currentPage < this.last) {
      this.changeCurrentPage(this.currentPage + 1)
      if (this.currentPage % this.step === 0) {
        this.from += this.step
        this.to = this.to + this.step > this.last ? this.last + 1 : this.to + this.step
        this.updatePages()
      }
      this.selectPage()
    }
  }

  getLatest(): void {
    this.from = this.last - this.last % this.step
    this.to = this.last + 1
    this.changeCurrentPage(this.last)
    this.updatePages()
    this.selectPage()
  }

  nextSet(): void {
    if (this.to <= this.last) {
      this.from += this.step
      this.to = this.to + this.step > this.last ? this.last + 1 : this.to + this.step
      this.changeCurrentPage(this.from)
      this.updatePages()
      this.selectPage()
    }
  }

  selectPage(): void {
    this.onPageSelected.emit(this.currentPage)
  }

  changeCurrentPage(value: number): void {
    this.currentPage = value
    this.querySettings.setQuery(new Map().set('page', value), 'merge')
  }

  updatePages(): void {
    this.pages = []
    for (let i = this.from; i < this.to; i++) {
      this.pages.push(i)
    }
  }
 
  // setQuery(query: Map<string, string>, queryParamsHandlingState: 'replace' | 'merge'): Promise<Map<string, string>> {
  //   const querysearchBuffer: Map<string, string | null> = query
  //   if (querysearchBuffer.get('ruComponentType') === AppEnum.ALL) {
  //     querysearchBuffer.set('ruComponentType', null)
  //   }
  //   return this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: Object.fromEntries(querysearchBuffer),
  //     queryParamsHandling: queryParamsHandlingState,
  //     skipLocationChange: false,
  //   }).then(() => {
  //     if (querysearchBuffer.get('ruComponentType') === null) {
  //       querysearchBuffer.delete('ruComponentType')
  //     }
  //     return querysearchBuffer as Map<string, string>
  //   });
  // }
}
