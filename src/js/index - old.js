function playGame() {
  var leftOrderTopDesks = [[], [], [], []]
  var rightOrderTopDesks = [[], [], [], []]
  var unorderDesks = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]

  let onDragNumber = null,
    onDropNumber = null,
    onDragDeskNumber = null,
    onDropDeskNumber = null,    
    isTempDesk = false,
    isSuccessDesk = false,
    isGamePause = false,
    isTemp2Unorder = false

  //Spade>Heart>Diamond>Club
  function transformNumberToColor(cardNumber) {
    if(cardNumber > 0 && cardNumber <= 13) return 'S';
    if(cardNumber >= 14 && cardNumber <= 26) return 'H';
    if(cardNumber >= 27 && cardNumber <= 39) return 'D';
    if(cardNumber >= 40 && cardNumber <= 52) return 'C';
  }
  function transformNumber(cardNumber) {
    switch (cardNumber) {
      case 0:
        return '13'
      default:
        return cardNumber
    }
  }

  function shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  const cardsAry = Array.from(new Array(52)).map((_, index) => {   
    return index + 1;
  })

  const shuffleCard = shuffle(cardsAry);
  var i = 0;
  shuffleCard.forEach((number, cardIndex) => {
    if(i < 4 && unorderDesks[i].length>6){
      return;
    } else if (i >= 7){
      unorderDesks[i].push(number);      
      return i = 0;
    } else {
      if (unorderDesks[i].length>7)
        return;
    }
    unorderDesks[i].push(number);
    ++i;
  });
  

  const leftOrderTopDesksElem = document.getElementById('topleft');
  var leftOrderTopDeskElem;
  function flushLeftOrderTop() {
    leftOrderTopDesks.forEach((_, index) => {
      leftOrderTopDeskElem = document.createElement('div');
      leftOrderTopDeskElem.id = `card-temp-${index}`;
      leftOrderTopDeskElem.setAttribute("class", 'top-desk');
      leftOrderTopDeskElem.deskNumber = index;
      // console.log(leftOrderTopDesks);
      // console.log(leftOrderTopDeskElem);

      if (leftOrderTopDesks[index].length != 0) {
        console.log("lefttopshow")
        const card = leftOrderTopDesks[index];
        if (!isGamePause) {
          var tempCard = displayTempCard(card, leftOrderTopDeskElem);
          tempCard.draggable = true;
          console.log('lefttop')
        }
        tempCard.cardNumber = card;
      }
      leftOrderTopDesksElem.appendChild(leftOrderTopDeskElem);
        // orderCardElem.appendChild(orderCardContent);
    });
  }

  const rightOrderTopDesksElem = document.getElementById('topright');
  function flushRightOrderTop() {
    rightOrderTopDesks.forEach((desk, index) => {
      var rightOrderTopDeskElem = document.createElement('div');
      rightOrderTopDeskElem.id = `card-success-${index}`;
      rightOrderTopDeskElem.setAttribute('class', 'top-desk');
      rightOrderTopDeskElem.deskNumber = index;

      const card = rightOrderTopDesks[index];
      if (rightOrderTopDesks[index].length != 0) {        
        if (!isGamePause) {
          var successCard = displaySuccessCard(card, rightOrderTopDeskElem);
          successCard.draggable = true;
        }
        successCard.cardNumber = card;
      }
      rightOrderTopDesksElem.appendChild(rightOrderTopDeskElem);
    });
  }

  function displayTempCard (card, append) {
    var tempCard = document.createElement('img');
    tempCard.setAttribute('class', 'unorder-card')
    tempCard.setAttribute(
      'src', 
      `assets/images/cards_background/${transformNumberToColor(card)}${transformNumber(card%13)}.png`
    );
    append.appendChild(tempCard);
    return tempCard;
  }
  function displaySuccessCard (card, append) {
    var successCard = document.createElement('img');
    successCard.setAttribute('class', 'unorder-card')
    successCard.setAttribute(
      'src', 
      `assets/images/cards_background/${transformNumberToColor(card)}${transformNumber(card%13)}.png`
    );
    append.appendChild(successCard);
    return successCard;
  }

  let theInit = false;
  const unorderDesksElem = document.getElementById('unorder');
  function flushUnorderDesks () {
    unorderDesks.forEach((desk, index) => {
      const unorderDeskElem = document.createElement('div');
      unorderDeskElem.id = `unorderDesk-${index}`
      unorderDeskElem.setAttribute('class', 'unoder-desk');
      desk.forEach((card, cardIndex) => {
        const unorderCardElem = document.createElement('img');
        unorderCardElem.setAttribute('class', 'unorder-card')
        unorderCardElem.setAttribute(
          'src', 
          `assets/images/cards_background/${transformNumberToColor(card)}${transformNumber(card%13)}.png`
        );       

        unorderCardElem.draggable = false;
        if (!isGamePause && cardIndex+1 == desk.length) {
          unorderCardElem.draggable = true;
          for (var i = cardIndex; i>=0; i--) {
            const cardUpColor = Math.ceil(desk[i-1]/13);
            const cardDownColor = Math.ceil(desk[i]/13);
            const cardUpNumber = desk[i-1]
            const cardDownNumber = desk[i]
            //if下一個數字是這個數字+1(連續) deaggable = true
            if ((cardUpNumber%13) === (cardDownNumber%13+1) && (cardUpColor + cardDownColor !== 5) && (cardUpColor !== cardDownColor)) {
              console.log("multi-draggable" + cardUpNumber + cardDownNumber)
              unorderCardElem.draggable = true;
            }
          }
        }

        if (!theInit) {
          unorderCardElem.style.transition = 'all 0.5s';
          unorderCardElem.style.opacity = '0'
          setTimeout(() => {
            unorderCardElem.style.top = cardIndex * 35 + 'px';
            unorderCardElem.style.left = '0px';
            unorderCardElem.style.opacity = '1';
          }, cardIndex * index * 30);
        } else {
          unorderCardElem.style.top = cardIndex * 30 + 'px';
          unorderCardElem.style.left = '0px';
        }

        unorderCardElem.cardNumber = card;
        unorderCardElem.deskNumber = index;

        unorderDeskElem.appendChild(unorderCardElem);
        
        // console.log(cardNumber)
        // console.log(unorderCardElem.cardNumber)
      });
      
      

      unorderDesksElem.appendChild(unorderDeskElem);      
    });
    theInit = true;
  }

  

  //Drag&Drop
  function dragStart(e) {

  }
  function dragEnter(e) {
    
  }
  function dragLeave(e) {
    
  }
  function dragEnd(e) {
    
  }
  function dragOver(e) {
    e.preventDefault();
  }

  const container = document.getElementById('newcell');
  container.addEventListener('dragstart', dragStart);
  container.addEventListener('dragenter', dragEnter);
  container.addEventListener('dragleave', dragLeave);
  container.addEventListener('dragend', dragEnd);
  container.addEventListener('dragover', dragOver);
  // container.addEventListener('click', e => console.log(e.target));
  
  const restartElem = document.getElementById('restart');
  // restartElem.addEventListener('click', clearAll);
  
  function refresh() {
    leftOrderTopDesksElem.innerHTML = '';
    rightOrderTopDesksElem.innerHTML = '';
    unorderDesksElem.innerHTML = '';
    flushLeftOrderTop();
    flushRightOrderTop();
    flushUnorderDesks();
  }

  flushLeftOrderTop();
  flushRightOrderTop();
  flushUnorderDesks();
}
playGame();
