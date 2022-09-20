import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IChoicesDialogData{
  choices: IChoice[];
  questionText?: string;
  dialogTitle: string;
}

export interface IChoice{
  text: string;
  value: any;
}

@Component({
  selector: 'app-choices-dialog',
  templateUrl: './choices-dialog.component.html',
  styleUrls: ['./choices-dialog.component.css']
})
export class ChoicesDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IChoicesDialogData) {

  }

  ngOnInit(): void {
  }

}
