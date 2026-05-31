import { SourceFolderPath } from "../../types.configuration";

export class SourceFolderConfiguration {
    constructor(private readonly sourceFolder?: SourceFolderPath) {}

    public get config(): SourceFolderPath | undefined {
        return this.sourceFolder;
    }
}
