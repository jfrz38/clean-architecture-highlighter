import { SourceFolder } from "../../types.configuration";

export class SourceFolderConfiguration {
    constructor(private readonly sourceFolder?: SourceFolder) {}

    public get config(): SourceFolder | undefined {
        return this.sourceFolder;
    }
}
