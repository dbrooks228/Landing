document.addEventListener('DOMContentLoaded', function() {
    // Function to set cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    let linkToken = getCookie('linkToken');  // Attempt to retrieve link token from cookies
    let publicToken = getCookie('publicToken');  // Attempt to retrieve public token from cookies

    const openLinkButton = document.getElementById('openLink');

    openLinkButton.addEventListener('click', async () => {
        if(linkToken && publicToken) {
            // If tokens are available in cookies, redirect to a specific page
            window.location.href = "/index.html";
            return;
        }

        const response = await fetch('/api/create_link_token', { method: 'POST' });
        const data = await response.json();
        linkToken = data.link_token;

        if (!linkToken) {
            console.error('Link token is not set.');
            return;
        }

        const config = {
            token: linkToken,
            onSuccess: (public_token, metadata) => {
                publicToken = public_token;

                // Store tokens in cookies for future validation
                setCookie('linkToken', linkToken, 1);  // 1 denotes the number of days the cookie will be stored
                setCookie('publicToken', publicToken, 1);

                window.location.href = "/index.html";
            }
        };

        const plaid = Plaid.create(config);
        plaid.open();
    });
});
