import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';

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

  createTask(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  getTasks(listId:string){
    return this.webReqService.get(`lists/${listId}/tasks`);
  }
  complete(task: Task){
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, { completed: !task.completed});
  }
}
