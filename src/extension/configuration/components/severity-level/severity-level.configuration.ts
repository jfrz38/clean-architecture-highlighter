import { SeverityLevel } from "../../types.configuration";
import { ConfigurationComponent } from "../configuration-component";

export class SeverityLevelConfiguration extends ConfigurationComponent<SeverityLevel> {

    public static readonly DEFAULT_SEVERITY_LEVEL: SeverityLevel = 'warning';

    constructor(severityLevel?: SeverityLevel) {
        super(severityLevel, SeverityLevelConfiguration.DEFAULT_SEVERITY_LEVEL);
    }
}
