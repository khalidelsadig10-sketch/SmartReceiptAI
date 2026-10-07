document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('integration-generate-key');
    const inputSysName = document.getElementById('integration-system-name');
    const inputOrgName = document.getElementById('integration-org-name');
    const inputApiKey = document.getElementById('integration-api-key');
    const statusDot = document.getElementById('integration-status-dot');
    const statusText = document.getElementById('integration-status-text');
    const section = document.getElementById('integration-section');

    // Hide integration section by default until we confirm admin role
    if (section) section.style.display = 'none';

    const token = localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

    // Step 1: Check if the current user is an admin
    fetch('/api/v1/auth/me', { credentials: 'include', headers })
    .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
    })
    .then(user => {
        if (!user || user.role !== 'admin') {
            // Not an admin — keep section hidden, nothing more to do
            return;
        }

        // User is admin — show the section
        if (section) section.style.display = '';

        // Step 2: Load existing integration settings
        fetch('/api/v1/integrations', { credentials: 'include', headers })
        .then(res => {
            if (!res.ok) throw new Error('Failed to load integrations');
            return res.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                const integration = data[data.length - 1];
                inputSysName.value = integration.system_name;
                inputOrgName.value = integration.organization_name;
                inputApiKey.value = integration.api_key;
                statusDot.style.background = 'var(--color-success, #4caf50)';
                statusText.textContent = integration.status;
            }
        })
        .catch(err => console.error('Error loading integrations:', err));

        // Step 3: Handle "Generate & Connect" button
        btnGenerate.addEventListener('click', () => {
            const sysName = inputSysName.value.trim();
            const orgName = inputOrgName.value.trim();

            if (!sysName || !orgName) {
                alert('Please enter both System Name and Organization Name.');
                return;
            }

            btnGenerate.disabled = true;
            btnGenerate.textContent = 'Generating...';

            const headersPost = { 'Content-Type': 'application/json' };
            if (token) headersPost['Authorization'] = 'Bearer ' + token;

            fetch('/api/v1/integrations', {
                method: 'POST',
                credentials: 'include',
                headers: headersPost,
                body: JSON.stringify({
                    system_name: sysName,
                    organization_name: orgName
                })
            })
            .then(res => {
                if (res.status === 403) throw new Error('Admin access required.');
                if (!res.ok) throw new Error('Failed to generate integration');
                return res.json();
            })
            .then(data => {
                inputApiKey.value = data.api_key;
                statusDot.style.background = 'var(--color-success, #4caf50)';
                statusText.textContent = data.status;
                alert('Integration configured successfully! You can now use the API Key.');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Error: ' + err.message);
            })
            .finally(() => {
                btnGenerate.disabled = false;
                btnGenerate.textContent = 'Generate & Connect';
            });
        });
    })
    .catch(err => {
        // Not logged in or error — keep section hidden
        console.error('Auth check failed:', err);
    });
});

