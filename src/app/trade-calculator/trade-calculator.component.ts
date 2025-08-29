import { Component, WritableSignal, signal,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player.model';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-trade-calculator',
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './trade-calculator.component.html',
  styleUrl: './trade-calculator.component.scss'
})
export class TradeCalculatorComponent implements OnInit{
  constructor(private http: HttpClient) {}
  players: Player[] = [];
  ngOnInit(): void {
    this.http.get<Player[]>('http://localhost:4000/api/players')
      .subscribe({
        next: (data) => {
          this.players = data;
        },
        error: (err) => console.error('Failed to load players:', err)
      });
  }

  // displayPlayers = signal(this.players.filter((player)=>{
  //   if(player.name.includes(this.playerInputs.controls.p5B.value!)){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }));

  // test(){
  //   console.log(this.playerInputs.controls.p2A.value!);
  //   console.log(this.displayPlayers());
  // }

  p1AFilter: WritableSignal<string> = signal('Justin Jefferson');
  p2AFilter: WritableSignal<string> = signal('');
  p3AFilter: WritableSignal<string> = signal('');
  p4AFilter: WritableSignal<string> = signal('');
  p5AFilter: WritableSignal<string> = signal('');

  p1BFilter: WritableSignal<string> = signal('');
  p2BFilter: WritableSignal<string> = signal('');
  p3BFilter: WritableSignal<string> = signal('');
  p4BFilter: WritableSignal<string> = signal('');
  p5BFilter: WritableSignal<string> = signal('');

  
  // playerInputs = new FormGroup({
  //   p1A: new FormControl<Player | null>(null),
  //   p2A: new FormControl<string>(" "),
  //   p3A: new FormControl<string>(" "),
  //   p4A: new FormControl<Player | null>(null),
  //   p5A: new FormControl<Player | null>(null),
  //   p1B: new FormControl<Player | null>(null),
  //   p2B: new FormControl<Player | null>(null),
  //   p3B: new FormControl<Player | null>(null),
  //   p4B: new FormControl<Player | null>(null),
  //   p5B: new FormControl<Player | null>(null),
  // })
  playerInputs = new FormGroup({
    teamA: new FormArray(
      [
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      ]),
    teamB: new FormArray(
      [
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      new FormControl<Player | null>(null),
      ])

    // p1B: new FormControl<Player | null>(null),
    // p2B: new FormControl<Player | null>(null),
    // p3B: new FormControl<Player | null>(null),
    // p4B: new FormControl<Player | null>(null),
    // p5B: new FormControl<Player | null>(null),
  })

  aScore = 0;
  bScore = 0;
  calculateTrade(){
    const teamA = [];
    const teamB = [];
    this.aScore = 0;
    this.bScore = 0;
    for(let i=0; i<5; i++){
      if(this.playerInputs.controls.teamA.at(i).value?.SORINErating != undefined){
        teamA.push(this.playerInputs.controls.teamA.at(i).value?.SORINErating);
        this.aScore += teamA.at(i)!;
      }
      if(this.playerInputs.controls.teamB.at(i).value?.SORINErating != undefined){
        teamB.push(this.playerInputs.controls.teamB.at(i).value?.SORINErating);
        this.bScore += teamB.at(i)!;
      }
    }

    while(teamA.length < teamB.length){
      teamA.push(75);
      this.aScore += 75;
    }
    while(teamB.length < teamA.length){
      teamB.push(75);
      this.bScore += 75;
    }
    console.log(teamA);
    console.log(this.aScore/teamA.length);
    console.log(this.bScore/teamB.length);
  }

}
