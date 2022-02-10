const exec = require('child_process').exec;

function cases(val) {
    if (val == 200)
        return 200;
    else if (val == 400)
        return 400;
    else if (val == 401)
        return 401;
    else if (val == 402)
        return 402;
    else
        return 500;
}

function os_func() {
    this.execCommand = function (cmd, cb) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                cb(error);
                return;
            }

            if (stderr) {
                cb(stderr);
                return;
            }

            cb(stdout);
        });
    }
}

var os = new os_func();

test('healthcheck test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 healthcheck', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('resetpasses test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 resetpasses', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
}, 20000);

test('resettags test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 resettags', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('resetvehicles test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 resetvehicles', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});