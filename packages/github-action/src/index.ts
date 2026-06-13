import * as core from '@actions/core';
import { runCheck } from '@jfrz38/clean-architecture-highlighter-cli';
import { runGithubAction } from './run-action.js';

runGithubAction(core, runCheck);
