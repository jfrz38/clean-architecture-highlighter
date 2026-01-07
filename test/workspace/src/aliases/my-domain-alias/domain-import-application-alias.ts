import { InfrastructureAlias } from "../my-infrastructure-alias/infrastructure";
import { ApplicationAlias } from "../my-application-alias/application";
import { Application } from "../../application/application";
import { Infrastructure } from "../../infrastructure/infrastructure";

export class DomainImportApplicationAlias {

}

// This tests will fail only to import "ApplicationAlias" and "Infrastructure":
// 1. ✅ InfrastructureAlias is under "my-infrastructure-alias" layer which is not recognizable so it won't fail
// 2. ❌ ApplicationAlias is under "my-application-alias" layer which is recognizable as alias for "application" so it will fail
// 3. ✅ Application is under "application" layer which is not recognizable so it won't fail
// 4. ❌ Infrastructure is under "infrastructure" layer which is recognizable by default so it will fail
