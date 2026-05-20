import { ConfigurationComponent } from "../configuration-component";
import { EnabledLanguages } from "../../types.configuration";

export class EnabledLanguagesConfiguration extends ConfigurationComponent<EnabledLanguages> {

    public static readonly DEFAULT_ENABLED_LANGUAGES: EnabledLanguages = ['javascript', 'typescript'];

    constructor(enabledLanguages?: EnabledLanguages) {
        super(enabledLanguages, EnabledLanguagesConfiguration.DEFAULT_ENABLED_LANGUAGES);
    }
}
