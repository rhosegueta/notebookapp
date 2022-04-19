import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from '../services/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {ThemeService} from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  mainForm: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Data: any[] = [];

  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private theme: ThemeService
  ) {}

  enableDark(){
    this.theme.enableDark();
  }
  enableLight(){
    this.theme.enableLight();
  }

  ngOnInit(){
    this.db.dbState().subscribe(
      async (res) => {
        if(res){
          this.db.fetchNotebooks().subscribe(async item => {
            this.Data = item;
            const toast = await this.toast.create({
              message: 'notebook table loaded',
              duration: 2500
            });
            toast.present();
          });
        }else{
          const toast = await this.toast.create({
            message: 'Res is empty',
            duration: 2500
          });
          toast.present();
        }
      }
    );
    this.mainForm = this.formBuilder.group({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      notebook_title:['']
    });
  }

  storeData(){
    this.db.dbState().subscribe(async res=> {
      const toast = await this.toast.create({
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
    this.db.addNotebook(
      this.mainForm.value.notebook_title
    ).then((res) => {
      this.mainForm.reset();
    }).catch(async error => {
      const toast = await this.toast.create({
        message: `error: ${error}`,
        duration: 2500
      });
      toast.present();
    });
  }

  deleteNotebook(id){
    this.db.deleteNotebook(id).then(async(res)=>{
      const toast = await this.toast.create({
        message: 'Notebook deleted',
        duration: 2500
      });
      toast.present();
    });
  }

}
