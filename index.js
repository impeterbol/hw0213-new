const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const generateHTML = require('./generateHTML');
const convertFactory = require('electron-html-to');
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });



function writeToFile(fileName, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fileName, data, err => {
            if (err) reject(err)
            resolve("Made a file")
        })
    })
};

async function initES6() {
    try {
        const { username, color } = await inquirer.prompt([
            {
                message: 'Enter your Github username',
                name: 'username'
            },
            {
                name: 'color',
                type: 'list',
                choices: ['green', 'blue', 'pink', 'red']
            }
        ])
        if (!username) {
            throw "No User!"
        }

        const github = await axios.get(`https://api.github.com/users/${username}`);
        // const repos = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
        // const repoNames = repos.data.map(repo => repo.name);

        // location: github.location
        // name: github.name
        // company: github.company
        // console.log(github);
        const html = generateHTML({
            color,
            ...github.data
        })
        // console.log(html)
        await writeToFile(`./profile_${username}.html`, html);

        conversion(html, (err,result)=>{
            if (err) {
                return console.error(err);
              }
              result.stream.pipe(fs.createWriteStream(`./portfolio_${username}.pdf`));
              conversion.kill(); // shuts down the stream once the file is finished wrting since we are not going to append to it
    console.log(`Your pdf file ./portfolio_${username}.pdf is available in your current directory`);
        });

        

    } catch (error) {
        console.log(error)
    }
};



initES6();


// function init() {
//     inquirer
//         .prompt({
//             message: 'Enter your Github username',
//             name: 'username'
//         })
//         .then(({ username }) => {
//             const url = `https://api.github.com/users/${username}/repos?per_page=100`;

//             axios.get(url)
//                 .then((res) => {
//                     const repoNames = res.data.map(repo => repo.name);

//                     writeToFile('./index-test.js', repoNames)
//                         .then(function (res) {
//                             console.log(res)
//                         })
//                         .catch(function (err) {
//                             console.log(err)
//                         })
//                 })
//                 .catch(function (err) {
//                     console.log(err)
//                 })
//         })
//         .catch(function (err) {
//             console.log(err)
//         });
// }



// const HTMLToPDF = require('html-to-pdf');

// const getPDF = async () => {
//     const htmlToPDF = new HTMLToPDF(`
//       <div>Hello world</div>
//     `);
      
//     try {
//       const pdf = await htmlToPDF.convert();
//       // do something with the PDF file buffer
//     } catch (err) {
//       // do something on error
//     }
//   };