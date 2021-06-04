var turn = 0;
var turnKeptCount = 0;
var turnDice = [];
var turnScore = 0;
var turnSelectedDice = [];
var diceImages = ["roll1.png","roll2.png","roll3.png","roll4.png","roll5.png","roll6.png"];
var diceImagesSaved = ["roll1.png","roll2.png","roll3.png","roll4.png","roll5.png","roll6.png"];
function Die(top,left,id){
    this.top = top;
    this.left = left;
    this.isKept = false;
    this.id = id;
    this.isLocked = false;
    this.value = 0;
};
function Player(name,id,left,top,color,textColor){
    this.name = name;
    this.id = id;
    this.left = left;
    this.top = top;
    this.color = color;
    this.score = 0;
    this.textColor = textColor;
    this.divText = '<div id="'+this.id+'"'
        +'style="position:absolute; left:'+this.left+'px;top:'+this.top+'px;width:30%;height:20%;background-color:'+this.color
        +';text-align:center;font-weight:bold;font-size:60;color:'+this.textColor+';'
        +'><p style="margin:auto;">'+this.name+'<br>'+this.score+'</p></div>';
}

var players = [];
players.push(new Player('Player 1','p1',200,400,'red','white'));
players.push(new Player('Player 2','p2',800,400,'blue','white'));
players.push(new Player('Player 3','p3',200,600,'green','white'));
players.push(new Player('Player 4','p4',800,600,'purple','white'));
var activePlayer = players[0];

var dice = [];

for(var i = 0;i < 6; i++){
    dice.push(new Die(10,(i+1)*150 + 70,'die'+(i+1)));
}

