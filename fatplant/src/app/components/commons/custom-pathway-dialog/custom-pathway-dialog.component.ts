import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-custom-pathway-dialog',
  templateUrl: './custom-pathway-dialog.component.html',
  styleUrls: ['./custom-pathway-dialog.component.scss']
})
export class CustomPathwayDialogComponent implements OnInit {

  hoveredRects = [];

  constructor(
    private dialogRef: MatDialogRef<CustomPathwayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.hoveredRects = data.hoveredRects;
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
