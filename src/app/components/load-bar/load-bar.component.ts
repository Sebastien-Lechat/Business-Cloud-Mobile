import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-bar',
  templateUrl: './load-bar.component.html',
  styleUrls: ['./load-bar.component.scss'],
})
export class LoadBarComponent implements OnInit {

  @Input() active: boolean;

  constructor() { }

  ngOnInit() { }

}
