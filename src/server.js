var express = require('express');
var app = express();
var jsdom = require('jsdom');

app.get('/api/team/:teamId', function(req, res) {
  const {teamId} = req.params;

  jsdom.env(
    `http://truenorthhockey.com/asp_pages/Team.aspx?team_id=${ teamId }`,
    ['http://code.jquery.com/jquery.js'],
    (err, window) => {
      const nextGameStr = window.$('.nextgame').text();
      const split = nextGameStr.split(' ');
      const month = split[2];
      const day = split[3];
      const time = split[4];
      const rinkLocation = split[6];
      const rinkNumber = split[7];

      res.json({
        nextGame: nextGameStr,
        month,
        day,
        time,
        rinkLocation,
        rinkNumber
      });
    }
  );
});

app.listen(5000);
