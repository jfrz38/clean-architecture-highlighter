import { Suite } from "./types";
import { getSelectedSuites } from "./scenario-selection";

export const suites: Suite[] = getSelectedSuites();
export const fullSuites: Suite[] = getSelectedSuites("full");
