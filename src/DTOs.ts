export interface IRepositoryResponse {
    value: ISingleRepository[];
}

export interface ISingleRepository {
    id: string;
    name: string;
    defaultBranch: string;
}

export interface ICreatePullRequestReponse {
    pullRequestId: string | undefined;
    message: string;
}

export class InputParams {
    public title: string = "";
    public description: string = "";
}
