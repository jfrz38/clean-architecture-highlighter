import type { Rule } from 'eslint';
import { NoLayerViolationChecker } from '../../../application/no-layer-violation-checker';
import { DependencyPathResolver } from '../../../domain/dependency-path-resolver';
import { SourceFilePath } from '../../../domain/source-file-path';
import { CoreRuleConfigurationFactory, RuleOptions } from '../../core/core-rule-configuration';
import { AstDependencySource } from '../ast-dependency-source';
import { getFilename, RuleContext } from '../eslint-rule-context';
import { NoLayerViolationListenerFactory } from './no-layer-violation-listener';
import { noLayerViolationSchema } from './no-layer-violation-schema';

export const noLayerViolationRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow forbidden dependencies between Clean Architecture layers'
        },
        schema: noLayerViolationSchema(),
        messages: {
            layerViolation: '{{fromLayer}} layer should not depend on {{toLayer}} layer.'
        }
    },

    create(context: Rule.RuleContext): Rule.RuleListener {
        const configuration = new CoreRuleConfigurationFactory().create(context.options[0] as RuleOptions | undefined);
        const sourceFilePath = new SourceFilePath(getFilename(context as RuleContext));

        if (sourceFilePath.isVirtual() || !sourceFilePath.isInsideSourceFolder(configuration.sourceFolder)) {
            return {};
        }

        const sourceLayer = configuration.boundaries.getLayer(sourceFilePath.normalized);

        if (!sourceLayer) {
            return {};
        }

        const checker = new NoLayerViolationChecker(
            sourceLayer,
            configuration.boundaries,
            configuration.boundaries,
            new DependencyPathResolver(sourceFilePath.normalized),
            configuration.options.ignoreTypeImports,
            configuration.options.ignoreExternalDependencies
        );

        return new NoLayerViolationListenerFactory(checker, (source: AstDependencySource, violation): void => {
            context.report({
                node: source.node,
                messageId: 'layerViolation',
                data: violation
            });
        }).create();
    }
};
