import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  creationSubject: BehaviorSubject<number> = new BehaviorSubject(8);

  constructor() { }

}
