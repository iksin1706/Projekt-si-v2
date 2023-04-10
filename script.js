class Board {
    hu = 'X';
    ai = 'O';
    currentPlayer = 'X';
    // player;

    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]

    scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    mozliwe_ruchy() {
        let moves = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (this.board[i][j] == '') {
                    moves.push({x: i, y: j})
              }
            }
        }
        return moves;
    }

    wykonaj_ruch(ruch, player) {
        this.board[ruch.x][ruch.y] = player;
    }

    wroc_do_rodzica(ruch) {
        this.board[ruch.x][ruch.y] = '';
    }
 
    czy_koniec_gry() {
        let winner = null;
        
        //sprawdzanie zwyciestw poziomo
        for (let i=0; i<3; i++){
          if (this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2] && this.board[i][0] != '') {
            winner = this.board[i][0];
          }
        }
      
        //sprawdzanie zwyciest pionowo
        for (let i = 0; i < 3; i++) {
          
          if (this.board[0][i] == this.board[1][i] && this.board[1][i] == this.board[2][i] && this.board[0][i] != '') {
            winner = this.board[0][i];
          }
        }
      
        //sprawdzanie zwyciest na skos
        if (this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2] && this.board[0][0] != '') {
          winner = this.board[0][0];
        }
        
        if (this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2] && this.board[2][0] != '') {
          winner = this.board[2][0];
        }
      
      
        //jesli nie ma zadnej wolnej komorki i nie zostal wyloniony zwyciezda to jest remis
        let openSpots = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (this.board[i][j] == '') {
              openSpots++;
            }
          }
        }
      
        if (winner == null && openSpots == 0) {
          return 'tie';
        } else {
          return winner;
        }
      }

    wynik() {
        return this.scores[this.czy_koniec_gry()];
    }

}

const squares = document.querySelectorAll('.square');
const switchStart = document.querySelector(".switchStart");
const start = document.querySelector(".start");
const turn = document.querySelector(".turn");
const stan_gry = new Board();
const hu = stan_gry.hu;
const ai = stan_gry.ai;
let currentPlayer = stan_gry.currentPlayer;
// currentPlayer = hu;
let board = stan_gry.board;
let scores = stan_gry.scores;
let temp = 0;

switchStart.addEventListener("click", switchStartFunc);

checkTurn();

function checkTurn(){
  if(currentPlayer = hu) {
    // console.log(currentPlayer);
    turn.innerText = "your turn";
  } else {
    // console.log(currentPlayer);
    turn.innerText = "Ai's turn";
  }
}

//nadanie kazdej komorce planszy funkcjonalnosci
squares.forEach(square => {
  square.addEventListener("click", boxClicked)
});

function switchStartFunc() {
    currentPlayer = ai;
    aiMove();
}

//funkcja ktora wywoluje sie po klikniecu komorki na board
function boxClicked(e) {
    //zczytanie koordynatow za pomoca id 
    //id jest zamienione na ciag znakow i ma postac np. "0 0" dla pierwsej komorki
    //i dzieki temu jestem w stanie odniesc sie do komorki w tablicy 2d "board"
    
    let idx = e.target.id[0];
    let idy = e.target.id[2];
    console.log(idx, idy);
    
    if(board[idx][idy] == ''){
      board[idx][idy] = hu;
    //   stan_drawXO(idx, idy);
        drawXO(idx, idy);
    //   let isWin = isWinner();
        let isWin = stan_gry.czy_koniec_gry();
      if(isWin==null) {
        currentPlayer = ai;
        aiMove();
      } 
    }
  }
  
  function drawXO(x, y){
    //jesli pojawi sie cos na planszy to znika przycisk "pozwol ai zaczac";
    if(temp == 0) {
        switchStart.classList.toggle("hide");
    }
    temp++;
  
    let out = stan_gry.czy_koniec_gry();
    if(out != null) {
      if(out == 'tie') {
        if(currentPlayer == hu) {
          document.getElementById(x+" "+y).innerText = 'X';
        } else {
          document.getElementById(x+" "+y).innerText = 'O';
        }
        turn.innerText = 'remis';
      } 
      else {
        if(currentPlayer == hu) {
          document.getElementById(x+" "+y).innerText = 'X';
        } else {
          document.getElementById(x+" "+y).innerText = 'O';
        }
        turn.innerText = "wygral: "+currentPlayer;
      }
    } else {
      if(currentPlayer == hu) {
        document.getElementById(x+" "+y).innerText = 'X';
      } else {
        document.getElementById(x+" "+y).innerText = 'O';
      }
    }
  }


    function aiMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
            board[i][j] = ai;
            let score = minimax(board, false);
            board[i][j] = '';
            if (score > bestScore) {
                bestScore = score;
                move = { i, j };
            }
            }
        }
        }
        console.log(board)
        board[move.i][move.j] = ai;
        drawXO(move.i, move.j);
        currentPlayer = hu;
    }


    //minimax ktory dziala ale funkcja wykonauj ruch musi przyjmowac 2 parametry

    function minimax(board, isMaximizing) {
        let results = new Array();
    
        if(stan_gry.czy_koniec_gry() != null) {
            return stan_gry.wynik();
        }

        if (isMaximizing) {

    //   let bestScore = -Infinity;
    //   for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       if (board[i][j] == '') {
    //         board[i][j] = ai;
    //         results.push(minimax(board, false))
    //         // console.log(results);
    //         board[i][j] = '';
    //       }
    //     }
    //   }
    //   bestScore = Math.max(...results);
    //   return bestScore;

        stan_gry.mozliwe_ruchy().forEach(ruch => {
            stan_gry.wykonaj_ruch(ruch, ai);
            results.push(minimax(board, false))
            stan_gry.wroc_do_rodzica(ruch);
        });
        return Math.max(...results);
        } else {

        // let bestScore = Infinity;
    //   for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       if (board[i][j] == '') {
    //         board[i][j] = hu;
    //         results.push(minimax(board, true))
    //         board[i][j] = '';
    //       }
    //     }
    //   }
          //   bestScore = Math.max(...results);
          //   return bestScore;


        stan_gry.mozliwe_ruchy().forEach(ruch => {
            stan_gry.wykonaj_ruch(ruch, hu);
            results.push(minimax(board, true))
            stan_gry.wroc_do_rodzica(ruch);
        });
        return Math.min(...results);
        }
    }

    //minimax ktory nie dziala

    // function minimax(board, isMaximizing) {
    //     if(stan_gry.czy_koniec_gry() != null) {
    //         return stan_gry.wynik();
    //     }

    //     let bestScore1 = -Infinity;
    //     let bestScore2 = Infinity;

    //     let wyniki = new Array();

    //     stan_gry.mozliwe_ruchy().forEach(ruch => {
    //         stan_gry.wykonaj_ruch(ruch, currentPlayer);
    //         wyniki.push(minimax(board, !isMaximizing))
    //         stan_gry.wroc_do_rodzica(ruch);
    //     });

    //     if(isMaximizing) {
    //         bestScore1 = Math.max(...wyniki);
    //         return bestScore1;
    //     } else {
    //         bestScore2 = Math.min(...wyniki);
    //         return bestScore2;
    //     }
        
    // }