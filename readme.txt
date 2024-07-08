666c4cb38251cc5c0d22147c

Setup

cd "C:\xampp\htdocs\fareham_carwash"

cd "C:\Users\Fareham College\source\repos\Fareham-Hand-Carwash1"
(clone repository)


git clone https://github.com/ianabr78/Fareham-Hand-Carwash.git

initioalise node: npm init


npm run start
npm run dev (for restarting when code changes)

If you ever need to manually restart the server while using nodemon, you can press rs in the terminal where nodemon is running.



install mongo on local host
https://www.mongodb.com/try/download/community


npm install -g nodemon (re run every time code change)


node may need updating: (so this is node version manager)
https://github.com/coreybutler/nvm-windows/releases/tag/1.1.12
then: nvm install node (from main command prompt not terminal)


********************************
ai, gpt

please remember the following set of rules:


I will use these codes, how you should answer is after the comma:
#0 or ?0, remember this for later, the filename will be at the top, confirm you have remembered it and do not reply. Please refer to code by the page names provided.
#1 or ?1, yes or no answer
#2 or ?2, roughly 100 words, limited code suggestions and expansion
#3 or ?3, provide only the explanation of the errors in the code provided and your corrections without additional commentary
#4 or ?4, full expanded answer with code suggestion

Default code is #2 where no code is provided, please use this code unless specified for all responses

if I give .ejs extensions these are client side and should not be used for server side javascript, please minimise the amount of code including JS in this file and prefer server side locations

if I provide programming code with no question please treat as #0 and remember until a question is asked

please use different text color to highlite new lines of code and any changes

please avoid repeating the whole block of code in your code changes and limit this to the changed function only

please default to code 0 where no question is asked, do not reply and remember this

please remember these rules over gpt version changes and all future sessions for my account unless I overwite the codes or the set of rules

Whenever providing code changes, mark the new or changed lines with comment "//changed" to make them easily identifiable.

Please do not provide all code just parts which have changes, but include line numbers corresponding to which line this is in the original file


********************************
Git

ian.brown@fareham.ac.uk (google account)

check gitignore (env not transferring)

check branches in use:
git branch -r     :   main



pushing:
git add .
git commit -m "date"  (at this point students could remember the code in case restore is needed)
git push origin main

check whats different:
git fetch origin

force push:
git push origin main --force


pulling: check whats different / discard local changes / overwite local (force)

git fetch  
git reset --hard HEAD (careful with this detatches the branch more research)
git checkout -f origin/main


********************************
 Mongo 

logged in with ian.brown@fareham.ac.uk (google account not github!)

checked mongo URI as reported from compas:
mongodb+srv://<username>:<password>@fareham-hand-carwash.7wrs3jo.mongodb.net/

replace username and password yourself!!!
mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/
mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/fhcw

u: fhamcwash2
p: zjEqxsEInK6ER200

followed instructions on "Add MongoDB Binaries Directory to PATH" after VS connection error
(this prob not needed as was not the issue)

mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/


********************************

Mongo Shell (mongosh)

INSTALL:
Used the zip extract not the msi
https://www.mongodb.com/docs/mongodb-shell/install/#add-the-mongosh-binary-to-your-path-environment-variable

SET UP:
https://www.mongodb.com/docs/mongodb-shell/connect/#std-label-mdb-shell-connect
 connection string (car wash): mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/

enter in command line:
(note database name added at the end)
mongosh "mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/fhcw" --username fhamcwash2

Enable command line copy / paste
https://www.minitool.com/news/how-to-paste-into-command-prompt.html
- this doest apply to mongosh apparently

**given up too complext for students to resolve**

********************************
Mongo DB Compass

ian.brown@fareham.ac.uk (google account)
new atlas setup ianbrown / 0D2tZZ74T8rKcN4c

local installation with GUI to replace testing fuctionality of mongo shell

https://www.mongodb.com/try/download/compass

use the connection strring to connect (in advanced)

Useful feature - stages query builder
schema anlysis could be explored to create ERD

create stages - useful for building queries
lookup, merge, project wtc, this could be used for relational




********************************

TEMP NOTES (testing)

db.bookings.aggregate([
  {
    $project: {
      _id: true,
      name: { $ifNull: ["$name", "Unknown"] },
      number: { $ifNull: ["$number", ""] },
      car: { $ifNull: ["$car", "Unknown"] },
      size: { $ifNull: ["$size", ""] },
      datetime: { $ifNull: ["$datetime", new Date()] },
      date: { $dateToString: { format: "%Y-%m-%d", date: { $ifNull: ["$datetime", new Date()] } } },
      time: { $dateToString: { format: "%H:%M", date: { $ifNull: ["$datetime", new Date()] } } }
    }
  }
]);



********************************

Choclatey
https://docs.chocolatey.org/en-us/choco/setup/#installing-chocolatey

from command line:
https://docs.chocolatey.org/en-us/choco/setup/#installing-chocolatey

given up

********************************

Mongoose

npm install mongoose

update occasionally
npm install mongoose@latest




********************************





********************************




********************************