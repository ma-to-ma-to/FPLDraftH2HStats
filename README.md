# FPLDraftH2HStats
When given an FPL Draft Head-to-Head League ID, these scripts will pull data from FPL APIs and compile informative CSV files (spreadsheets).

## How to Use the Scripts
1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or download this repository to some folder on your computer.
2. Install [Node.js](https://nodejs.org/en/download/) if you don't have it already.
3. Use a [command line interface](https://medium.com/swlh/how-to-use-the-command-line-interface-cli-9c8b70e568e) to navigate to the folder where you cloned this repository.
    * For Linux and Mac, the default included terminals will work fine.
    * For Windows, I recommend [PowerShell](https://docs.microsoft.com/en-us/powershell/), which is also now included on all Windows installs.
4. Use the following command to install necessary packages for the program to work:
    * `npm i`
5. Run the scripts with the following command:
    * `node processAll.js [XXXXX]`
    * Be sure to replace \[XXXXX\] with your League ID (without the brackets). This is necessary for the scripts to run.
6. [CSV files](https://en.wikipedia.org/wiki/Comma-separated_values) will be populated into a new folder called `csv` in the same location on your machine. You can open these with Excel or an open source equivalent. Enjoy!
    * If you run the scripts more than once, be sure to move the previous CSV files out of the csv folder before re-running. If you don't, the scripts will append to those existing CSV files and make something of a mess in doing so.

## How do I find my League ID?
1. Use a non-mobile (PC, Mac, or Linux) browser to log in to your FPL Draft League at https://draft.premierleague.com/
2. Open the browser's inspector via the context menu that appears when you right click the page (or simply press F12 on Chrome/Firefox).
3. In the inspector pane, go to the Network tab at the top.
4. On the FPL Draft website, click the "League" tab.
5. You will see rows populate into the inspector pane. Click the row that has Name/File/Filename "details".
6. On the right side of the inspector pane, an inner pane will show with a bunch of information in it. At the top is a URL that should say something like
    *  `GET https://draft.premierleague.com/api/league/[XXXXX]/details`
7. The \[XXXXX\] part is your League ID!

## Making Graphs
As mentioned, these scripts only create spreadsheets of your stats. Many options are available to make data visualizations of the spreadsheets - Power BI and Excel are powerful options. Personally I used a free account on [Piktochart](https://piktochart.com/). Data from spreadsheets can be copied into their web app to make graphs like the ones below, (though you will likely need to adjust some of the formatting from the generated spreadsheets):
<br/>
<br/>
<p align="center">
  <img src="https://i.imgur.com/An3b0mn.png">
<br/>
  <img src="https://i.imgur.com/pnM2gCD.png">
<br/>
  <img src="https://i.imgur.com/JnLAn3X.png">
</p>
<br/>
<br/>
<br/>
<br/>
NOTE: Previous season data is not available with this tool! Unfortunately when a new season starts, the FPL APIs no longer serve any data from older seasons.
