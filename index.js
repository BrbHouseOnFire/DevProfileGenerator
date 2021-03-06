const fs = require("fs");
const util = require("util");
const inq = require("inquirer");
const axios = require("axios");
const pdf = require("html5-to-pdf");
const path = require("path");


let prompter = () => {

    inq.prompt([
        {
            type: 'input',
            name: 'username',
            message: `What is the developer's GitHub Username?`
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
                avatar: res.data.avatar_url, // profile image
                login: res.data.login, // username
                location: res.data.location, // google search location
                url: res.data.html_url, // gitHub url
                blog: res.data.blog, // blog url
                bio: res.data.bio, // bio text
                public_repos: res.data.public_repos, // # of public repos
                followers: res.data.followers, // # of followers
                following: res.data.following, // # following
                fav_color: favColor // user selected color choice
            }
            // console.log(res.data.bio);
            if (res.data.blog === null || res.data.blog === "") {
                // console.log("blog null");
                data.blog = data.url;
            }
            if (res.data.bio === null || res.data.bio === "") {
                // console.log("bio null");
                data.bio = "This is my GitHub profile!";
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
                fs.writeFile("./output/output.html", html, err => {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        console.log('HTML Successfull');
                        createPDF(data.login);
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
            ${data.login}
        </h1>
        <div id="imgContainer">
            <img src="${data.avatar}">
        </div>
        <div class="bio">
            <p>
                Bio: ${data.bio}
            </p>
        </div>
        <div class="container flex jcsa aic">
        <div id="ulOneContainer">
            <ul>
                <li>
                    <a href="https://www.google.com/maps/search/${data.location}">User Location</a>
                </li>
                <li>
                    <a href="${data.url}">GitHub Link</a>
                </li>
                <li>
                    <a href="${data.blog}">Blog Link</a>
                    
                </li>
            </ul>
        </div>
        <div id="ulTwoContainer">
            <ul>
                <li>
                    Number of Public Repositories: ${data.public_repos}
                </li>
                <li>
                    Number of Followers: ${data.followers}
                </li>
                <li>
                    Number Following: ${data.following}
                </li>
                <li>
                    Star Gazers: ${data.stargazers}
                </li>
            </ul> 
        </div>
        </div>
    
    </body>
    </html>`
    return str;
};

let createPDF = async (login) => {
    console.log("pdfing");
    const html5ToPDF = new pdf({
      inputPath: path.join(__dirname, "./output/output.html"),
      outputPath: path.join(__dirname, `./output/${login}Profile.pdf`),
      include: [
        // path.join(__dirname, "./node_modules/frow/dist/frow.min.css"),
        path.join(__dirname, "./assets/style.css")
      ],
      options: { printBackground: true }
    });
    await html5ToPDF.start();
    await html5ToPDF.build();
    await html5ToPDF.close();
    await deleteHTML();
    console.log("DONE");
    process.exit(0);
};

let deleteHTML = async () => {
    fs.unlink("./output/output.html", err => {
        if (err) {
            console.log(err);
        }
        else{
            console.log('HTML file cleared successfully');
        }
    })
}


let init = () => {
    prompter();
};


init();

