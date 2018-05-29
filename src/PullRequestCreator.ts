import base64 from "base-64";
import gitRemoteOriginUrl from "git-remote-origin-url";
import gitRev from "git-rev";
import fetch from "node-fetch";
import {ICreatePullRequestReponse, InputParams, IRepositoryResponse, ISingleRepository} from "./DTOs";
import RepoInfo from "./RepoInfo";

export class PullReuqestCreator {
    private readonly ApiVersion: string = "4.1";
    private readonly AccessToken: string;

    constructor() {
        const accessToken = process.env.MsengAccessToken;
        if (!accessToken) {
            throw new Error("There must be an environment variable " +
                "called MsengAccessToken containing the access token");
        }
        this.AccessToken = accessToken;
    }

    public async createPullRequest(inputParams: InputParams): Promise<string> {
        const repoInfo = await this.populateRepoInfo();
        console.log(`Found the following repo info: base url - ${repoInfo.BaseUrl}, repo name: ${repoInfo.RepositoryName}`);

        const currentBranchRef = await this.getCurrentBranchRefAsync();
        console.log(`Found local that branch is ${currentBranchRef}`);

        // creating PR
        const prUrl = `${repoInfo.BaseUrl}/_apis/git/repositories/${repoInfo.RepositoryId}/pullrequests?api-version=${this.ApiVersion}`;

        if (!inputParams.title) {
            inputParams.title = `Merge ${currentBranchRef} to ${repoInfo.DefaultBranchRef}`;
        }

        if (!inputParams.description) {
            inputParams.description = inputParams.title;
        }

        const prBody = {
            sourceRefName: currentBranchRef,
            targetRefName: repoInfo.DefaultBranchRef,
            title: inputParams.title,
            description: inputParams.description,
        };

        console.log(`Creating PR with title ${inputParams.title}`);
        const response = await this.CallPost(prUrl, JSON.stringify(prBody)) as ICreatePullRequestReponse;

        if (response.pullRequestId) {
            const returnUrl = `${repoInfo.BaseUrl}/_git/${repoInfo.RepositoryName}/pullrequest/${response.pullRequestId}?_a=overview`;
            return returnUrl;
        } else {
            throw new Error(response.message);
        }
    }

    private async populateRepoInfo(): Promise<RepoInfo> {
        const repoInfo = new RepoInfo();

        const url = await gitRemoteOriginUrl();
        this.parseRepositoryInfoFromOriginUrl(url, repoInfo);

        const reposUrl = `${repoInfo.BaseUrl}/_apis/git/repositories?api-version=${this.ApiVersion}`;
        const response = (await this.CallGet(reposUrl)) as IRepositoryResponse;
        const filteredRepos = response.value.filter((repo: ISingleRepository) => repo.name === repoInfo.RepositoryName);
        if (filteredRepos.length === 0) {
            throw new Error("Didn't find repo with local repo name");
        }

        const selectedRepo = filteredRepos[0];

        repoInfo.DefaultBranchRef = selectedRepo.defaultBranch;
        repoInfo.RepositoryId = selectedRepo.id;

        return repoInfo;
    }

    private async CallGet(url: string): Promise<object> {
        const headers = {Authorization: "Basic " + base64.encode(`:${this.AccessToken}`)};

        const response = await fetch(url, {method: "GET", headers});

        return await response.json();
    }

    private async CallPost(url: string, body: string): Promise<object> {
        const headers = {
            "Authorization": "Basic " + base64.encode(`:${this.AccessToken}`),
            "Content-Type": "application/json",
        };

        const response = await fetch(url, {method: "POST", headers, body});

        return await response.json();
    }

    private parseRepositoryInfoFromOriginUrl(url: string, repoInfo: RepoInfo): void {
        const re = new RegExp("(.*)/_git/(.*)");
        const matches = re.exec(url);
        if (matches) {
            repoInfo.BaseUrl = matches[1];
            repoInfo.RepositoryName = matches[2];
        }
    }

    private getCurrentBranchRefAsync(): Promise<string> {
        return new Promise((resolve, reject): void => {
            gitRev.branch((branch) => {
                if (branch) {
                    resolve(`refs/heads/${branch}`);
                } else {
                    reject("Can't find branch");
                }
            });
        });
    }
}
