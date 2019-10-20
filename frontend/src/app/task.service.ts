import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: string) {
    return this.webReqService.post('lists', { title });
  }

  getLists(){
    return this.webReqService.get('lists');
  }

  getTasks(listId:string){
    return this.webReqService.get(`lists/${listId}/tasks`);
  }
}
