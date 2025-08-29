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
  templateUrl: './player-rank.component.html',
  styleUrl: './player-rank.component.scss'
})
export class PlayerRankComponent implements OnInit {
  players: Player[] = [];
  playerDisplay: Player[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalCount = 100;
  position = '';
  sortCategory = 'sorine';
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
          //this.players = data.sort((a, b) => b.SORINErating - a.SORINErating);
          this.players = this.sortData(data,this.sortCategory);
          this.filterBy(this.position);
          this.totalCount = this.players.length;
          this.playerDisplay = this.players.slice(this.pageIndex*this.pageSize, this.pageIndex*this.pageSize+this.pageSize);
        },
        error: (err) => console.error('Failed to load players:', err)
      });
  }

  sortData(players: Player[], category: string){
    if(category=='sorine'){
      players.sort((a, b) => b.SORINErating - a.SORINErating);
    }else if(category=='ADP'){
      players.sort((a, b) => a.adp - b.adp);
    }else if(category=='projection'){
      players.sort((a, b) => b.projection - a.projection);
    }else if(category=='AVG'){
      players.sort((a, b) => b.avgPoints - a.avgPoints);
    }
    return players;
  }

  setSortCategory(category: string){
    this.sortCategory = category;
    this.displayPlayers();
  }

  setPosition(position: string){
    this.position = position;
    this.pageIndex = 0;
    this.pageSize = 10;
    this.displayPlayers();
  }

  filterBy(position: string){
    if(position=='FLEX'){
      this.players = this.players.filter((player)=>{
        if(player.position == 'RB' || player.position == 'WR' || player.position == 'TE'){
          return true;
        }else{
          return false;
        }
      });
    }else if(position != ''){
      this.players = this.players.filter((player)=>{
        if(player.position == position){
          return true;
        }else{
          return false;
        }
      
    });
    }
  }

  onSortChange(){
  }


  tableHeaders = ['Rank', 'Name', 'ADP', 'Position', 'Team', 'Score','Proj','AVG',]
  
}