#!/usr/bin/env node
import got from 'got';
import figlet from 'figlet';
import chalk from 'chalk';
import prompts from 'prompts';
import chalkAnimation from 'chalk-animation';
import boxen from 'boxen';
const log = console.log;

/**
 * cli - chatgpt basic code!!
 * @param {*} token 
 * @returns 
 */
 async function cli (token) {
    log(
        chalk.blue.bold(
            figlet.textSync('Chat Cli', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
            })
        )
    );
    if(!token) return new Error("Provide the token");
    try{
        const rainbow = chalkAnimation.rainbow('Chatgpt is typing...'); // Animation starts
        while(true) {
            log(chalk.red("!!"),"Press '!' to quit.");
            const response = await prompts({
                type: 'text',
                name: 'value',
                message: 'Write your question?'
            });
            if(response.value == "!") process.exit(0); 
            rainbow.start();
            const apiResponse = await got.post("https://api.openai.com/v1/chat/completions", {
                json: {
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": response.value}]
                },
                headers:{
                    "Authorization": "Bearer " + token
                },
                responseType:"json"
            }).json();
            rainbow.stop();
            log(chalk.whiteBright(boxen(apiResponse.choices[0].message.content, {title: 'Answer', borderColor:'blue', padding:1, titleAlignment: 'center', width:50})));
        }
    } catch(error) {
        throw new Error("Provided invalid key or limit exhausted. Try again..")
    }
};
const token = process.env.GPT_API_KEY || process.argv[2];
if(!token) {
    throw new Error("Provide the chatgpt api key in parameter for eg. gpt <API_KEY>");
}
cli(token);