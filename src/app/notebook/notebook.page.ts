import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})
export class NotebookPage implements OnInit {

  id: any;
  title: string;
  noteList: any[] = [];

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute
  ) { 
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.db.getNotebook(this.id).then(res => {
      this.title = res['notebook_title']
    })
    this.db.getNotesByNotebookId(this.id).then(res => {
      this.noteList = res;
    })
  }

  ngOnInit() {
  }

}
