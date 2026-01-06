import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(testsRoot: string, cb: (error: any, failures?: number) => void): void {
    const mocha = new Mocha({
        ui: 'tdd',
    });

    glob('*.test.js', { cwd: testsRoot })
        .then((files) => {
            files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));
            try {
                mocha.run((failures) => {
                    cb(null, failures);
                });
            } catch (err) {
                console.error(err);
                cb(err);
            }
        })
        .catch((err) => {
            console.log("ERROR: ", err);
            return cb(err);
        });
}
