import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Notebook } from './notebook';
import { Note } from './note';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private storage: SQLiteObject;
  notebookList = new BehaviorSubject([]);
  noteList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter
  ) { 
    this.platform.ready().then(() => {
      this.init();
    });
  }

  init(){
    return this.sqlite.create(
      {
        name:'notebookappdb.db',
        location: 'default'
      }
    ).then((db: SQLiteObject) => {
      this.storage = db;
      this.storage.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='notebooktable';", [])
      .then(res => {
        if(res.rows.length > 0){
          this.getNotebooks();
          this.isDbReady.next(true);
        }else{
          this.getFakeData();
        }
      })
      .catch(err => {
        this.getFakeData();
      });
    });
  }

  dbState(){
    return this.isDbReady.asObservable();
  }

  fetchNotebooks(): Observable<Notebook[]>{
    return this.notebookList.asObservable();
  }

  fetchNotes(): Observable<Note[]>{
    return this.noteList.asObservable();
  }

  getFakeData(){
    this.httpClient.get(
      'assets/dump.sql', {responseType:'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
      .then(_ => {
        this.getNotebooks();
        this.isDbReady.next(true);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  getNotebooks(){
    return this.storage.executeSql('SELECT * FROM notebooktable', [])
    .then(res => {
      let items: Notebook[] = [];
      if(res.rows.length > 0){
        for(var i = 0; i < res.rows.length; i++){
          items.push(
            {
              id: res.rows.item(i).id,
              notebook_title: res.rows.item(i).notebook_title
            }
          );
        }
      }
      this.notebookList.next(items);
    });
  }

  getNotes(id){
    return this.storage.executeSql('SELECT * FROM notetable WHERE notebook_id=?', [id])
    .then(res => {
      let items: Note[] = [];
      if(res.rows.length > 0){
        for(var i = 0; i < res.rows.length; i++){
          items.push(
            {
              id: res.rows.item(i).id,
              note_title: res.rows.item(i).note_title,
              note_text: res.rows.item(i).note_text,
              notebook_id: res.rows.item(i).notebook_id
            }
          );
        }
      }
      this.noteList.next(items);
    });
  }

  addNotebook(notebook_title){
    let data = [notebook_title];
    return this.storage.executeSql(
      'INSERT INTO notebooktable(notebook_title) VALUES (?)', data
    ).then(res => {
      this.getNotebooks();
    });
  }

  addNote(note_title, note_text, notebook_id){
    let data = [note_title, note_text, notebook_id];
    return this.storage.executeSql(
      'INSERT INTO notetable(note_title, note_text, notebook_id) VALUES (?, ?, ?)', data
    ).then(res => {
      this.getNotes(notebook_id);
    });
  }

  updateNotebook(id, notebook:Notebook){
    return this.storage.executeSql(
      `UPDATE notebooktable SET notebook_title=? WHERE id=${id}`,
      [notebook.notebook_title]
    ).then(data => {
      this.getNotebooks();
    });
  }

  updateNote(id, note:Note){
    return this.storage.executeSql(
      `UPDATE notetable SET note_title=?, note_text=?, notebook_id=? WHERE id=${id}`,
      [note.note_title, note.note_text, note.notebook_id]
    ).then(data => {
      this.getNotes(note.notebook_id);
    });
  }

  deleteNotebook(id){
    return this.storage.executeSql('DELETE FROM notebooktable WHERE id=?', [id])
    .then(_ => {
      this.getNotebooks();
    });
  }

  deleteNote(id, notebook_id){
    return this.storage.executeSql('DELETE FROM notetable WHERE id=?', [id])
    .then(_=>{
      this.getNotes(notebook_id);
    });
  }

  getNotebook(id): Promise<Notebook>{
    return this.storage.executeSql('SELECT * FROM notebooktable WHERE id=?', [id])
    .then(res=>{
      return{
        id: res.rows.item(0).id,
        notebook_title: res.rows.item(0).notebook_title
      }
    });
  }

  getNote(id): Promise<Note>{
    return this.storage.executeSql('SELECT * FROM notetable WHERE id=?', [id])
    .then(res=>{
      return{
        id: res.rows.item(0).id,
        note_title: res.rows.item(0).note_title,
        note_text: res.rows.item(0).note_text,
        notebook_id: res.rows.item(0).notebook_id
      }
    });
  }

  getNoteByNotebookId(id): Promise<Note[]>{
    return this.storage.executeSql('SELECT * FROM notetable WHERE notebook_id=?', [id])
    .then(res=>{
      let items: Note[] = [];
      if(res.rows.length > 0){
        for(var i = 0; i < res.rows.length; i++){
          items.push(
            {
              id: res.rows.item(i).id,
              note_title: res.rows.item(i).note_title,
              note_text: res.rows.item(i).note_text,
              notebook_id: res.rows.item(i).notebook_id
            }
          );
        }
      }
      return items;
    });
  }

}
