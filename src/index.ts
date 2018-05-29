#!/usr/bin/env node
import program from 'commander';
import {PullReuqestCreator} from './PullRequestCreator';
import clipboardy from "clipboardy";
import {InputParams} from "./DTOs";

program
    .option('-t, --title <title>', 'The title of the Pull Request')
    .option('-d, --description <prdescription>', 'The description of the Pull Request')
    .parse(process.argv);

async function runAsync(title: string): Promise<string> {

    const inputParams = new InputParams();
    inputParams.title = program.title;
    inputParams.description = program.prdescription;

    const prCreator = new PullReuqestCreator();
    const prLink = await prCreator.createPullRequest(inputParams);
    await clipboardy.write(prLink)

    return prLink;

}
runAsync(program.title).then((prLink) => {
    console.log(`PR link was copied to your clipboard: ${prLink}`)
}).catch(reason => {
    console.log(`Creation of PR failed due to: ${reason}`)
})







