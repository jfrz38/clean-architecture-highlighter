import { ConfigurationComponent } from "../configuration-component";
import { SourceFolder } from "../../types.configuration";

export class SourceFolderConfiguration extends ConfigurationComponent<SourceFolder> {
    
    public static readonly DEFAULT_SOURCE_FOLDER: SourceFolder = 'src';

    constructor(sourceFolder?: SourceFolder) {
        super(sourceFolder, SourceFolderConfiguration.DEFAULT_SOURCE_FOLDER);
    }
}
