import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-player-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-rank.component.html'
})
export class PlayerRankComponent implements OnInit {
  players: Player[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Player[]>('http://localhost:4000/api/players')
      .subscribe({
        next: (data) => {
          // Sort by descending SORINErating
          this.players = data.sort((a, b) => b.SORINErating - a.SORINErating);
        },
        error: (err) => console.error('Failed to load players:', err)
      });
  }
  
}