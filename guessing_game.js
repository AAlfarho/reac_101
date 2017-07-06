var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class App extends React.Component {
	render(){
  	return(
    	<Game />
    );
  };
}

class Game extends React.Component {
	//following is possible thanks to Babel JS
  //if not just add the method as a property, 
	//static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
    selectedNumbers : [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    redrawsLeft: 5,
    doneStatus: null
  });
  
  state = Game.initialState();
  resetGame = () => {
  	this.setState(Game.initialState());
  }
  selectNumber = (clickedNumber) => {
    if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0){ return;}
    if(this.state.usedNumbers.indexOf(clickedNumber) >= 0){ return;}
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
    }));
  };
  
  deselectNumber = (clickedNumber) => {
  	this.setState(prevState =>({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.
      filter(number => number !== clickedNumber)
    }));
  }
  
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumberOfStars ===
      prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers:[],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus)
  }
  
  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: 'Done. Nice!' };
      }
      if (prevState.redrawsLeft === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'Game Over!' };
      }
    });
  }
  
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1, 10).filter(number =>
    	usedNumbers.indexOf(number) === -1
    );
    
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  }
  
  redraw = () => {
  if(this.state.redrawsLeft === 0){ return ;}
  	this.setState(prevState => ({
    	selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
      redrawsLeft: prevState.redrawsLeft - 1,
    }), this.updateDoneStatus);
  }
	render(){
  	const {selectedNumbers, 
    randomNumberOfStars, 
    answerIsCorrect,
    usedNumbers, 
    redrawsLeft,
    doneStatus
    } = this.state
    return(
    	<div className="container">
      	<h3>Play Nine</h3>
        <hr/>
        <div className="row">
          <Stars randomNumberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers = {selectedNumbers}
          checkAnswer = {this.checkAnswer}
          answerIsCorrect = {answerIsCorrect}
          acceptAnswer={this.acceptAnswer}
          redraw = {this.redraw}
          redrawsLeft ={redrawsLeft} />
          <Answer selectedNumbers={selectedNumbers}
          				deselectNumber={this.deselectNumber}/>
        </div>
        <br/>
        {doneStatus ? 
        <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/> :
        <Numbers selectedNumbers={selectedNumbers} 
        	selectNumber={this.selectNumber}
          usedNumbers={usedNumbers}/>}
    		
      </div>
    );
  }
}
Game.randomNumber = () => 1 + Math.floor(Math.random()*9);

const Stars = (props) => {
	
  //One way of displaying stars or using low das
	//let stars = [];
	//for(let i=0; i < numberOfStars; i++){ one way of 
		//stars.push(<i key={i} className="fa fa-star"/>)
	//}
  //inside the div only set //{stars}
  

  	return(
    	<div className="col-5">
        {_.range(props.randomNumberOfStars).map( i =>
        	<i key={i} className="fa fa-star"/>
        )}
      </div>
    );
}

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect){
  	case true:
    button =       	
    				<button className="btn btn-success" onClick={props.acceptAnswer}>
            	<i className="fa fa-check"></i>
        		</button> ;
    break;
    case false:
        button =       	
    				<button className="btn btn-danger">
            	<i className="fa fa-times"></i>
        		</button> ;
    break;
    default:
    button = 
          	<button className="btn btn-primary" 
            disabled={props.selectedNumbers.length === 0}
            onClick={props.checkAnswer}>
        =
        </button> 
    break;
  }
  	return(
    	<div className="col-2 text-center">
      		{button}
          <br /><br />
          <button className="btn btn-warning btn-sm" 
          onClick={props.redraw}
          disabled={props.redrawsLeft === 0}>
          <i className="fa fa-refresh"></i>
          {props.redrawsLeft}
          </button>
      </div>
    );
}

const Answer = (props) => {
  	return(
    	<div className="col-5">
      	{props.selectedNumbers.map((number, i) =>
        		<span key={i}
            onClick={() => props.deselectNumber(number)}>
            {number}
            </span>
        )}
      </div>
    );
}

const Numbers = (props) => {
	//Because we dont 
  //const arrayOfNumbers = [1,2,3,4,5,6,7,8,9]
	//const arrayOfNumbers = _.range(1,10); //low dash library
  	const numberClassName = (number) => {
  	if(props.usedNumbers.indexOf(number) >= 0){
    	return 'used';
    }
		if(props.selectedNumbers.indexOf(number) >= 0){
    	return 'selected';
    }
  }
  	return(
    	<div className="card text-center">
        <div>
				{Numbers.list.map((number, i) =>
        	<span key={i} className={numberClassName(number)}
          onClick={() => props.selectNumber(number)}>
          {number}
          </span>
        )}
        </div>
      </div>
    );
}

const DoneFrame = (props) => {
	return(
  	<div className="text-center">
    	<h2>{props.doneStatus}</h2>
      <button className = "btn btn-secondary"
      onClick = {props.resetGame}>Play again</button>
    </div>
	);
}
Numbers.list = [1,2,3,4,5,6,7,8,9]

ReactDOM.render(<App />, mountNode);
