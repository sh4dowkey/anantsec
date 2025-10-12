const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const file = urlParams.get('file');

const contentDiv = document.getElementById('content');

if (!type || !file) {
    contentDiv.innerHTML = '<p style="color: #888;">❌ Invalid file path.</p>';
} else {
    fetch(`./posts/${type}/${file}`)
        .then(res => {
            if (!res.ok) throw new Error('File not found');
            return res.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            contentDiv.innerHTML = '<p style="color: #888;">⚠️ Failed to load the writeup.</p>';
        });
}


function goBack(e) {
    e.preventDefault(); // prevent default link
    if (document.referrer) {
        // if user came from another page
        window.history.back();
    } else {
        // fallback to a default page
        window.location.href = 'writeups.html';
    }
}