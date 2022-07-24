// Add Winning Statment 

// Get a new deck
let getDeck = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`

let player1CardVal = 0
let player2CardVal = 0

// makes request to the the api using the above link
fetch(getDeck)

.then((res) => res.json()) // parse response as JSON

.then((data) => {
    // console.log(data)
    
    const deckID = data.deck_id
    
    // For drawing two cards
    document.querySelector('button').addEventListener('click', drawCardsFromDeck)

    function drawCardsFromDeck(){
        
        const urlToDraw = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`
        
        // makes request to the the api using the above link
        fetch(urlToDraw)
        .then((res) => res.json()) // parse response as JSON

        .then((dataDeck) => {
            // console.log(dataDeck)
                
            console.log(`Remaining in Deck: ${dataDeck.remaining}`)
            
            console.log(`Player 1 Card: ${dataDeck.cards[0].code}`)
            console.log(`Player 2 Card: ${dataDeck.cards[1].code}`)
            
            // display both cards on the DOM
            document.querySelector('#card1').src = dataDeck.cards[0].image
            document.querySelector('#card2').src = dataDeck.cards[1].image
            document.querySelector('#blueback').style.visibility = "hidden"
            document.querySelector('#redback').style.visibility = "hidden"

            // Storing the value of the card which each player drew
            player1CardVal = convertValue(String(dataDeck.cards[0].value))
            player2CardVal = convertValue(String(dataDeck.cards[1].value))

            // player1CardVal = 7
            // player2CardVal = 7

            // Condition if it is a war
            if(player1CardVal === player2CardVal){

                let secRemainingText = 5
                let secRemainingTime = 5000

                document.querySelector('h3').style.color = "black"

                // Updating Countdown on the DOM
                while(secRemainingTime != 0){
                    setTimeout(() => {document.querySelector('h3').innerText = `War!!! Starting in ${secRemainingText--} Seconds...`}, secRemainingTime)
                    secRemainingTime -= 1000
                }

                // For drawing eight cards
                setTimeout(drawCardsFromDeckForWar, 6000)
            }

            // Condition if player 1 wins
            else if(player1CardVal > player2CardVal){
                
                document.querySelector('h3').innerText = `Player 1 Has Won This Round`  
                document.querySelector('h3').style.color = "#1b737f"
                

                // adding both cards to player 1 pile
                let player1Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/add/?cards=${dataDeck.cards[0].code},${dataDeck.cards[1].code}`
                
                fetch(player1Pile)
                .then((res) => res.json())
                
                .then((dataAddingToPlayer1) => {
                    // console.log(dataAddingToPlayer1)
                    // displaying the pile of player 1
                    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/list/`)
                    .then((res) => res.json())
                    
                    .then((dataListingPlayer1) => {
                        // console.log(dataListingPlayer1)
                        console.log("Player 1 Won! its Pile:")
                        console.log(dataListingPlayer1.piles.player1)
                        document.querySelector('#player1').innerText = `Player 1 Pile: ${dataListingPlayer1.piles.player1.remaining}`  
                    })
                    
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
                })
                
                .catch((err) => {
                    console.log(`error ${err}`)
                })
            
            }
            
            // Condition if player 2 wins
            else{
                
                document.querySelector('h3').innerText = `Player 2 Has Won This Round`  
                document.querySelector('h3').style.color = "#f32030"

                // adding both cards to player 2 pile
                let player2Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/add/?cards=${dataDeck.cards[0].code},${dataDeck.cards[1].code}`
                
                fetch(player2Pile)
                .then((res) => res.json())
                
                .then((dataAddingToPlayer2) => {
                    // console.log(dataAddingToPlayer2)
                    // displaying the pile of player 2
                    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/list/`)
                    .then((res) => res.json())
                    
                    .then((dataListingPlayer2) => {
                        // console.log(data)
                        console.log("Player 2 Won! Its Pile:")
                        console.log(dataListingPlayer2.piles.player2)
                        document.querySelector('#player2').innerText = `Player 2 Pile: ${dataListingPlayer2.piles.player2.remaining}`
                        
                    })
                    
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
                })
                
                .catch((err) => {
                    console.log(`error ${err}`)
                })
                
            }
                
            if(dataDeck.remaining === 0){
                console.log(`Remaining in Deck: ${dataDeck.remaining}`)
                document.querySelector('button').addEventListener('click', drawCardsFromPiles)
            }
        })

        // to catch and display any error in the response
        .catch((err) => {
            console.log(`error ${err}`)
        })

    }

    function drawCardsFromPiles(){

        // Shuffling Player1 Cards
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/shuffle/`)
        .then((res) => res.json()) // parse response as JSON

        .then((shufflePlayer1) => {

            // Shuffling Player2 Cards
            fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/shuffle/`)
            .then((res) => res.json()) // parse response as JSON
            
            .then((shufflePlayer2) => {
                
                let urlToDrawFromPlayer1 = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/draw/?count=1`
            
                // console.log(`Shifted to drawing from player piles now`)
                fetch(urlToDrawFromPlayer1)
                .then((res) => res.json()) // parse response as JSON
            
                .then((dataPlayer1) => {
                    // console.log(dataPlayer1)
                    
                    let urlToDrawFromPlayer2 = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/draw/?count=1`
                    
                    fetch(urlToDrawFromPlayer2)
                    .then((res) => res.json()) // parse response as JSON
                    
                    .then((dataPlayer2) => {
                        // console.log(dataPlayer2)
                        
                        // Storing the value of the card which each player drew
                        player1CardVal = convertValue(String(dataPlayer1.cards[0].value))
                        player2CardVal = convertValue(String(dataPlayer2.cards[0].value))

                        // player1CardVal = 8
                        // player2CardVal = 8

                        console.log(`Player 1 Card: ${dataPlayer1.cards[0].code}`)
                        console.log(player1CardVal)
                        console.log(`Player 2 Card: ${dataPlayer2.cards[0].code}`)
                        console.log(player2CardVal)    
                        
                        // display both cards on the DOM
                        document.querySelector('#card1').src = dataPlayer1.cards[0].image
                        document.querySelector('#card2').src = dataPlayer2.cards[0].image
                        document.querySelector('#blueback').style.visibility = "hidden"
                        document.querySelector('#redback').style.visibility = "hidden"
                        
                        document.querySelector('#player1').innerText = `Player 1 Pile: ${dataPlayer1.piles.player1.remaining}`
                        document.querySelector('#player2').innerText = `Player 2 Pile: ${dataPlayer2.piles.player2.remaining}`

                        // Condition if it is a war
                        if(player1CardVal === player2CardVal){

                            let secRemainingText = 5
                            let secRemainingTime = 5000

                            document.querySelector('h3').style.color = "black"

                            // Updating Countdown on the DOM
                            while(secRemainingTime != 0){
                                setTimeout(() => {document.querySelector('h3').innerText = `War!!! Starting in ${secRemainingText--} Seconds...`}, secRemainingTime)
                                secRemainingTime -= 1000
                            }

                            // For drawing eight cards
                            setTimeout(drawCardsFromPilesForWar, 6000)  
                        }
                        
                        // Condition if player 1 wins
                        else if(player1CardVal > player2CardVal){
                            
                            document.querySelector('h3').innerText = `Player 1 Has Won This Round`  
                            document.querySelector('h3').style.color = "#1b737f"

                            // adding both cards to player 1 pile
                            let player1Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/add/?cards=${dataPlayer1.cards[0].code},${dataPlayer2.cards[0].code}`
                            
                            fetch(player1Pile)
                            .then((res) => res.json())
                            
                            .then((dataAddingToPlayer1) => {
                                // console.log(dataAddingToPlayer1)
                                // displaying the pile of player 1
                                fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/list/`)
                                .then((res) => res.json())
                                
                                .then((dataListingPlayer1) => {
                                    // console.log(dataListingPlayer1)
                                    console.log("Player 1 Won! its Pile:")
                                    console.log(dataListingPlayer1.piles.player1)
                                    document.querySelector('#player1').innerText = `Player 1 Pile: ${dataListingPlayer1.piles.player1.remaining}`
                                    
                                    if(dataListingPlayer1.piles.player1.remaining === 0){
                                        document.querySelector('h3').innerText = `Player 2 Has Won The Game!!!`
                                    }
                                })
                                
                                .catch((err) => {
                                    console.log(`error ${err}`)
                                })
                            })
                            
                            .catch((err) => {
                                console.log(`error ${err}`)
                            })
                        
                        }

                        // Condition if player 2 wins
                        else{
                            
                            document.querySelector('h3').innerText = `Player 2 Has Won This Round`  
                            document.querySelector('h3').style.color = "#f32030"

                            // adding both cards to player 2 pile
                            let player2Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/add/?cards=${dataPlayer1.cards[0].code},${dataPlayer2.cards[0].code}`
                            
                            fetch(player2Pile)
                            .then((res) => res.json())
                            
                            .then((dataAddingToPlayer2) => {
                                // console.log(dataAddingToPlayer2)
                                // displaying the pile of player 2
                                fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/list/`)
                                .then((res) => res.json())
                                
                                .then((dataListingPlayer2) => {
                                    // console.log(data)
                                    console.log("Player 2 Won! Its Pile:")
                                    console.log(dataListingPlayer2.piles.player2)
                                    document.querySelector('#player2').innerText = `Player 2 Pile: ${dataListingPlayer2.piles.player2.remaining}`

                                    if(dataListingPlayer2.piles.player1.remaining === 0){
                                        document.querySelector('h3').innerText = `Player 1 Has Won The Game!!!`
                                    }
                                    
                                })
                                
                                .catch((err) => {
                                    console.log(`error ${err}`)
                                })
                            })
                            
                            .catch((err) => {
                                console.log(`error ${err}`)
                            })
                            
                        }

                    })
            
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
            
                })
            
                .catch((err) => {
                    console.log(`error ${err}`)
                })
            })
            
            .catch((err) => {
                console.log(`error ${err}`)
            })
            
        })
        
        .catch((err) => {
            console.log(`error ${err}`)
        })

    }

    function drawCardsFromPilesForWar(){

        // Shuffling Player1 Cards
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/shuffle/`)
        .then((res) => res.json()) // parse response as JSON

        .then((shufflePlayer1) => {

            // Shuffling Player2 Cards
            fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/shuffle/`)
            .then((res) => res.json()) // parse response as JSON
            
            .then((shufflePlayer2) => {
                
                let urlToDrawFromPlayer1 = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/draw/?count=4`
            
                // console.log(`Shifted to drawing from player piles now`)
                fetch(urlToDrawFromPlayer1)
                .then((res) => res.json()) // parse response as JSON
            
                .then((dataPlayer1) => {
                    // console.log(dataPlayer1)
                    
                    let urlToDrawFromPlayer2 = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/draw/?count=4`
                    
                    fetch(urlToDrawFromPlayer2)
                    .then((res) => res.json()) // parse response as JSON
                    
                    .then((dataPlayer2) => {
                        // console.log(dataPlayer2)
                        
                        // Cards facing backside
                        console.log(`Player 1 Card: ${dataPlayer1.cards[0].code}`) 
                        console.log(`Player 1 Card: ${dataPlayer1.cards[1].code}`)
                        console.log(`Player 1 Card: ${dataPlayer1.cards[2].code}`)
                        console.log(`Player 2 Card: ${dataPlayer2.cards[0].code}`)
                        console.log(`Player 2 Card: ${dataPlayer2.cards[1].code}`)
                        console.log(`Player 2 Card: ${dataPlayer2.cards[2].code}`)

                        // Cards facing frontside
                        console.log(`Player 1 Card Shown: ${dataPlayer1.cards[3].code}`)
                        console.log(`Player 2 Card Shown: ${dataPlayer2.cards[3].code}`)
                        
                        // display both cards on the DOM
                        document.querySelector('#card1').src = dataPlayer1.cards[3].image
                        document.querySelector('#card2').src = dataPlayer2.cards[3].image
                        document.querySelector('#blueback').style.visibility = "visible"
                        document.querySelector('#redback').style.visibility = "visible"
                        
                        // Storing the value of the card which each player drew
                        player1CardVal = convertValue(String(dataPlayer1.cards[3].value))
                        player2CardVal = convertValue(String(dataPlayer2.cards[3].value))
                        
                        console.log(`player1CardVal: ${player1CardVal}`)
                        console.log(`player2CardVal: ${player2CardVal}`)

                        document.querySelector('#player1').innerText = `Player 1 Pile: ${dataPlayer1.piles.player1.remaining}`
                        document.querySelector('#player2').innerText = `Player 2 Pile: ${dataPlayer2.piles.player2.remaining}`
                        
                        // Condition if player 1 wins
                        if(player1CardVal > player2CardVal){
                            
                            document.querySelector('h3').innerText = `Player 1 Has Won This Round`  
                            document.querySelector('h3').style.color = "#1b737f"

                            // adding both cards to player 1 pile
                            let player1Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/add/?cards=${dataPlayer1.cards[0].code},${dataPlayer2.cards[0].code},${dataPlayer1.cards[1].code},${dataPlayer2.cards[1].code},${dataPlayer1.cards[2].code},${dataPlayer2.cards[2].code},${dataPlayer1.cards[3].code},${dataPlayer2.cards[3].code}`
                            
                            fetch(player1Pile)
                            .then((res) => res.json())
                            
                            .then((dataAddingToPlayer1) => {
                                // console.log(dataAddingToPlayer1)
                                // displaying the pile of player 1
                                fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/list/`)
                                .then((res) => res.json())
                                
                                .then((dataListingPlayer1) => {
                                    // console.log(dataListingPlayer1)
                                    console.log("Player 1 Won! its Pile:")
                                    console.log(dataListingPlayer1.piles.player1)
                                    document.querySelector('#player1').innerText = `Player 1 Pile: ${dataListingPlayer1.piles.player1.remaining}`  
                                })
                                
                                .catch((err) => {
                                    console.log(`error ${err}`)
                                })
                            })
                            
                            .catch((err) => {
                                console.log(`error ${err}`)
                            })
                        
                        }

                        // Condition if player 2 wins
                        else{
                            
                            document.querySelector('h3').innerText = `Player 2 Has Won This Round`  
                            document.querySelector('h3').style.color = "#f32030"

                            // adding both cards to player 2 pile
                            let player2Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/add/?cards=${dataPlayer1.cards[0].code},${dataPlayer2.cards[0].code},${dataPlayer1.cards[1].code},${dataPlayer2.cards[1].code},${dataPlayer1.cards[2].code},${dataPlayer2.cards[2].code},${dataPlayer1.cards[3].code},${dataPlayer2.cards[3].code}`
                            
                            fetch(player2Pile)
                            .then((res) => res.json())
                            
                            .then((dataAddingToPlayer2) => {
                                // console.log(dataAddingToPlayer2)
                                // displaying the pile of player 2
                                fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/list/`)
                                .then((res) => res.json())
                                
                                .then((dataListingPlayer2) => {
                                    // console.log(data)
                                    console.log("Player 2 Won! Its Pile:")
                                    console.log(dataListingPlayer2.piles.player2)
                                    document.querySelector('#player2').innerText = `Player 2 Pile: ${dataListingPlayer2.piles.player2.remaining}`
                                    
                                })
                                
                                .catch((err) => {
                                    console.log(`error ${err}`)
                                })
                            })
                            
                            .catch((err) => {
                                console.log(`error ${err}`)
                            })
                            
                        }

                    })
            
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
            
                })
            
                .catch((err) => {
                    console.log(`error ${err}`)
                })
            })
            
            .catch((err) => {
                console.log(`error ${err}`)
            })
            
        })
        
        .catch((err) => {
            console.log(`error ${err}`)
        })

    }

    function drawCardsFromDeckForWar(){
        
        const urlToDraw = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=8`
        
        // makes request to the the api using the above link
        fetch(urlToDraw)
        .then((res) => res.json()) // parse response as JSON

        .then((dataDeck) => {
            // console.log(dataDeck)
                
            console.log(`Remaining in Deck: ${dataDeck.remaining}`)
            
            // Cards facing backside
            console.log(`Player 1 Card: ${dataDeck.cards[0].code}`) 
            console.log(`Player 2 Card: ${dataDeck.cards[1].code}`)
            console.log(`Player 1 Card: ${dataDeck.cards[2].code}`)
            console.log(`Player 2 Card: ${dataDeck.cards[3].code}`)
            console.log(`Player 1 Card: ${dataDeck.cards[4].code}`)
            console.log(`Player 2 Card: ${dataDeck.cards[5].code}`)

            // Cards facing frontside
            console.log(`Player 1 Card: ${dataDeck.cards[6].code}`)
            console.log(`Player 2 Card: ${dataDeck.cards[7].code}`)
            
            // display both cards on the DOM
            document.querySelector('#blueback').style.visibility = "visible" 
            document.querySelector('#card1').src = dataDeck.cards[6].image
            document.querySelector('#redback').style.visibility = "visible" 
            document.querySelector('#card2').src = dataDeck.cards[7].image

            // Storing the value of the card which each player drew
            player1CardVal = convertValue(String(dataDeck.cards[6].value))
            player2CardVal = convertValue(String(dataDeck.cards[7].value))

            console.log(`player1CardVal: ${player1CardVal}`)
            console.log(`player2CardVal: ${player2CardVal}`)

            if(player1CardVal > player2CardVal){

                document.querySelector('h3').innerText = `Player 1 Has Won This Round`  
                document.querySelector('h3').style.color = "#1b737f"

                // adding all cards to player 1 pile
                let player1Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/add/?cards=${dataDeck.cards[0].code},${dataDeck.cards[1].code},${dataDeck.cards[2].code},${dataDeck.cards[3].code},${dataDeck.cards[4].code},${dataDeck.cards[5].code},${dataDeck.cards[6].code},${dataDeck.cards[7].code}`
                
                fetch(player1Pile)
                .then((res) => res.json())
                
                .then((dataAddingToPlayer1) => {
                    // console.log(dataAddingToPlayer1)
                    // displaying the pile of player 1
                    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player1/list/`)
                    .then((res) => res.json())
                    
                    .then((dataListingPlayer1) => {
                        // console.log(dataListingPlayer1)
                        console.log("Player 1 Won! its Pile:")
                        console.log(dataListingPlayer1.piles.player1)
                        document.querySelector('#player1').innerText = `Player 1 Pile: ${dataListingPlayer1.piles.player1.remaining}`  
                    })
                    
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
                })
                
                .catch((err) => {
                    console.log(`error ${err}`)
                })
            }

            // Condition if player 2 wins
            else{
                
                document.querySelector('h3').innerText = `Player 2 Has Won This Round`  
                document.querySelector('h3').style.color = "#f32030"

                // adding both cards to player 2 pile
                let player2Pile = `https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/add/?cards=${dataDeck.cards[0].code},${dataDeck.cards[1].code},${dataDeck.cards[2].code},${dataDeck.cards[3].code},${dataDeck.cards[4].code},${dataDeck.cards[5].code},${dataDeck.cards[6].code},${dataDeck.cards[7].code}`
                
                fetch(player2Pile)
                .then((res) => res.json())
                
                .then((dataAddingToPlayer2) => {
                    // console.log(dataAddingToPlayer2)
                    // displaying the pile of player 2
                    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/player2/list/`)
                    .then((res) => res.json())
                    
                    .then((dataListingPlayer2) => {
                        // console.log(data)
                        console.log("Player 2 Won! Its Pile:")
                        console.log(dataListingPlayer2.piles.player2)
                        document.querySelector('#player2').innerText = `Player 2 Pile: ${dataListingPlayer2.piles.player2.remaining}`
                        
                    })
                    
                    .catch((err) => {
                        console.log(`error ${err}`)
                    })
                })
                
                .catch((err) => {
                    console.log(`error ${err}`)
                })
                
            }

        })

        .catch((err) => {
            console.log(`error ${err}`)
        })

    }

    // converting non number cards into its respective number value
    function convertValue(cardVal){
        switch(cardVal) {
            case "ACE":
            return 1
            case "JACK":
                return 11
            case "QUEEN":
                return 12
            case "KING":
                return 13
            default:
            return Number(cardVal)
        }
    }

})

.catch((err) => {
    console.log(`error ${err}`)
})