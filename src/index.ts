import "../style/style.css";
import { Game } from "./control/Game";
import { GameField } from "./model/GameField";
import { GameWiew } from "./view/GameView";

new Game(new GameField(10, 10), new GameWiew(document.body));
