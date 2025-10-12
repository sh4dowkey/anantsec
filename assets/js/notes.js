fetch('data/notes.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('notes-container');

    if (data.length === 0) {
      container.innerHTML = "<p>No notes available yet.</p>";
      return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('notes-list');

    data.forEach(note => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${note.url}" target="_blank" download>
          📄 ${note.name}
        </a>
      `;
      ul.appendChild(li);
    });

    container.appendChild(ul);
  })
  .catch(error => {
    console.error("Error loading notes:", error);
    document.getElementById('notes-container').innerHTML = "<p>Error loading notes.</p>";
  });





fetch("data/notes.json")
  .then(res => res.json())
  .then(data => {
    const grouped = {};
    data.forEach(note => {
      const year = new Date(note.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(note);
    });

    const wrapper = document.getElementById("notes-wrapper");
    Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
      const group = document.createElement("div");
      group.className = "notes-group";
      group.innerHTML = `<h2>${year}</h2>`;

      grouped[year].forEach(note => {
        const entry = document.createElement("div");
        entry.className = "note-entry";
        entry.innerHTML = `
            <a href="${note.url}" download>${note.name}</a>
            <span class="note-date">${note.date}</span>
          `;
        group.appendChild(entry);
      });

      wrapper.appendChild(group);
    });
  })
  .catch(err => {
    document.getElementById("notes-wrapper").innerHTML =
      "<p style='color: #888;'>⚠️ Failed to load notes.</p>";
    console.error(err);
  });
