const qs = require('qs');

async function test() {
    const filters = { category: { slug: { $eq: "motor" } } };
    const urlParamsObject = {
        filters,
        pagination: { limit: 1000 },
        fields: ['brand', 'volume', 'viscosity', 'oilType', 'approvals', 'consistency', 'greaseType', 'type', 'viscosityClass']
    };
    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    const url = `http://localhost:1337/api/products?${queryString}`;
    console.log("URL:", url);
    const res = await fetch(url);
    const text = await res.text();
    console.log(res.status, text);
}
test();
