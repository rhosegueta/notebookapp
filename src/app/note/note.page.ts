import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  id: any;
  note_title: any;
  note_text: any;
  notebook_id: any;
  editForm: FormGroup;

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute,
    private toast: ToastController
  ) { 
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.db.getNote(this.id).then(res => {
      this.editForm.setValue({
        note_title: res['note_title'],
        note_text: res['note_text']
      });
      this.note_title = res['note_title']
      this.note_text = res['note_text']
      this.notebook_id = res['notebook_id']
    });
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      note_title: [''],
      note_text: ['']
    });
  }

  saveForm(){
    this.db.updateNote(this.id, this.editForm.value, this.notebook_id)
    .then((res) => {
      console.log(res)
      this.router.navigate(['/notebook/', this.notebook_id])
    })
  }

}
