# Stats Master

Quickly view the stats (base stats, height, weight, abilities, notable moves) of any Pokémon!

You can view the website at https://stats-master.herokuapp.com/

## Features

* Choose any Pokémon (including special forms) from generations 1-8
* Select shiny and non-shiny Pokémon
* Create your own team and examine the stats of multiple Pokémon at once
* Remove and add as many Pokémon you want
* Save your team so you can view it in the future
* View the in-game base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, and Speed) of all Pokémon
* View the height/weight of all Pokémon
* View the abilities of all Pokémon
* View a few of the most notable moves of each Pokémon

## How to Use This Website

1. Choose a Pokémon by selecting one from the dropdown menu. 
2. Once you specify the Pokémon's name, you can decide if you want the Pokémon to appear shiny or not shiny. 
3. When you are ready, press the "Add Pokémon" button. Your Pokémon's stats should now appear!
4. You can view the stats of multiple Pokémon at once, so you can repeat this process as many times you want.
5. If you want to use a team in the future, click the "Save" button and enter a unique username; to load this
saved team, all you have to do is click "Load" and enter that same username.

## Installation

1. If you haven't already, download Node.js (https://nodejs.org/en/).
2. Clone this repository with the command `git clone https://github.com/Douglas-Hong/StatsMaster.git`.
3. Use the command `node app.js` in your StatsMaster directory.
4. Since the website is running on port 3000, you can navigate to the website via http://localhost:3000/.

If you want to use your own database to save and load teams, please follow these extra steps:
1. If you haven't already, create a free MongoDB Atlas account (https://www.mongodb.com/cloud/atlas/register).
2. Create a cluster; you can name it anything.
3. Create an admin account, and select which IP addresses can use the database.
4. Click the "Connect" button below the name of your cluster. Navigate to "Connect your application", and select Node.js 3.6 or later as the driver. Copy the connection string onto your clipboard.
5. In the StatsMaster directory, create a file named `.env`.
6. In `.env`, type `MONGODB_URI=connectionURL`, where connectionURL is your connection string. Make sure your connection string has the correct username and password.

## Images

<p align="center">Selection Menu</p>

![Selection Menu](https://i.imgur.com/vCT9iVb.jpg)

<p align="center">Team Section</p>

![Team Section](https://i.imgur.com/WlzD1gP.jpg)
