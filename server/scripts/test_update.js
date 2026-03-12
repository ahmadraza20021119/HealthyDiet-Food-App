const axios = require('axios');
async function test() {
    try {
        const res = await axios.put('http://localhost:5000/api/auth/update/5', {
            name: "Test Update",
            email: "admin@diet.com",
            phone: "123",
            address: "123"
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.log('Error:', err.response ? err.response.status : err.message);
    }
}
test();
