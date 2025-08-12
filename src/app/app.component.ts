import { Component} from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { PlayerRankComponent } from './player-rank/player-rank.component';
import { TradeCalculatorComponent } from './trade-calculator/trade-calculator.component';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent, PlayerRankComponent, TradeCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  displayChoice = 'rank';
  title = 'fantasy-football-app';
  setChoice(choice:string){
    this.displayChoice = choice;
  }
}
