import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'people-help';

  public hosRecords: any;
  public updateInfo: any;
  public closeResult: string | undefined;
  teamDetail: any = [];
  public id: string | undefined;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    public db: AngularFirestore
  ) {
    const doc = db.collection('/hospital_info');
    doc.get().subscribe((data) => {
      console.log(data);
      data.forEach((docData) => {
        // doc.data() is never undefined for query doc snapshots
        this.hosRecords = docData.data();
        console.log(docData.id);
        this.id = docData.id;
        console.log(this.hosRecords);
      });
    });
  }

  open(content: any, data: any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
    });
    this.teamDetail = data;
  }
  edit(record: any, content: any) {
    this.modalService
      .open(content, {
        centered: true,
        backdrop: 'static',
      })
      .result.then((data: any) => {
        // let selectedDoc = this.db.collection('/hospital_info', (ref) =>
        //   ref.where('id', '==', this.id)
        // );
        var washingtonRef = this.db.collection('hospital_info').doc(this.id);
        washingtonRef
          .set({
            hostpitalInfo: firebase.default.firestore.FieldValue.arrayUnion(
              data
            ),
          })
          .then((result) => {
            console.log(result);
          });
        // selectedDoc.snapshotChanges().subscribe((res: any) => {
        //   let id = res[0].payload.doc.id;
        //   console.log(id);
        //   // this.db
        //   //   .collection('hospital_info')
        //   //   .doc(id)
        //   //   .update({ hostpitalInfo: data });
        // });
        // selectedDoc.snapshotChanges().pipe(
        //   map((actions) =>
        //     actions.map((a) => {
        //       const data = a.payload.doc.data();
        //       console.log(data);
        //       const id = a.payload.doc.id;
        //       // return { id, ...data };
        //     })
        //   )
        // );
        const index = this.hosRecords.hostpitalInfo.findIndex(
          (item: any) => item.id === data.id
        );
        this.db.collection('/hospital_info').doc('id').update(data);
        this.hosRecords.hostpitalInfo[index] = data;
      });
    this.updateInfo = { ...record };
  }
}
