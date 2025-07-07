import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigator',
  imports: [NgStyle],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent implements OnInit {
  isOpen!: boolean
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isOpen = false
  }
  openClose(): void {
    this.isOpen = !this.isOpen
  }

  openNewPage(url: string): void {
    this.router.navigateByUrl(url).then(
      ()=> {
        window.location.reload()
      }
    )
  }
}
