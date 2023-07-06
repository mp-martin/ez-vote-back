<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://zar.networkmanager.pl/static/readme/logo_white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://zar.networkmanager.pl/static/readme/logo_navy.svg">
  <img alt="EZ Vote logo" src="https://zar.networkmanager.pl/static/readme/logo_navy.svg">
</picture>

# About The Project

<img alt="" src="https://zar.networkmanager.pl/static/readme/app_screenshot.png">

EZ Vote is a simple app that allows you to make polls and let people vote in them. 🗳️

Check out the live demo at [ezvote.it](https://ezvote.it)

# Features 🔧

### New
* User login and registration system using JWT auth
* Users now able to see their polls
* React Hook Forms for creating polls
* Bugfix: questions and answers order is now always preserved

### Basic
* Multiple questions in a single poll
* Open-ended questions (multiple choice)
* Close-ended questions (single choice)
* Easy access to polls and results via unique links
* Use of cookies to prevent many votes by the same person.
* Vote percentage graph view for the results
* Responsive design
* _The Dudette_ <br><img alt="the dudette" src="https://zar.networkmanager.pl/static/media/cartoon.8cace218aea52624de38b8835e42bdb8.svg" width="200px" style="">

### Upcoming
* Users can delete their polls
* Admin account
* Password resetting

### Bugs and issues
* False errors may sometimes occur during viewing "My polls" section

# How it works⚙️

1. Create an account (optional)
2. Click on "Create a poll"
3. Add questions and answers
4. Select a type for each question: open (multiple choice) or closed (single choice)
5. Submit and share the link
6. Let people vote
7. Enjoy the results
8. If you were logged in while performing above steps, the poll will show up in "My polls" tab

# About this repo🔍
This is a backend client for the EZ Vote app. It was made using: 

* Typescript [![typescript][typescript]][typescript-url]
* Express [![express][express]][express-url]
* MySQL [![mysql][mysql]][mysql-url]
* MariaDB [![mariadb][mariadb]][mariadb-url]
* Additional packages, such as [cookie-parser](https://github.com/expressjs/cookie-parser), [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)

### Install locally
To install EZ Vote locally:

1. Clone the repo
   ```sh
   git clone https://github.com/mp-martin/ez-vote-back.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Generate public / private key pair for authorization to work. To do this, run `generateKeypair.ts` file. 
Two files should now appear in the main directory: `id_rsa_pub.pem` and `id_rsa_priv.pem`
4. Configure `config.example.ts` by removing comments, setting the variables according to your environment and renaming the file to `config.ts`
5. Run npm start
```sh
npm start
```

###
<span style="color:#FF5F9E">You will need the EZ Vote front-end client installed to run the app</span>. 

You also have to set up an SQL database (use my [template MariaDB sql file](https://zar.networkmanager.pl/static/readme/ezvote_db_tables.sql) for creating proper tables)

Check out the front-end app at [https://github.com/mp-martin/ez-vote-front](https://github.com/mp-martin/ez-vote-front)

⚠️ Make sure the file structure of both apps is this *(and mind the folder names)*:

```
├─ //your folder
│   ├── ez-vote-backend
│   ├── ez-vote-frontend
```

# About the author
My name is Martin, and I am on a journey to become a software engineer. By the way, I am a graphic designer.

You can find me on my [LinkedIn](https://www.linkedin.com/in/marcin-papierz/) 🤝


<!-- MARKDOWN LINKS & IMAGES -->

[express]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express-url]: https://expressjs.com/
[mysql]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[mariadb]: https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white
[mariadb-url]: https://mariadb.org/
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
