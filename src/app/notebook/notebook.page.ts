import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})
export class NotebookPage implements OnInit {

  id: any;
  editForm: FormGroup;
  mainForm: FormGroup;
  noteList: any[] = [];

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private toast: ToastController
  ) { 
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.db.getNotebook(this.id).then(res => {
      this.editForm.setValue({
        notebook_title: res['notebook_title']
      });
    });
    this.db.getNoteByNotebookId(this.id).then(res => {
      this.noteList = res;
    })
  }

  ngOnInit() {
    this.db.dbState().subscribe(
      async (res) => {
        if(res){
          this.db.fetchNotes().subscribe(async item => {
            this.noteList = item;
            let toast = await this.toast.create({
              message: 'note table loaded',
              duration: 2500
            });
            toast.present();
          })
        }else{
          let toast = await this.toast.create({
            message: 'Res is empty',
            duration: 2500
          });
          toast.present();
        }
      }
    );
    this.editForm = this.formBuilder.group({
      notebook_title: ['']
    });
    this.mainForm = this.formBuilder.group({
      note_title:[''],
      note_text:['']
    });
  }

  saveForm(){
    this.db.updateNotebook(this.id, this.editForm.value)
    .then((res) => {
      console.log(res)
      this.router.navigate(['/home']);
    })
  }

  storeData(){
    this.db.dbState().subscribe(async res=> {
      let toast = await this.toast.create({
        message: `DB state: ${res}`,
        duration: 2500
      });
      toast.present();
      if(res){}
      else{
        this.db.init().then(res => {

        }).catch(async error => {
          let toast = await this.toast.create({
            message: `error: ${error}`,
            duration: 2500
          });
          toast.present();
        });
      }
    });
    this.db.addNote(
      this.mainForm.value.note_title,
      this.mainForm.value.note_text,
      this.id
    ).then((res) => {
      this.mainForm.reset();
    }).catch(async error => {
      let toast = await this.toast.create({
        message: `error: ${error}`,
        duration: 2500
      });
      toast.present();
    });
  }

  deleteNote(id){
    this.db.deleteNote(id, this.id).then(async(res)=>{
      let toast = await this.toast.create({
        message: 'Note deleted',
        duration: 2500
      });
      toast.present();
    });
  }

}