function showDice(){
    for(let die of dice){
        let divText = '<div id="'+die.id+'" onclick="clickDie(\''+die.id+'\')" ondragstart="return false;" style="position:absolute;left:'+die.left+'px;top:'+die.top
            +'px;width:100px;height:100px;"></div>'
        document.getElementById('body').innerHTML += divText;
        console.log('die found - '+die.top+':'+die.left);
    }
}
function calculateScore(scoringDice,addToScore){
    let score = 0;
    let onesUsed = 0;
    let fivesUsed = 0;
    let diceLengths = [];
    let diceValues = [];
    let ones = [];
    let twos = [];
    let threes = [];
    let fours = [];
    let fives = [];
    let sixes = [];
    let allUsed = false;
    let pairCount = 0;
    let tripleCount = 0;
    diceValues.push(ones);
    diceValues.push(twos);
    diceValues.push(threes);
    diceValues.push(fours);
    diceValues.push(fives);
    diceValues.push(sixes);
    for(let die of scoringDice){
        diceValues[die.value - 1].push(die.value);
    }
    diceLengths.push(ones.length || 0);
    diceLengths.push(twos.length || 0);
    diceLengths.push(threes.length) || 0;
    diceLengths.push(fours.length || 0);
    diceLengths.push(fives.length || 0);
    diceLengths.push(sixes.length || 0);

    //basic logic for pairs, triplets, etc
    for(let i = 0; i < diceValues.length;i++){
        if (diceValues[i].length == 6){
            score = 3000;
            if(i==0){
                onesUsed = 6;
            }
            else if(i==4){
                fivesUsed = 6;
            }
        }
        else if (diceValues[i].length == 5){
            score = 2000;
            if(i==0){
                onesUsed = 5;
            }
            else if(i==4){
                fivesUsed = 5;
            }
        }
        else if (diceValues[i].length == 4){
            score = 1000;
            if(i==0){
                onesUsed = 4;
            }
            else if(i==4){
                fivesUsed = 4;
            }
        }
        else if (diceValues[i].length == 3){
            if(i==0){
                score = 300;
                onesUsed = 3;
            }
            else{
                score = (i+1) * 100;
            }
            if(i==4){
                fivesUsed = 3;
            }
        }
    }

    //straight
    if(
        ones.length == 1
        && twos.length == 1
        && threes.length == 1
        && fours.length == 1
        && fives.length == 1
        && sixes.length == 1
    ){
        score = 1500;
        allUsed = true;
    }

    //4 of a kind with pair
    if(diceLengths.indexOf(4)>-1 && diceLengths.indexOf(2)>-1){
        score = 1500;
        allUsed = true;
    }
    for(var i = 0; i < diceLengths.length;i++){
        if (diceLengths[i] == 2){
            pairCount++;
        }
        if (diceLengths[i] == 3){
            tripleCount++;
        }
    }
    //two triples
    if(tripleCount > 1){
        score = 2500;
        allUsed = true;
    }

    //three pair
    if(pairCount > 2){
        score = 1500;
        allUsed = true;
    }

    //add extra ones and 5s
    if(diceValues[0].length > onesUsed && !allUsed){
        score += 100 * (diceValues[0].length - onesUsed)
    }
    if(diceValues[4].length > fivesUsed && !allUsed){
        score += 50 * (diceValues[4].length - fivesUsed)
    }

    //add to player score only if indicated
    if(addToScore == true){
        turnScore += score;
    }

    //return the score for farkle validation
    return score;
}
function clickDie(id){
    console.log('Die Clicked');
    var activeDie = null;
    for(let die of dice){
        if(die.id == id){
            activeDie = die;
        }
    }
    console.log(activeDie.isKept)
    if(!activeDie.isLocked){
        switch(activeDie.isKept){
            case false:
                activeDie.isKept = true;
                turnKeptCount++;
                turnSelectedDice.push({
                    "id": activeDie.id,
                    "value":activeDie.value
                });
                document.getElementById(activeDie.id).style.opacity = '0.5';
                disableRoll(false);
                break;
            case true:
                activeDie.isKept = false;
                document.getElementById(activeDie.id).style.opacity = '1.0';
                for(var i = 0; i < turnSelectedDice.length; i++){
                    var obj = turnSelectedDice[i];
                    if(obj.id == activeDie.id){
                        turnSelectedDice.splice(i,1);
                    }
                }
                if(--turnKeptCount == 0){
                    disableRoll(true);
                }
                break;
        }
    }
}
function changeTurn(){
    for(let die of dice){
        die.isLocked = false;
        die.isKept = false;
        document.getElementById(die.id).style.opacity = '1.0';
    }

    calculateScore(turnSelectedDice,true);
    if(turnKeptCount > 0 && (turnScore + activePlayer.score > 499)){
        activePlayer.score += turnScore;
    }
    if(activePlayer.score > 9999){
        document.getElementById('body').style.backgroundColor = 'blue';
    }
    document.getElementById(activePlayer.id).innerHTML = activePlayer.name + '<br>' + activePlayer.score;
    document.getElementById(activePlayer.id).style.border = 'none';
    activePlayer = players[++turn%players.length];
    document.getElementById(activePlayer.id).style.border = '1px solid gold';
    turnKeptCount = 0;
    turnScore = 0;
    turnSelectedDice = [];
    rollDice();
}
function rollDice(){
    if(validateChoices(turnSelectedDice)){
        calculateScore(turnSelectedDice,true);
        validateAllScoring();
        turnDice = [];
        turnSelectedDice = [];
        let roll = 0;
        //let i = 0;
        for(let die of dice){
            if(die.isKept){
                die.isLocked = true;
            }
            else {
                roll = Math.floor(Math.random()*6) + 1;
                //console.log(++i%2);
                //roll = (++i%3)+1;
                document.getElementById(die.id).innerHTML = '<img src="'+diceImages[roll - 1]+'" width="100%"/>';
                turnDice.push({
                    "id":die.id,
                    "value": roll
                });
                die.value = roll;
            }
        }
        document.getElementById('currentScore').innerHTML = 'Round Score: ' + turnScore;
        turnKeptCount = 0;
        if(calculateScore(turnDice) == 0){
            alert('Farkle!');
            turnScore = 0;
            document.getElementById('currentScore').innerHTML = 'Round Score: ' + turnScore;
        }
        disableRoll(true);
    }
    else{
        alert('Invalid Dice Selection: All Dice Must Score');
    }
}
function validateChoices(choices){
    let diceLengths = [];
    let diceValues = [];
    let ones = [];
    let twos = [];
    let threes = [];
    let fours = [];
    let fives = [];
    let sixes = [];
    let needsVal = false;
    let passedVal = false;
    var pairCount = 0;
    diceValues.push(ones);
    diceValues.push(twos);
    diceValues.push(threes);
    diceValues.push(fours);
    diceValues.push(fives);
    diceValues.push(sixes);
    for(let die of choices){
        diceValues[die.value - 1].push(die.value);
    }
    diceLengths.push(ones.length || 0);
    diceLengths.push(twos.length || 0);
    diceLengths.push(threes.length) || 0;
    diceLengths.push(fours.length || 0);
    diceLengths.push(fives.length || 0);
    diceLengths.push(sixes.length || 0);

    if(
        twos.length < 3 && twos.length > 0 ||
        threes.length < 3 && threes.length > 0 ||
        fours.length < 3 && fours.length > 0 ||
        sixes.length < 3 && sixes.length > 0
    ){
        needsVal = true;
    }
    //4 of a kind with pair
    if(diceLengths.indexOf(4)>-1 && diceLengths.indexOf(2)>-1){
        passedVal = true;
        console.log('4 of a kind with pair passed');
    }
    for(var i = 0; i < diceLengths.length;i++){
        if (diceLengths[i] == 2){
            pairCount++;
        }
    }
    //three pair
    if(pairCount > 2){
        passedVal = true;
    }
    //straight
    if(
        ones.length == 1
        && twos.length == 1
        && threes.length == 1
        && fours.length == 1
        && fives.length == 1
        && sixes.length == 1
    ){
        passedVal = true;
    }

    return needsVal ? passedVal:true;
}
function validateAllScoring(){
    var keptCount = 0;
    for(let die of dice){
        if(die.isKept){
            keptCount++;
        }
    }
    if(keptCount == 6){
        for(let die of dice){
            die.isKept = false;
            die.isLocked = false;
            document.getElementById(die.id).style.opacity = '1.0';
        }
    }
}

function loadBoard(){
    showDice();
    document.getElementById('body').innerHTML += '<button id="roll" onclick="rollDice()">Roll Dice</button>';
    document.getElementById('body').innerHTML += '<br/><br/><button onclick="changeTurn()">Next Turn</button>';
    document.getElementById('body').innerHTML += '<div id="currentScore" style="position:absolute; left: 350; top:200; background-color:gray; width:50%; height:20%;'
    +'font-size:60px;">Round Score: 0</div>'
    for(let player of players){
        document.getElementById('body').innerHTML += player.divText;
    }
    document.getElementById('p1').style.border = '1px solid gold';
}
function disableRoll(canRoll){
    document.getElementById("roll").disabled = canRoll;
}