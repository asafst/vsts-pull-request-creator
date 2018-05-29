#!/usr/bin/env node
import clipboardy from "clipboardy";
import program from "commander";
import {InputParams} from "./DTOs";
import {PullReuqestCreator} from "./PullRequestCreator";

async function runAsync(title: string): Promise<string> {

    program
        .option("-t, --title <title>", "The title of the Pull Request")
        .option("-d, --description <prdescription>", "The description of the Pull Request")
        .parse(process.argv);

    const inputParams = new InputParams();
    inputParams.title = program.title;
    inputParams.description = program.prdescription;

    const prCreator = new PullReuqestCreator();
    const prLink = await prCreator.createPullRequest(inputParams);
    await clipboardy.write(prLink);

    return prLink;

}
runAsync(program.title).then((prLink) => {
    console.log(`PR link was copied to your clipboard: ${prLink}`);
}).catch((reason) => {
    console.log(`Creation of PR failed due to: ${reason}`);
});
