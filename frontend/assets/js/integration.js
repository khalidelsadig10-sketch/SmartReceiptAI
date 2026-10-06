document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('integration-generate-key');
    const inputSysName = document.getElementById('integration-system-name');
    const inputOrgName = document.getElementById('integration-org-name');
    const inputApiKey = document.getElementById('integration-api-key');
    const statusDot = document.getElementById('integration-status-dot');
    const statusText = document.getElementById('integration-status-text');

    // Attempt to load token from localStorage, just in case auth is needed
    const token = localStorage.getItem('access_token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

    // Load existing integration
    fetch('/api/v1/integrations', { headers })
    .then(res => {
        if (!res.ok) throw new Error('Failed to load integrations');
        return res.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            // Load the most recently created one
            const integration = data[data.length - 1];
            inputSysName.value = integration.system_name;
            inputOrgName.value = integration.organization_name;
            inputApiKey.value = integration.api_key;
            statusDot.style.background = 'var(--color-success, #4caf50)';
            statusText.textContent = integration.status;
        }
    })
    .catch(err => console.error('Error loading integrations:', err));

    btnGenerate.addEventListener('click', () => {
        const sysName = inputSysName.value.trim();
        const orgName = inputOrgName.value.trim();

        if (!sysName || !orgName) {
            alert('Please enter both System Name and Organization Name.');
            return;
        }

        btnGenerate.disabled = true;
        btnGenerate.textContent = 'Generating...';

        const headersPost = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headersPost['Authorization'] = 'Bearer ' + token;
        }

        fetch('/api/v1/integrations', {
            method: 'POST',
            headers: headersPost,
            body: JSON.stringify({
                system_name: sysName,
                organization_name: orgName
            })
        })
        .then(res => {
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
            alert('Error generating integration.');
        })
        .finally(() => {
            btnGenerate.disabled = false;
            btnGenerate.textContent = 'Generate & Connect';
        });
    });
});
