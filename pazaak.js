angular
    .module('pazaakApp', [])
    .controller('pazaakController', function ($scope) {

        $scope.playerSideDeckSelection = createSideDeckChoices();
        $scope.playerSideDeck = [];

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
            $scope.playerSideDeck = randomlySelectSideDeck($scope.playerSideDeck);
            console.log($scope.playerSideDeck);
        };


    });






