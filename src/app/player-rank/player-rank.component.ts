import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player.model';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort,MatSortModule,MatSortHeader } from '@angular/material/sort';
@Component({
  selector: 'app-player-rank',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './player-rank.component.html'
})
export class PlayerRankComponent implements OnInit {
  players: Player[] = [];
  playerDisplay: Player[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalCount = 100;
  constructor(private http: HttpClient) {}

  setPage(page: PageEvent){
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
    this.displayPlayers();
  }
  ngOnInit(): void {
    // this.http.get<Player[]>('http://localhost:4000/api/players')
    //   .subscribe({
    //     next: (data) => {
    //       // Sort by descending SORINErating
    //       this.players = data.sort((a, b) => b.SORINErating - a.SORINErating);
    //     },
    //     error: (err) => console.error('Failed to load players:', err)
    //   });
    this.displayPlayers();
  }
  
  displayPlayers(){
    this.http.get<Player[]>('http://localhost:4000/api/players')
      .subscribe({
        next: (data) => {
          // Sort by descending SORINErating
          this.players = data.sort((a, b) => b.SORINErating - a.SORINErating);
          this.totalCount = data.length;
          this.playerDisplay = this.players.slice(this.pageIndex*this.pageSize, this.pageIndex*this.pageSize+this.pageSize);
        },
        error: (err) => console.error('Failed to load players:', err)
      });
  }

  onSortChange(){
  }


  tableHeaders = ['Rank', 'Name','Position', 'Team', 'Score','Proj','AVG',]
  
}