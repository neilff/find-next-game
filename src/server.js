const express = require('express');
const app = express();
const jsdom = require('jsdom');
const moment = require('moment');

app.get('/api/team/:teamId', function(req, res) {
  const {teamId} = req.params;

  jsdom.env(
    `http://truenorthhockey.com/asp_pages/Team.aspx?team_id=${ teamId }`,
    ['http://code.jquery.com/jquery.js'],
    (err, window) => {
      const nextGame = window.$('.nextgame').text();
      const teamName = window.$('#ContentPlaceHolder2_LabelTeamName').text();

      if (nextGame.length <= 0 || teamName <= 0) {
        return res.status(400).json({
          error: `Invalid team ID provided: ${teamId}.`
        });
      }

      const scheduledGames = window
        .$('#ContentPlaceHolder2_GridViewScheduleScore')
        .find('tr')
        .not(':first');

      const schedule = [];

      for (var i = 0; i < scheduledGames.length; i++) {
        schedule.push({
          date: window.$(scheduledGames[i]).find('.date').text(),
          time: window.$(scheduledGames[i]).find('.time').text(),
          rink: window.$(scheduledGames[i]).find('.rink').text(),
          home: window.$(scheduledGames[i]).find('.team').first().text(),
          homeScore: window.$(scheduledGames[i]).find('.score').first().text(),
          away: window.$(scheduledGames[i]).find('.team:eq(1)').text(),
          awayScore: window.$(scheduledGames[i]).find('.score:eq(1)').text()
        });
      };

      const split = nextGame.split(' ');

      const month = split[2];
      const day = parseInt(split[3]);
      const timeStr = split[4].split(':');

      const rinkLocation = split[6];
      const rinkNumber = split[7];

      const hr = parseInt(timeStr[0]) + 12;
      const min = parseInt(timeStr[1]);
      const time = `${hr}:${min}`;
      const year = new Date().getFullYear();

      const dateFormat = 'MMM-DD-YYYY HH:mm';
      const date = moment(`${month}-${day}-${year} ${time}`, dateFormat);

      return res.json({
        next: {
          teamName,
          date: date.format('dddd, MMMM Do YYYY, h:mm a'),
          unix: date.valueOf(),
          time,
          rinkLocation,
          rinkNumber
        },
        schedule
      });
    }
  );
});

app.listen(process.env.PORT || 5000);
