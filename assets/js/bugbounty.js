fetch("../data/bugbounty.json")
    .then(res => res.json())
    .then(data => {
        const wrapper = document.getElementById("bugbounty-wrapper");
        data.forEach(post => {
            const entry = document.createElement("div");
            entry.className = "writeup-entry";
            entry.innerHTML = `
    <a href="../view.html?type=bugbounty&file=${encodeURIComponent(post.file)}">${post.name}</a>
    <span class="writeup-date">${post.date}</span>
    `;
            wrapper.appendChild(entry);
        });
    })
    .catch(err => {
        document.getElementById("bugbounty-wrapper").innerHTML =
            "<p style='color: #888;'>⚠️ Failed to load bug bounty writeups.</p>";
        console.error(err);
    });