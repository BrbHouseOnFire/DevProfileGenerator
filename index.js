const fs = require("fs");
const inq = require("inquirer");
const util = require("util");


let prompter = () => {

    inq.prompt([
        // name, location, bio?, linkedinUrl, githubUrl
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?'
        },
        {
            type: 'input',
            name: 'location',
            message: 'What is your location?'
        },
        {
            type: 'input',
            name: 'link',
            message: 'What is your linkedinUrl?'
        },
        {
            type: 'input',
            name: 'git',
            message: 'What is your githubUrl?'
        }
    ]).then(data => {
        
        // let filename = `index.html`;
    
    
        // let frame = `<!DOCTYPE html>
        // <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <meta http-equiv="X-UA-Compatible" content="ie=edge">
        //     <title>40Mini</title>
        // </head>
        // <body>
        //     <h1>Mini Project Page</h1>
        //     <div>${data.name}</div>
        //     <div>${data.location}</div>
        //     <div>${data.link}</div>
        //     <div>${data.git}</div>
        // </body>
        // </html>`;
    
    
        // // write to file
        // fs.writeFile(filename, frame, err => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else{
        //         console.log('success');
        //     }
        // })
        
    })
}




let init = () => {
    prompter();
};


init();