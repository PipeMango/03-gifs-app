import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../components/interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

 public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private _apiKey: string = 'jXqUqJ7xwhbZKPN6sSbm1tgWPUaAIxwi';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';


  constructor(private http: HttpClient) {
    //this.loadLocalStorage();
   }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagHistory.includes(tag)){

      this._tagHistory = this._tagHistory.filter(t => t !== tag);

    }

    this._tagHistory = this._tagHistory.slice(0, 9);
    this.saveLocalStorage();


  }

  get tagHistory(): string[] {
    return [...this._tagHistory];
  }

  private saveLocalStorage():void{

    if (typeof window !== 'undefined') {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
     }
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;

    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
  }

  searchTag(tag: string):void{
    if(tag === '')  return;
    this.organizeHistory(tag);
    this._tagHistory.unshift(tag);

    const params = new HttpParams()
    .set('api_key', this._apiKey)
    .set('q', tag)
    .set('limit', '10')

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params: params})
    .subscribe(resp  => {
      this.gifList = resp.data;
      console.log(this.gifList);
    })
  }
}
