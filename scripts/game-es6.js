// logic for the Count game

//console.log("Let´s the game begins...");

class NumberedBox extends createjs.Container {
  constructor(game, number = 0) { // the parameter is the number to display in the box
    super(); // call the 'super' to initialize the createjs Container logic

    this.game = game;  //each NumberedBox can communicate with its parent object
    this.number = number;

    var movieclip = new lib.NumberedBox(); // instance of the NumberedBox graphics
    movieclip.numberText.text = number;

    movieclip.numberText.font = "28px Oswald";
    movieclip.numberText.textBaseLine = "alphabet";
    movieclip.numberText.x += 2;
    movieclip.numberText.y = 0;

    new createjs.ButtonHelper(movieclip, 0, 1, 2, false, new lib.NumberedBox(), 3);

    this.addChild(movieclip);

    // this sets bounds 7x7
    this.setBounds(0,0,50,50);

    // handle click event
    this.on('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.game.handleClick(this);
    createjs.Sound.play("Jump");
  }
}

// this class controls the game data
class GameData {
  constructor() {
    this.amountOfBox = 3 ;
    this.resetData();
  }

  resetData(){
    this.currentNumber = 1;
  }
  nextNumber() {
    this.currentNumber += 1;
  }
  isRightNumber(number) {
    return (number === this.currentNumber);
  }
  isGameWin(){
    return (this.currentNumber > this.amountOfBox);
  }
}

class Game{
  constructor() {
    console.log(`Welcome to the game... Version ${this.version()}`);

    this.loadSound();

    this.canvas = document.getElementById("game-canvas");
    this.stage = new createjs.Stage(this.canvas);

    this.stage.height = this.canvas.height;
    this.stage.width = this.canvas.width;

    this.stage.enableMouseOver();

    // enable tap on touch device
    createjs.Touch.enable(this.stage); // pass the stage reference

    // enable retina screen
    this.retinalize();

    createjs.Ticker.setFPS(60);

    // game related initialization
    this.gameData = new GameData();

    // keep re-drawing the stage.
    createjs.Ticker.on("tick", this.stage);

    // background
    //this.stage.addChild(new lib.Background());<-- moved to 'restartGame'

    // testing code
    /*var circle = new createjs.Shape();
    circle.graphics.beginFill("gold").drawCircle(0, 0, 40);
    circle.x = circle.y = 100;
    this.stage.addChild(circle)
    */
    //this.stage.addChild(new NumberedBox(88));
    //this.generateMultipleBoxes(this.gameData.amountOfBox); <-- moved to 'restartGame'
    this.restartGame();
  }
  version(){
    return '1.0.0';
  }
  loadSound(){
    createjs.Sound.registerSound("soundfx/jump7.aiff", "Jump");
    createjs.Sound.registerSound("soundfx/game-over.aiff", "Game-Over");
    createjs.Sound.alternateExtensions = ["ogg", "wav"]
  }
  restartGame() {
    this.gameData.resetData();
    this.stage.removeAllChildren();
    //
    this.stage.addChild(new lib.Background());
    this.generateMultipleBoxes(this.gameData.amountOfBox);
  }
  generateMultipleBoxes(amount=10) {
    for (var i=amount; i>0; i--){
      var movieclip = new NumberedBox(this, i);
      this.stage.addChild(movieclip);

      // random position
      movieclip.x = Math.random() * (this.stage.width - movieclip.getBounds().width);
      movieclip.y = Math.random() * (this.stage.height- movieclip.getBounds().height);
    }
  }
  handleClick(numberedBox) {
    if(this.gameData.isRightNumber(numberedBox.number)){
      this.stage.removeChild(numberedBox);
      this.gameData.nextNumber();

      // is game over?
      if (this.gameData.isGameWin()) {
        createjs.Sound.play("Game-Over");

        var gameOverView = new lib.GameOverView();
        this.stage.addChild(gameOverView);

        gameOverView.restartButton.on('click', (function(){
          createjs.Sound.play("Jump");
          this.restartGame();
        }).bind(this)); //  bind to point to the game class
      }
    }

  }
  retinalize(){
    this.stage.width = this.canvas.width;
    this.stage.heigth = this.canvas.height;

    let ratio = window.devicePixelRatio;
    if(ratio === undefined) {
      return;
    }

    this.canvas.setAttribute('width', Math.round( this.stage.width * ratio ));
    this.canvas.setAttribute('height', Math.round( this.stage.height * ratio ));

    this.stage.scaleX = this.stage.scaleY = ratio;

    // set CSS style
    this.canvas.style.width = this.stage.width + "px";
    this.canvas.style.height = this.stage.height + "px";
  }
}

// start the game
var game = new Game();
