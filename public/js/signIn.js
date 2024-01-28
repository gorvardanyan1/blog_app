const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const password = e.target.password.value;

    const response = await fetch('/sign/in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password })
    })

    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        console.log('Login successful');
        location.pathname = '/'
    } else {
        console.error('Login failed');
    }
})