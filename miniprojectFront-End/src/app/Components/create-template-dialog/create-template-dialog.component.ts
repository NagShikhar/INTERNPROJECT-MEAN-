import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-template-dialog',
  templateUrl: './create-template-dialog.component.html',
  styleUrls: ['./create-template-dialog.component.css']
})
export class CreateTemplateDialogComponent {

  templateName: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  create(): void {
    this.dialogRef.close();
  }
}
