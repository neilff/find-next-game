# find-next-game

Scrapes the True North Hockey website to find out when a provided team ID is playing next.

[Example Query](https://tn-find-next-game.herokuapp.com/api/team/17947)

## `/api/team/:teamId [GET]`

Responds with a JSON object containing the data for the next game and the scheduled games.

+ Request (application/json)

    Parameter | Description
    --- | ---
    teamId | The team's ID to grab next game for


+ Response 200 (application/json)

```
  {
    teamName: String,
    next: {
      date: String,
      unix: Number,
      time: String,
      rinkLocation: String,
      rinkNumber: String
    },
    schedule: [
      {
        date: String,
        time: String,
        rink: String,
        home: String,
        homeScore: String,
        away: String,
        awayScore: String
      }
    ]
  }
```
