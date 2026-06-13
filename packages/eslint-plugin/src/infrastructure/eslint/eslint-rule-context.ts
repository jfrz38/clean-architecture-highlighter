import type { Rule } from 'eslint';

export type RuleContext = Rule.RuleContext & {
    filename?: string;
    physicalFilename?: string;
};

export function getFilename(context: RuleContext): string {
    return context.physicalFilename ?? context.filename ?? '<input>';
}
