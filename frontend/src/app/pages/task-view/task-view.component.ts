import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  constructor(private TaskService: TaskService) { }

  ngOnInit() {
  }
  createNewList(title: string) {
    this.TaskService.createList('Testing').subscribe((response: any) =>{
      console.log(response);
    })
  }

}