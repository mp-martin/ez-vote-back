![logo](https://zar.networkmanager.pl/static/readme/logo.png)

# About The Project

![alt text](https://zar.networkmanager.pl/static/readme/main_screen.png)
EZ Vote is a simple app that allows you to make polls and let people vote in them. 🗳️

Check out the [live demo](https://zar.networkmanager.pl)

# Features 🔧

### Current
* Multiple questions in a single poll
* Open-ended questions (multiple choice)
* Close-ended questions (single choice)
* Easy access to polls and results via unique links
* Use of cookies to prevent many votes by the same person.
* Vote percentage graph view for the results
* Responsive design implemented
* _The Dudette_ <img alt="the dudette" src="https://zar.networkmanager.pl/static/media/cartoon.8cace218aea52624de38b8835e42bdb8.svg" width="100px">
### Upcoming
* User registration and login
* Managing your polls (list / edit / delete)
* UX improvements

### Bugs and issues
* Poll questions are listed in reverse order compared to the creation order.
* Incomplete form validation
* No 404 page view

# How it works⚙️

1. Create a poll ![alt text](https://zar.networkmanager.pl/static/readme/poll_setting.png) _(use multiple questions if you want)_ ![alt text](https://zar.networkmanager.pl/static/readme/multiple_questions.png)

2. Select question types![alt text](https://zar.networkmanager.pl/static/readme/single_multi_question.png)

3. Submit and share the link![alt text](https://zar.networkmanager.pl/static/readme/link_sharing.png)

5. Let people vote ![alt text](https://zar.networkmanager.pl/static/readme/poll_filling.png)

6. Enjoy the results ![alt text](https://zar.networkmanager.pl/static/readme/results.png)


# About this repo🔍
This is a backend client for the EZ Vote app. It was made using: 

* Typescript [![typescript][typescript]][typescript-url]
* Express [![express][express]][express-url]
* MySQL [![mysql][mysql]][mysql-url]
* MariaDB [![mariadb][mariadb]][mariadb-url]
* A package or two _([cookie-parser](https://github.com/expressjs/cookie-parser) or [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit), for instance)_


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
3. run npm start
   ```sh
   npm start
   ```
###
<span style="color:#FF5F9E">You will need the EZ Vote front-end app installed to run everything successfully</span>. 

You also have to set up an SQL database (use my [template MariaDB sql file](https://zar.networkmanager.pl/static/readme/ezvote.sql))

Check out the front-end app at [https://github.com/mp-martin/ez-vote-front](https://github.com/mp-martin/ez-vote-front)

⚠️ Make sure the file structure of both apps is this *(and mind the folder names)*:

```
├─ //your folder
│   ├── ez-vote-backend
│   ├── ez-vote-frontend
```

#About the author
My name is Martin and I am on a journey to become a software engineer. By the way, I am a graphic designer.

You can find me at my [Linkedin](https://www.linkedin.com/in/marcin-papierz/) 🤝


<!-- MARKDOWN LINKS & IMAGES -->

[express]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express-url]: https://expressjs.com/
[mysql]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[mariadb]: https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white
[mariadb-url]: https://mariadb.org/
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
