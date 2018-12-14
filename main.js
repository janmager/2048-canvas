var canvas = $("#canvas")[0];
var ctx = canvas.getContext('2d');

var sizeInput = $("#size");
var changeSize = $("#change-size");
var scoreLabel = $("#score");

var score = 0;
var bestScore = localStorage.getItem('score2048');
var size = 4;
var width = canvas.width / size - 6;

var cells = [];
var fontSize;
var loss = false;

changeSize.click(function(){
    if(sizeInput.val() >= 2 && sizeInput.val() <= 20){
        size = sizeInput.val();
        width = canvas.width / size - 6;
        canvasClear();
        startGame();
    }
})

function canvasClear(){
    ctx.clearRect(0,0,500,500);
}

startGame();
if(bestScore != null || bestScore != undefined) $("#bestScore").html("Best score: "+bestScore);
else $("#bestScore").html("Best score: 0");

function startGame(){
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function finishGame() {
    localStorage.setItem('score2048', this.score);
    canvas.style.opacity = '0.5';
    loss = true;
}

function cell(row, col){
    this.value = 0;
    this.x = col * width + 5 * (col+1);
    this.y = row * width + 5 * (row+1);
}

function createCells(){
   for(var i=0; i<size; i++){
      cells[i] = [];
      for(var j=0; j<size; j++){
          cells[i][j] = new cell(i,j);
      } 
   } 
}

function drawCell(cell){
   ctx.beginPath();
   ctx.rect(cell.x, cell.y, width, width);

   switch(cell.value){
       case 0 : ctx.fillStlye = "#FF0000"; break;
       case 2 : ctx.fillStyle = "#FF0033"; break;
       case 4 : ctx.fillStyle = "#FF00A6"; break;
       case 8 : ctx.fillStyle = "#DE00FF"; break;
       case 16 : ctx.fillStyle = "#6F00FF"; break;
       case 32 : ctx.fillStyle = "#003CFF"; break;
       case 64 : ctx.fillStyle = "#00EBFF"; break;
       case 128 : ctx.fillStyle = "#00FF8D"; break;
       case 254 : ctx.fillStyle = "#00FF22"; break;
       case 512 : ctx.fillStyle = "#7CFF00"; break;
       case 1024 : ctx.fillStyle = "#F7FF00"; break;
       case 2048 : ctx.fillStyle = "#FF7C00"; break;
       case 4096 : ctx.fillStyle = "#FF2F00"; break;
       default : ctx.fillStyle = "#FFFFFF"; 
   }

   ctx.fill();
   if(cell.value){
       fontSize = width/2;
       ctx.font = fontSize + "px Viga";
       ctx.fillStyle = "white";
       ctx.textAlign = "center";
      //  ctx.textBaseline = "middle";
       ctx.fillText(cell.value, cell.x+width/2, cell.y+width/1.5);
   }
}

function drawAllCells(){
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            drawCell(cells[i][j]);
        }
    }
}

function pasteNewCell(){
    var countFree = 0;
    var i, j;
    for(i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
        if(!cells[i][j].value) {
            countFree++;
        }
        }
    }
    if(!countFree) {
        finishGame();
        return;
    }
    while(true){
        var row = Math.floor(Math.random()*size);
        var col = Math.floor(Math.random()*size);
        if(!cells[row][col].value){
            cells[row][col].value = 2 * Math.ceil(Math.random()*2);
            drawAllCells();
            return;
        }
    }
}

$(document).keydown(function(event){
    if(!loss){
        if(event.keyCode == 38 || event.keyCode == 87) moveUp();
        else if(event.keyCode == 39 || event.keyCode == 68) moveRight();
        else if(event.keyCode == 40 || event.keyCode == 83) moveDown();
        else if(event.keyCode == 37 || event.keyCode == 65) moveLeft();
        scoreLabel.html("Score: "+score);
    }
});

function moveRight () {
    var i, j;
    var col;
    for(i = 0; i < size; i++) {
      for(j = size - 2; j >= 0; j--) {
        if(cells[i][j].value) {
          col = j;
          while (col + 1 < size) {
            if (!cells[i][col + 1].value) {
              cells[i][col + 1].value = cells[i][col].value;
              cells[i][col].value = 0;
              col++;
            } else if (cells[i][col].value == cells[i][col + 1].value) {
              cells[i][col + 1].value *= 2;
              score +=  cells[i][col + 1].value;
              cells[i][col].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveLeft() {
    var i, j;
    var col;
    for(i = 0; i < size; i++) {
      for(j = 1; j < size; j++) {
        if(cells[i][j].value) {
          col = j;
          while (col - 1 >= 0) {
            if (!cells[i][col - 1].value) {
              cells[i][col - 1].value = cells[i][col].value;
              cells[i][col].value = 0;
              col--;
            } else if (cells[i][col].value == cells[i][col - 1].value) {
              cells[i][col - 1].value *= 2;
              score +=   cells[i][col - 1].value;
              cells[i][col].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveUp() {
    var i, j, row;
    for(j = 0; j < size; j++) {
      for(i = 1; i < size; i++) {
        if(cells[i][j].value) {
          row = i;
          while (row > 0) {
            if(!cells[row - 1][j].value) {
              cells[row - 1][j].value = cells[row][j].value;
              cells[row][j].value = 0;
              row--;
            } else if (cells[row][j].value == cells[row - 1][j].value) {
              cells[row - 1][j].value *= 2;
              score +=  cells[row - 1][j].value;
              cells[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }
  
  function moveDown() {
    var i, j, row;
    for(j = 0; j < size; j++) {
      for(i = size - 2; i >= 0; i--) {
        if(cells[i][j].value) {
          row = i;
          while (row + 1 < size) {
            if (!cells[row + 1][j].value) {
              cells[row + 1][j].value = cells[row][j].value;
              cells[row][j].value = 0;
              row++;
            } else if (cells[row][j].value == cells[row + 1][j].value) {
              cells[row + 1][j].value *= 2;
              score +=  cells[row + 1][j].value;
              cells[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewCell();
  }