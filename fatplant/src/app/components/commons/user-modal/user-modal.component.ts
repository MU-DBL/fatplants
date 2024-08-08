import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FirestoreConnectionService} from '../../../services/firestore-access/firestore-connection.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {AuthService} from '../../../services/firestore-access/auth.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  userDoc: any;
  updateData: any = {};
  holdUser: any = {};
  loggedUser: any;
  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
              private authService: AuthService,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.authService.checkUser().subscribe(ret => {
      this.authService.findUser(ret.email).subscribe(rel => {
        this.loggedUser = rel.docs[0].data();
      });
    });
    this.holdUser = Object.assign(this.holdUser, this.data);
    this.authService.findUser(this.data.email).subscribe(res => {
      this.userDoc = res.docs[0];
    });
  }

  onCancel(): void {
    this.data = Object.assign(this.data, this.holdUser);
    this.dialogRef.close();
  }

  save(){
    this.updateData = Object.assign(this.updateData, this.data);
    if (this.data.admin.toString(10).toLowerCase() === 'administrator') {
      if (this.holdUser.admin !== 0) {
        if (this.loggedUser.admin === 0) {
          this.updateData.admin = 0;
        } else {
          this.notificationService.popup('You do not have the required permissions to perform this action.');
          return 0;
        }
      }
    } else {
      if (this.data.admin.toString(10).toLowerCase() === 'supervisor') {
        if (this.holdUser.admin !== 'Administrator') {
          this.updateData.admin = 1;
        } else {
          if (this.loggedUser.admin === 0) {
            this.updateData.admin = 1;
          } else {
            this.notificationService.popup('You do not have the required permissions to perform this action.');
            return 0;
          }
        }
      } else {
        if (this.data.admin.toString(10).toLowerCase() === 'user') {
          if (this.holdUser.admin !== 'Administrator') {
            this.updateData.admin = 2;
          } else {
            if (this.loggedUser.admin === 0) {
              this.updateData.admin = 2;
            } else {
              this.notificationService.popup('You do not have the required permissions to perform this action.');
              return 0;
            }
          }
        } else {
          this.notificationService.popup('Improper value for permissions. Should be \'administrator\', \'supervisor\', or \'user\'');
          return 0;
        }
      }
    }

    this.authService.updateUser(this.updateData, this.userDoc.id).then(res => {
      this.notificationService.popup('Successfully updated user');
      this.holdUser = Object.assign(this.holdUser, this.data);
      this.onCancel();
    }).catch(err => {
      this.notificationService.popup('Error updating user: ' + err);
    });
  }

}
