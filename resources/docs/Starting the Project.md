# How to start the project
## Backend
First, ensure that your database is properly configured in your local copy of `.env`. If you have not already, you must make a copy of `.env_template`, which is tracked by version control, and insert proper values for the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, AND `DB_PASS` variables.

Next, either open up a terminal window or press ``ctrl + ` `` (the key with ~ on it) inside your VS code environment. Then navigate into the `/backend` directory within this project using `cd <folder-name>` and `cd ..` to go up a directory.

Finally we can run our code using the following command:
```
npm run dev
```
This will start the backend server and listen for file changes. As such there is no need to rerun this command after you make a change. Simply save the file you are changing and the server will restart automatically.

## Frontend
If you are working on integration with the backend, be sure to start the backend first using the instructions above.

Start by navigating to the `/frontend` directory by using the `cd` command (more detail on that in the backend instructions) inside a terminal window. Then run the following command:
```
npm start
```
Similarly to the backend, this command will listen for file changes and automatically refresh your browser DOM after you save the file. This process is called hot-reloading, and it means you don't have to rerun this command nor refresh your browser window every time you make a change.