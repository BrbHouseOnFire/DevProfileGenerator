const fs = require("fs");
const util = require("util");
const inq = require("inquirer");
const axios = require("axios");
// const pdf = require("html-pdf");
// const pdf = require("html5-to-pdf");
// const path = require("path");


let prompter = () => {

    inq.prompt([
        {
            type: 'input',
            name: 'username',
            message: `What is the user's github Username?`
        },
        {
            type: 'input',
            name: 'favColor',
            message: 'What is your favorite color?'
        }
    ]).then(function({ username, favColor }) {
        // userpage URL
        const queryUrl = `https://api.github.com/users/${username}`;
        // repo list URL
        // const repoUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        const repoUrl = `https://api.github.com/users/${username}/repos`;
  
        // Pull basic user info
        axios.get(queryUrl).then(function(res) {
            // console.log(res);
            let data = {
                avatar: res.data.avatar_url,
                login: res.data.login,
                location: res.data.location,
                url: res.data.html_url,
                blog: res.data.blog,
                bio: res.data.bio,
                public_repos: res.data.public_repos,
                followers: res.data.followers,
                following: res.data.following,
                fav_color: favColor
            }
            axios.get(repoUrl).then(function(rip) {
                // console.log(util.inspect(rip))
                let ripped = rip.data;
                let stars = 0;
                ripped.forEach(element => {
                    stars += element.stargazers_count;
                })
                data.stargazers = stars;

                let html = createHTML(data);

                // write to file
                fs.writeFile("./testingGround/output.html", html, err => {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        console.log('success');
                    }
                })

            })



        });
    });
        
}

let createHTML = (data) => {

    let str = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>pdf</title>
        <link rel="stylesheet" type="text/css" href="../assets/style.css">
        <style>
            body {
              background-color: ${data.fav_color};
            }
        </style>
    </head>
    <body class="bod flex column jcc aic " id="pinMe">
        <h1 class = "h">
            <!-- Login -->
            ${data.login}
        </h1>
        <div id="imgContainer">
            <!-- avatar_url -->
            <img src="${data.avatar}">
        </div>
        <div id="ulOneContainer">
            <ul>
                <li>
                    <!-- Location -->
                    <a href="https://www.google.com/maps/search/${data.location}">User Location</a>
                </li>
                <li>
                    <!-- url (github) -->
                    <a href="${data.url}">Github Link</a>
                </li>
                <li>
                    <!-- blog -->
                    <a href="${data.blog}">Blog Link</a>
                    
                </li>
            </ul>
        </div>
        <div class="bio">
            <p>
                <!-- bio -->
                ${data.bio}
            </p>
        </div>
        <div id="ulTwoContainer">
            <ul>
                <li>
                    <!-- public_repos -->
                    Number of Public Repositories: ${data.public_repos}
                </li>
                <li>
                    <!-- followers -->
                    Number of Followers: ${data.followers}
                </li>
                <li>
                    <!-- following -->
                    Number Following: ${data.following}
                </li>
                <li>
                    <!-- stargazers_count -->
                    Stargazers: ${data.stargazers}
                </li>
            </ul> 
        </div>
    
    </body>
    </html>`
    return str;
}


let init = () => {
    prompter();
};


init();












// const fs = require("fs");
// const axios = require("axios");
// const inquirer = require("inquirer");
// const HTML5ToPDF = require("html5-to-pdf")
// const path = require("path")
// inquirer
//   .prompt({
//     message: "Enter your GitHub username:",
//     name: "username"
//   })
//   .then(function({ username }) {
//     const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
//     axios.get(queryUrl).then(function(res) {
//       const repoNames = res.data.map(function(repo) {
//         return repo.name;
//       });
//       const repoNamesStr = repoNames.join("\n");
//       return htmlStr = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <meta http-equiv="X-UA-Compatible" content="ie=edge">
//       <title>Document</title>
// </head>
// <body>
//       <div>${repoNamesStr}</div>
// </body>
// </html>
// `;
//     })
//     .then(htmlStr => {
//       fs.writeFile("index.html", htmlStr, () => {
//       });
//     })
//     .then(() => {
//       /* read the file from filesystem */
//       /* convert to pdf */
//       const run = async () => {
//         const html5ToPDF = new HTML5ToPDF({
//           inputPath: path.join(__dirname, "index.html"),
//           outputPath: path.join(__dirname, "great.pdf"),
//           options: { printBackground: true }
//         });
//         await html5ToPDF.start();
//         await html5ToPDF.build();
//         await html5ToPDF.close();
//         console.log("DONE");
//         process.exit(0);
//       };
//       return run();
//     });
//   });