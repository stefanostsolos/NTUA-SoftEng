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
    else if (val == 404)
        return 404;
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

test('login test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 login --username admin --passw freepasses4all', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('chargesby test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 chargesby --op1 AO --datefrom 20210419 --dateto 20210619 --format yaml', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('chargesby test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 chargesby --op1 AO --datefrom 20250919 --dateto 20210619 --format yaml', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('ClearSettlement test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 clearsettlement --id not_valid', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('NewSettlement test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 newsettlement --op1 not_valid --op2 EG --dateto 20210619', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('passesanalysis test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passesanalysis --op1 not_valid --op2 KO --datefrom 20210419 --dateto 20210919 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('passesanalysis test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(402)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passesanalysis --op1 GF --op2 KO --datefrom 20250919 --dateto 20210919 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});


test('passescost test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passescost --op1 not_valid --op2 EG --datefrom 20210419 --dateto 20210619 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('passescost test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passescost --op1 not_valid --op2 EG --datefrom 202050419 --dateto 20210619 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('passesperstation test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passesperstation --station not_valid --datefrom 20210419 --dateto 20210619 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('passesperstation test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(402)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 passesperstation --station KO06 --datefrom 20250419 --dateto 20210619 --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('settlementbyid test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 settlementbyid --id not_valid --format csv', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('settlementsbyoperator test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 settlementsbyoperator --op1 AO --format yaml', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('admin passesupd test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(404)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 admin --passesupd --source not_valid', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('admin usermod test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(400)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 admin --usermod --username test --passw test --type operator --operatorID not_valid', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('admin users test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(402)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 admin --users --username not_valid', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});

test('logout test', done => {
    function callback(data) {
        try {
            expect(data).toEqual(200)
            done();
        } catch (error) {
            done(error);
        }
    }
    os.execCommand('se2118 logout', function (retVal) {
        const last = retVal.slice(-4);
        callback(cases(last));
    });
});