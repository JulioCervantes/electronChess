const fs = require("fs");

exports.loadPgnFromFile = async (input) => {
    const fileStream = fs.readFileSync(input).toString().replace(/\r?\n|\r/g, '\n');
    console.log(fileStream);
    var pgnGames = fileStream.split(/ 1\-0| 0\-1| 1\/2-1\/2/);
    pgnGames.pop();

  let pgnGamesArray = [];

  for (i in pgnGames) {
    var game = pgnGames[i];
    // game = game.replace(/\r/, '');

    while (game.charAt(0) === '\n') {
      game = game.substr(1);
    }

    // while (game.charAt(0) === '\r') {
    //   game = game.substr(2);
    // }

    if(game.match(/1\-0/) !== null) {
      pgnGames[i] = game + ' 1-0';
    } else if (game.match(/0\-1/) !== null) {
      pgnGames[i] = game + ' 0-1';
    } else if (game.match(/1\/2-1\/2/) !== null) {
      pgnGames[i] = game + ' 1/2-1/2';
    } else {
      pgnGames[i] = game + ' *';
    }

    pgnGamesArray[i] = pgnGames[i].split(/\n/);
  }
  return pgnGamesArray;
}