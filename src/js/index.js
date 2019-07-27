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
    isTemp2Unorder = false,
    isTemp2Temp = false

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

      if (leftOrderTopDesks[index].length != 0) {
        const card = leftOrderTopDesks[index];
        if (!isGamePause) {
          var tempCard = displayTempCard(card, index, leftOrderTopDeskElem);
          tempCard.draggable = true;
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
      rightOrderTopDeskElem.setAttribute('class', 'top-right-desk d-flex justify-content-center align-items-center');
      // var rightOrderTopDeskImg = document.createElement('img');
      // rightOrderTopDeskImg.setAttribute(
      //   'src', 
      //   `assets/images/${index}.png`
      // );
      // rightOrderTopDeskElem.appendChild(rightOrderTopDeskImg);

      rightOrderTopDeskElem.deskNumber = index;

      const card = rightOrderTopDesks[index];
      var noCard = false;
      if (rightOrderTopDesks[index].length != 0) {
        if (!isGamePause) {          
          var successCard = displaySuccessCard(noCard, card, rightOrderTopDeskElem);
          successCard.draggable = true;
        }
        successCard.cardNumber = card;
      } else {
        noCard = true;
        var successCard = displaySuccessCard(noCard, index, rightOrderTopDeskElem);
      }
      rightOrderTopDesksElem.appendChild(rightOrderTopDeskElem);
    });
  }

  function displayTempCard (card, cardIndex, append) {
    var tempCard = document.createElement('img');
    tempCard.id = "tempCard"
    tempCard.deskNumber = cardIndex;
    tempCard.setAttribute('class', 'unorder-card')
    tempCard.setAttribute(
      'src', 
      `assets/images/cards_background/${transformNumberToColor(card)}${transformNumber(card%13)}.png`
    );
    append.appendChild(tempCard);
    return tempCard;
  }
  function displaySuccessCard (noCard, card, append) {
    var successCard = document.createElement('img');    
    if (noCard) {
      successCard.setAttribute(
        'src', 
        `assets/images/${card}.png`
      );
    } else {
      successCard.setAttribute('class', 'unorder-card')
      successCard.setAttribute(
        'src', 
        `assets/images/cards_background/${transformNumberToColor(card)}${transformNumber(card%13)}.png`
      );
    }
    
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
        unorderCardElem.id = `unorderCard-${cardIndex}`
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
              // unorderCardElem.draggable = true;
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
    e.defaultPrevented;
    console.log(e)
    onDragDeskNumber = e.target.deskNumber;
    onDragNumber = e.target.cardNumber;
    console.log("onDragDeskNumber"+onDragDeskNumber);
    console.log(onDragNumber);
    // if(onDragNumber === unorderDesks[onDragDeskNumber].slice(-1, 0))
    //   e.taret.style.backgroundColor = 'red'
  }
  function dragEnter(e) {
    e.defaultPrevented;
    console.log("enter.id" + e.target.id)
    console.log(e.target.id.indexOf('tempCard'))
    if (e.target.id.indexOf('tempCard') === 0) isTemp2Unorder = true;
    console.log("isTemp2Unorder"+isTemp2Unorder)

    if (e.target.id.indexOf('topleft') > -1) isTempDesk = true; // 2temp
    if (e.target.id.indexOf('topright') > -1) isSuccessDesk = true; // 2success
    // if (e.target.id.indexOf('topleft') > -1) isTemp2Temp = true;    
    // if (e.target.id === 'unorder') return;
    if (e.target.cardNumber === undefined) return;
    onDropNumber = e.target.cardNumber;    
    if (onDragNumber === onDropNumber) return;

    // if(!isTempDesk && !isSuccessDesk && e.target.draggable === true){
    //   console.log("over")
    //   onDropDeskNumber = e.target.deskNumber;
    // } else {
    //   return;
    // }
  }
  function dragOver(e) {
    e.preventDefault();
    if (!isTempDesk && !isSuccessDesk) {
      onDropDeskNumber = e.target.deskNumber;
      // console.log("unorder:" + onDropDeskNumber)
    }
    //left
    if (isTempDesk) {
      switch (e.target.id) {
        case 'card-temp-0':
        case 'card-temp-1':
        case 'card-temp-2':
        case 'card-temp-3':
          onDropDeskNumber = e.target.deskNumber;
          console.log("temp:" + onDropDeskNumber)
      }
    }
    //right
    if (isSuccessDesk) {
      switch (e.target.id) {
        case 'card-success-0':
        case 'card-success-1':
        case 'card-success-2':
        case 'card-success-3':
          onDropDeskNumber = e.target.deskNumber;
          // console.log("success:" + onDropDeskNumber)
      }
    }
  }
  function dragLeave(e) {
    if (e.target.id.indexOf('newcell') !== -1) {
      isTempDesk = false;
      isSuccessDesk = false;
    }
    if(e.target.id.indexOf('topleft') !== -1) {
      isTempDesk = true;
      isSuccessDesk = false;
    }
    if(e.target.id.indexOf('topright') !== -1) {
      isTempDesk = false;
      isSuccessDesk = true;
    }
    console.log(isTempDesk, isSuccessDesk, isTemp2Unorder)
  }
  function dragEnd(e) {
    const dragCardColor = Math.ceil(onDragNumber/13);
    const dropCardcolor = Math.ceil(onDropNumber/13);
    if (isTempDesk) {
      console.log(123)
      unorderDesks[onDragDeskNumber].pop();
      leftOrderTopDesks[onDropDeskNumber] = onDragNumber;
      console.log(leftOrderTopDesks);
      isTempDesk = false;
      refresh();
    }
    if (isSuccessDesk) {
      console.log(456)
      console.log(rightOrderTopDesks)
      console.log(onDragNumber)
      console.log("rightOrderTopDesks"+rightOrderTopDesks[0])
      const validFirstSuccessCard = 
        rightOrderTopDesks[0].length === 0 && onDropDeskNumber === 0 && onDragNumber === 1 || 
        rightOrderTopDesks[1].length === 0 && onDropDeskNumber === 1 && onDragNumber === 14 ||
        rightOrderTopDesks[2].length === 0 && onDropDeskNumber === 2 && onDragNumber === 27 ||
        rightOrderTopDesks[3].length === 0 && onDropDeskNumber === 3 && onDragNumber === 40
      if (validFirstSuccessCard) {
        console.log(123456)
        unorderDesks[onDragDeskNumber].pop();
        rightOrderTopDesks[onDropDeskNumber] = onDragNumber;
        isSuccessDesk = false;
        refresh();
      } else {
        console.log(789456)
        const validSuccessDeskCardPush = 
            dragCardColor === dropCardcolor &&
            (onDragNumber % 13 === (onDropNumber % 13)+1 ||
              (onDragNumber % 13 === 0 && onDropNumber % 13 === 12));
        if (validSuccessDeskCardPush) {
          unorderDesks[onDragDeskNumber].pop();
          console.log("add"+onDropDeskNumber)
          rightOrderTopDesks[onDropDeskNumber] = onDragNumber;
          isSuccessDesk = false;
          refresh();
        }
      }      
    }


    const validUnorderDeskCardPush = 
      dragCardColor !== dropCardcolor &&
      dragCardColor + dropCardcolor !== 5 &&
      (onDropNumber % 13 === (onDragNumber % 13)+1 ||
        (onDropNumber % 13 === 0 && onDragNumber % 13 === 12));
    if (validUnorderDeskCardPush) {
      if (isTemp2Unorder) {
        leftOrderTopDesks[onDragDeskNumber] = [];
        unorderDesks[onDropDeskNumber].push(onDragNumber);
        isTemp2Unorder = false;
        refresh();
      } else {
        unorderDesks[onDragDeskNumber].pop();
        unorderDesks[onDropDeskNumber].push(onDragNumber);
        refresh();
      }
    }
    // if (isTemp2Temp) {
    //   console.log("isTemp2Temp")
    //   leftOrderTopDesks[onDragDeskNumber] = [];
    //   leftOrderTopDesks[onDropDeskNumber] = onDragNumber;
    //   console.log(leftOrderTopDesks);
    //   refresh();
    // }
  }
  

  const container = document.getElementById('newcell');
  container.addEventListener('dragstart', dragStart);
  container.addEventListener('dragenter', dragEnter);
  container.addEventListener('dragleave', dragLeave);
  container.addEventListener('dragend', dragEnd);
  container.addEventListener('dragover', dragOver);
  // container.addEventListener('click', e => console.log(e.target));

  const restartElem = document.getElementById('newgame');
  restartElem.addEventListener('click', refresh);
  
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