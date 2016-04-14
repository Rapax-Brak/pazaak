angular
    .module('pazaakApp', [])
    .controller('pazaakController', function ($scope) {

        $scope.combinedMainDeck = [];

        $scope.playerSideDeckSelection = createSideDeckChoices();
        $scope.playerSideDeck = [];
        $scope.playerMainDeck = [];
        $scope.playerCounter = 0;
        $scope.playerWins = 0;
        $scope.playerStand = false;
        var playerDanger = 'off';

        $scope.opponentSideDeck = createOpponentSideDeck();
        $scope.opponentMainDeck = [];
        $scope.opponentCounter = 0;
        $scope.opponentWins = 0;
        var opponentStand = false;
        var opponentApproach = riskGenerator();
        var opponentDanger = 'off';

        $scope.secondStage = false;

        function randomGenerator (minimum, maximum) {
            return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
        }

        function createMainDeck () {
            var mainDeck = [];

            for (var i = 1; i <= 10; i++) {
                for (var j = 0; j < 4; j++) {
                    mainDeck.push({
                        value: i,
                        sign: '+'
                    });
                }
            }

            return mainDeck;
        }

        function createSideDeckChoices () {
            var array = [];
            var sign = null;

            // flip cards
            array.push({
                value: '2&4',
                sign: sign,
                numberSelected: 0,
                id: '2&4'
            }, {
                value: '3&6',
                sign: sign,
                numberSelected: 0,
                id: '3&6'
            });

            // double card
            array.push({
                value: 'Double',
                sign: sign,
                numberSelected: 0,
                id: 'Double'
            })

            // tiebreaker card
            array.push({
                value: 'Tiebreaker (+/- 1)',
                sign: sign,
                numberSelected: 0,
                id: 'Tiebreaker (+/- 1)'
            });

            // cards from 1 to 6 for -, +, and +/-
            for (var j = 0; j < 3; j++) {

                if (j === 0) {
                    sign = '+';
                } else if (j === 1) {
                    sign = '-';
                } else if (j === 2) {
                    sign = '+/-';
                }

                for (var i = 1; i <= 6; i++) {
                    array.push({
                        value: i,
                        sign: sign,
                        numberSelected: 0,
                        id: sign + i
                    });
                }
            }

            return array;
        }

        function createOpponentSideDeck () {
            var sideDeck = createSideDeckChoices();
            var storage = [];

            for (var i = 0; i < 4; i++) {
                sideDeck.shift();
            }

            sideDeck = shuffle(sideDeck);

            for (var i = 0; i < 4; i++) {
                storage.push(sideDeck.pop());
            }

            return storage;
        }

        function shuffle (array) {
            for (var i = 0; i < array.length; i++) {
                var randomIndex = randomGenerator(0, array.length - 1);

                var temp = array[i];
                array[i] = array[randomIndex];
                array[randomIndex] = temp;
            }

            return array;
        };

        function randomlySelectSideDeck (array) {
            var returnedCards = [];
            if (array.length !== 10) {
                console.log('Need 10 selected cards for the side deck.')
            } else {
                for (var i = 0; i < 4; i++) {
                    returnedCards.push(array[randomGenerator(0, array.length - 1)]);
                }

                return returnedCards;
            }
        }

        $scope.sideDeckChange = function (card, change) {
            if (change === 'add') {
                if ($scope.playerSideDeck.length < 10) {
                    card.numberSelected++;
                    for (var i = 0; i < $scope.playerSideDeck.length; i++) {
                        if ($scope.playerSideDeck[i].id === card.id) {
                            $scope.playerSideDeck[i] = card;
                        }
                    }
                    $scope.playerSideDeck.push(card);
                } else {
                    console.log('Cannot go above 10 cards.');
                }
            } else if (change === 'remove') {
                if ($scope.playerSideDeck.length > 0) {
                    if (card.numberSelected > 0) {
                        card.numberSelected--;

                        if (card.numberSelected === 0) {
                            for (var i = 0; i < $scope.playerSideDeck.length; i++) {
                                if ($scope.playerSideDeck[i].id === card.id) {
                                    $scope.playerSideDeck.splice(i, 1);
                                }
                            }
                        } else {
                            var tempIndex = null;
                            for (var i = 0; i < $scope.playerSideDeck.length; i++) {
                                if ($scope.playerSideDeck[i].id === card.id) {
                                    $scope.playerSideDeck[i] = card;
                                    tempIndex = i;
                                }
                            }
                            $scope.playerSideDeck.splice(tempIndex, 1);
                        }
                    } else {
                        console.log('Cannot go below 0 cards.');
                    }
                } else {
                    console.log('There are 0 cards in the your side deck.');
                }
            }
        };

        $scope.acceptSideDeckSelection = function () {
            $scope.secondStage = true;
            $('.initialStage').empty();
            $scope.combinedMainDeck = shuffle(createMainDeck());
            $scope.playerSideDeck = randomlySelectSideDeck($scope.playerSideDeck);

            console.log($scope.playerSideDeck);
        };

        $scope.playerHit = function () {
            var temp = $scope.combinedMainDeck.pop();
            $scope.playerCounter += temp.value;
            $scope.playerMainDeck.push(temp);
            continueGame();
        };

        $scope.playerStandFunction = function () {
            if ($scope.playerCounter > 20) {
                $scope.playerDanger = 'dead';
            }
            $scope.playerStand = true;
            continueGame();
        };

        $scope.playerChoose = function () {

        };

        function riskGenerator () {
            var risk = randomGenerator(0, 2);
            if (risk === 0) {
                return 'small risk';
            } else if (risk === 1) {
                return 'medium risk';
            } else if (risk === 2) {
                return 'large risk';
            }
        }

        $scope.opponentHit = function () {
            var temp = $scope.combinedMainDeck.pop();
            $scope.opponentCounter += temp.value;
            $scope.opponentMainDeck.push(temp);
            checkPoints();
        }

        $scope.opponentStand = function () {
            if ($scope.opponentCounter > 20) {
                $scope.opponentDanger = 'dead';
            }
            opponentStand = true;
            continueGame();
        }

        $scope.opponentChoose = function () {
            var bestScore = 0;
            var cardIndex = null;

            for (var i = 0; i < $scope.opponentSideDeck.length; i++) {
                if ($scope.opponentCounter < 20) {
                    if ($scope.opponentSideDeck[i].sign === '+' || $scope.opponentSideDeck[i].sign === '+/-') {
                        if ($scope.opponentSideDeck[i].value + $scope.opponentCounter <= 20 && $scope.opponentSideDeck[i].value + $scope.opponentCounter >= 18) {
                            if ($scope.opponentSideDeck[i].value + $scope.opponentCounter > bestScore) {
                                bestScore = $scope.opponentSideDeck[i].value;
                                cardIndex = i;
                            }
                        }
                    }
                } else if ($scope.opponentCounter > 20) {
                    if ($scope.opponentSideDeck[i].sign === '-' || $scope.opponentSideDeck[i].sign === '+/-') {
                        if ($scope.opponentCounter - $scope.opponentSideDeck[i].value <= 20 && $scope.opponentCounter - $scope.opponentSideDeck[i].value >= 18) {
                            if ($scope.opponentCounter - $scope.opponentSideDeck[i].value > bestScore) {
                                bestScore = $scope.opponentSideDeck[i].value;
                                cardIndex = i;
                            }
                        }
                    }
                }
            }

            if (cardIndex) {
                return $scope.opponentSideDeck.splice(cardIndex, 1)[0];
            } else {
                return null;
            }
        }

        function opponentTurn () {
            if (opponentStand === false) {
                var check = $scope.opponentChoose();

                if (opponentApproach === 'small risk') {
                    if ($scope.opponentCounter <= 12) {
                        if (check === null) {
                            $scope.opponentHit();
                        } else {
                            $scope.opponentCounter += check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    } else if ($scope.opponentCounter > 20) {
                        if (check) {
                            $scope.opponentCounter -= check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    } else if ($scope.opponentCounter >= 13 && $scope.opponentCounter <= 19) {
                        if (check) {
                            $scope.opponentCounter += check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    }
                } else if (opponentApproach === 'medium risk') {
                    if ($scope.opponentCounter <= 16) {
                        if (check === null) {
                            $scope.opponentHit();
                        } else {
                            $scope.opponentCounter += check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    } else if ($scope.opponentCounter > 20) {
                        if (check) {
                            $scope.opponentCounter -= check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    } else if ($scope.opponentCounter >= 17 && $scope.opponentCounter <= 19) {
                        if (check) {
                            $scope.opponentCounter += check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    }
                } else if (opponentApproach === 'large risk') {
                    if ($scope.opponentCounter <= 19) {
                        $scope.opponentHit();
                    } else if ($scope.opponentCounter > 20) {
                        if (check) {
                            $scope.opponentCounter -= check.value;
                            $scope.opponentMainDeck.push(check);
                            $scope.opponentStand();
                        }
                    }
                }
            }
        }

        function dangerSwitch (level, change) {
            if (change === '+') {
                if (level === 'off') {
                    return 'on';
                } else if (level === 'on') {
                    return 'dead';
                }
            } else if (change === '-') {
                if (level === 'on') {
                    return 'off';
                } else if (level === 'off') {
                    return 'off';
                }
            }
        }

        function checkPoints () {
            var tiebreaker = false;

            if ($scope.playerCounter > 20) {
                playerDanger = dangerSwitch(playerDanger, '+');
                if (playerDanger === 'dead') {
                    $scope.opponentStand();
                    $scope.playerStandFunction();
                    $scope.opponentWins++;
                }
            } else if ($scope.opponentCounter > 20) {
                opponentDanger = dangerSwitch(opponentDanger, '+');
                if (playerDanger === 'dead') {
                    $scope.opponentStand();
                    $scope.playerStandFunction();
                    $scope.playerWins++;
                }
            } else if ($scope.opponentCounter === 20 && $scope.playerCounter === 20) {
                for (var i = 0; i < $scope.playerMainDeck.length; i++) {
                    if ($scope.playerMainDeck[i].id === 'Tiebreaker (+/- 1)') {
                        tiebreaker = true;
                    }
                }

                if (tiebreaker) {
                    $scope.playerWins++;
                }

                $scope.opponentStand();
                $scope.playerStandFunction();
            } else {
                if ($scope.playerCounter === 20) {
                    $scope.playerStandFunction();
                    continueGame();
                } else if ($scope.opponentCounter === 20) {
                    $scope.opponentStand();
                } else if ($scope.playerStand && opponentStand) {
                    if ($scope.playerCounter > $scope.opponentCounter) {
                        $scope.playerWins++;
                    } else if ($scope.playerCounter < $scope.opponentCounter) {
                        $scope.opponentWins++;
                    } else if ($scope.playerCounter === $scope.opponentCounter) {
                        for (var i = 0; i < $scope.playerMainDeck.length; i++) {
                            if ($scope.playerMainDeck[i].id === 'Tiebreaker (+/- 1)') {
                                tiebreaker = true;
                            }
                        }

                        if (tiebreaker) {
                            $scope.playerWins++;
                        }
                    }
                } else {
                    if ($scope.playerCounter < 20) {
                        playerDanger = dangerSwitch(playerDanger, '-');
                    }

                    if ($scope.opponentCounter < 20) {
                        opponentDanger = dangerSwitch(opponentDanger, '-');
                    }
                }
            }
        }

        function continueGame () {
            setTimeout(function () {
                checkPoints();
            });
            if (playerDanger === 'off') {
                opponentTurn();
            }
        }

    });






