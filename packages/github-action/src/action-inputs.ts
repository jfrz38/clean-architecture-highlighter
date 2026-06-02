import type { OutputFormat, RunCheckInput } from '@jfrz38/clean-architecture-highlighter-cli';

export type ActionInputs = Pick<RunCheckInput, 'path' | 'config' | 'sourceFolder' | 'format'>;

export function parseActionInputs(getInput: (name: string) => string): ActionInputs {
    return {
        path: getInput('path') || '.',
        config: optionalInput(getInput('config')),
        sourceFolder: optionalInput(getInput('source-folder')),
        format: parseFormat(getInput('format') || 'text')
    };
}

function optionalInput(value: string): string | undefined {
    return value === '' ? undefined : value;
}

function parseFormat(value: string): OutputFormat {
    if (value === 'text' || value === 'json') {
        return value;
    }

    throw new Error('Input format must be text or json.');
}
