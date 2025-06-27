import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigator',
  imports: [RouterLink, NgStyle],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent implements OnInit {
  isOpen!: boolean
  ngOnInit(): void {
    this.isOpen = false
  }
  openClose(): void {
    this.isOpen=!this.isOpen
  }
}
