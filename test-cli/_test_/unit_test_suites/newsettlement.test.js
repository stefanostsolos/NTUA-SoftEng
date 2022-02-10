const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const newsettlement = require('./../../../CLI/utils/newsettlement.js')

test('Unit Test for newsettlement function', async () => {
    const res = await newsettlement.newsettlement(baseURL, jwt, 'EG', 'AO', '20210919');
    expect(res).toBe(200)
})

//bad request