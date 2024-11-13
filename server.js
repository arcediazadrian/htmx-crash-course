import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/users', async (req, res) => {
    setTimeout(async () => {
        const limit = +req.query.limit || 10;
        const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
        const users = await response.json();

        res.send(`
        <h1 class="text-2xl font-bold my-4">Users</h1>
        <ul>
            ${users.map((user) => `<li>${user.name}</li>`).join('')}
        </ul>
    `);
    }, 2000);
});

app.post('/convert', (req, res) => {
    setTimeout(() => {
        const fahrenheit = parseFloat(req.body.fahrenheit);
        const celsius = (fahrenheit - 32) * (5 / 9);

        res.send(`
            <p>
            ${fahrenheit} degrees Fahrenheit is equal to ${celsius} degrees Celsius
            </p>
        `);
    }, 2000);
});

let counter = 0;
app.get('/poll', (req, res) => {
    counter++;

    const data = { value: counter };

    res.json(data);
});

let currentTemperature = 20;
app.get('/get-temperature', (req, res) => {
    currentTemperature += Math.random() * 2 - 1;
    res.send(currentTemperature.toFixed(1) + '°C')
});

const contacts = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Doe', email: 'jane@example.com' },
    { name: 'Alice Smith', email: 'alice@example.com' },
    { name: 'Bob Williams', email: 'bob@example.com' },
    { name: 'Mary Harris', email: 'mary@example.com' },
    { name: 'David Mitchell', email: 'david@example.com' },
];
app.post('/search', (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        res.send('<tr></tr>');
    }

    const searchResults = contacts.filter((contact) => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);
    });

    setTimeout(() => {
        const searchResultHtml = searchResults.map(contact => `
            <tr>
                <td><div class="my-4 p-2">${contact.name}</div></td>
                <td><div class="my-4 p-2">${contact.email}</div></td>
            </tr>
        `).join('');

        res.send(searchResultHtml);
    }, 1000);
});

app.post('/search/api', async (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        res.send('<tr></tr>');
    }

    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const contactFromApi = await response.json();

    const searchResults = contactFromApi.filter((contact) => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);
    });

    setTimeout(() => {
        const searchResultHtml = searchResults.map(contact => `
            <tr>
                <td><div class="my-4 p-2">${contact.name}</div></td>
                <td><div class="my-4 p-2">${contact.email}</div></td>
            </tr>
        `).join('');

        res.send(searchResultHtml);
    }, 1000);
});

app.post('/contact/email', (req, res) => {
    const submittedEmail = req.body.email;
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    const isValid = {
        message: 'That email is valid',
        class: 'text-green-700',
    };

    const isInvalid = {
        message: 'Please enter a valid email address',
        class: 'text-red-700',
    };

    if(!emailRegex.test(submittedEmail)) {
        return res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input 
                    hx-post="/contact/email"
                    type="email" 
                    name="email" 
                    id="email" 
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500" 
                    required
                    value="${submittedEmail}"
                />
                <div class="${isInvalid.class}">${isInvalid.message}</div>
            </div>    
        `);
    }else {
        return res.send(`
            <div class="mb-4" hx-target="this" hx-swap="outerHTML">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input 
                    hx-post="/contact/email"
                    type="email" 
                    name="email" 
                    id="email" 
                    class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500" 
                    required
                    value="${submittedEmail}"
                />
                <div class="${isValid.class}">${isValid.message}</div>
            </div>    
        `);
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

