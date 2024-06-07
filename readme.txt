Setup

cd "C:\xampp\htdocs\fareham_carwash"

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
#0, remember this for later, the filename will be at the top, confirm you have remembered it only. Please refer to code by the page names provided.
#1, yes or no answer
#2, roughly 100 words, limited code suggestions and expansion
#3, provide only the explanation of the errors in the code provided and your corrections
#4, full expanded answer with code suggestion

Default code is #2 where no code is provided, please use this code unless specified for all responses

if I give .ejs extensions these are client side and should not be used for server side javascript, please minimise the amount of code including JS in this file and prefer server side locations

if I provide programming code with no question please treat as #0 and remember until a question is asked

please use different text color to highlite new lines of code and any changes

please avoid repeating the whole block of code in your code changes and limit this to the changed function only

please remember these rules over gpt version changes and all future sessions for my account unless I overwite the codes or the set of rules




********************************
Git

check gitignore (env not transferring)

check branches in use:
git branch -r     :   main



pushing:
git add .
git commit -m "date"
git push origin main

check whats different:
git fetch origin

force push:
git push origin main --force


pulling: check whats different / discard local changes / overwite local (force)

git fetch  
git reset --hard HEAD
git checkout -f origin/main


********************************
 Mongo 

checked mongo URI as reported from compas:
mongodb+srv://<username>:<password>@fareham-hand-carwash.7wrs3jo.mongodb.net/

replace username and password yourself!!!
mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/
(caused an issue)

u: fhamcwash2
p: zjEqxsEInK6ER200

followed instructions on "Add MongoDB Binaries Directory to PATH" after VS connection error
(this prob not needed as was not the issue)





********************************





********************************





********************************
