import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { RustDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/rust-dependency-extractor';

suite('RustDependencyExtractor', () => {
    const extractor = new RustDependencyExtractor();

    test('extracts use declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use crate::infrastructure::persistence::SqlUserRepository;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/crate/infrastructure/persistence/SqlUserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts grouped use declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use crate::domain::user::{User, UserId};`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/crate/domain/user/User/');
        assert.strictEqual(dependencies[1].path, '/crate/domain/user/UserId/');
    });

    test('extracts nested grouped use declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use crate::{domain::user::{User, UserId}, application::ports::UserRepository};`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 3);
        assert.strictEqual(dependencies[0].path, '/crate/domain/user/User/');
        assert.strictEqual(dependencies[1].path, '/crate/domain/user/UserId/');
        assert.strictEqual(dependencies[2].path, '/crate/application/ports/UserRepository/');
    });

    test('extracts aliased use declarations without the alias', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use crate::domain::user::User as DomainUser;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/crate/domain/user/User/');
    });

    test('extracts glob use declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use crate::domain::user::*;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/crate/domain/user/*/');
    });

    test('extracts relative use declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `use super::ports::CommandHandler;
use self::domain::User;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/super/ports/CommandHandler/');
        assert.strictEqual(dependencies[1].path, '/self/domain/User/');
    });

    test('extracts mod declarations as normalized paths', async () => {
        const document = createDocument({
            language: 'rust',
            content: `mod create_user;
pub mod ports;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/create_user/');
        assert.strictEqual(dependencies[1].path, '/ports/');
    });

    test('extracts use ranges from the use declaration only', async () => {
        const document = createDocument({
            language: 'rust',
            content: `mod user;

use crate::application::ports::UserRepository;

pub struct User;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/crate/application/ports/UserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });
});
