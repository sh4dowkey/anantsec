// === ADD TO TOP OF assets/js/about.js ===

// Sanitize user input to prevent XSS
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// THEN MODIFY the existing event listener:
terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const rawCommand = terminalInput.value.trim();
        const command = sanitizeInput(rawCommand).toLowerCase(); // SANITIZE HERE
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">></span> ${sanitizeInput(rawCommand)}`; // SANITIZE HERE TOO
        terminalOutput.appendChild(line);

        if (command === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (commands[command]) {
            const response = document.createElement('div');
            response.className = 'terminal-line';
            response.style.whiteSpace = 'pre-wrap';
            response.textContent = commands[command];
            terminalOutput.appendChild(response);
        } else if (command) {
            const error = document.createElement('div');
            error.className = 'terminal-line';
            error.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
            terminalOutput.appendChild(error);
        }

        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});







const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: `Available commands:
about      - About me
skills     - Technical skills
projects   - Current projects
contact    - Contact information
experience - Work & learning experience
tools      - Tools I use
clear      - Clear terminal
whoami     - Display user info
ls         - List sections
cat resume - View resume summary
date       - Current date`,

    about: `Anant Kumar Pandey - Cybersecurity Enthusiast

I'm a passionate cybersecurity learner currently diving deep into:
• Active Directory Attacks & Exploitation
• Bug Bounty Hunting & Web Security
• Red Team Operations & Penetration Testing
• CTF Challenges & Security Research

This portfolio contains my writeups, notes, and projects as I learn
and explore the fascinating world of cybersecurity.`,

    skills: `Technical Skills:

Security:
• Penetration Testing & Vulnerability Assessment
• Active Directory Security
• Web Application Security (OWASP Top 10)
• Network Security & Analysis
• OSINT & Reconnaissance

Tools & Frameworks:
• Burp Suite, Metasploit, Nmap
• Wireshark, tcpdump
• PowerShell, Bash scripting
• Python for security automation
• And more...........`,

    projects: `Current Projects:

1. Hack The Box Writeups
- Detailed machine walkthroughs
- Exploitation techniques documentation

2. Bug Bounty Research
- Real-world vulnerability hunting
- Responsible disclosure writeups

3. Security Notes Repository
- Personal study notes on various topics
- Cheat sheets and reference materials

4. Red Team Lab Setup
- Building Active Directory attack lab
- Practicing privilege escalation techniques

For more infromation please visit my Github(@sh4dowjkey) and linkedin`,

    contact: `Contact Information:

📧 Email:    anant.pandey017@gmail.com
🐙 GitHub:   github.com/sh4dowkey
💼 LinkedIn: linkedin.com/in/anant-ku-pandey

Feel free to reach out for:
• Collaborations on security projects
• Knowledge sharing & discussions
• Bug bounty tips & tricks
• General cybersecurity conversations`,

    experience: `Experience & Learning:

📚 Certifications:
• Google Cybersecurity Professional
• Various Job Simulations (TATA, Datacom, Deloitte, Mastercard)
• OWASP API Security Top 10

🎯 Practice Platforms:
• Hack The Box - Active learner
• TryHackMe - Completed rooms
• Bug Bounty Programs - Research & submissions
• LeetCode - 100 Days Badge

🔬 Currently Learning:
• Advanced Active Directory attacks
• Privilege escalation techniques
• Web application pentesting
• Red team operations`,

    tools: `Security Tools Arsenal:

Reconnaissance:
• Nmap, Masscan, Rustscan
• Subfinder, Amass, Sublist3r
• Gobuster, Feroxbuster, ffuf

Exploitation:
• Metasploit Framework
• Burp Suite Professional
• SQLmap, XSStrike
• BloodHound, SharpHound

Post-Exploitation:
• PowerShell Empire
• Mimikatz, Rubeus
• Impacket toolkit
• Various privesc scripts

Analysis:
• Wireshark, tcpdump
• Volatility (Memory forensics)
• Ghidra, IDA (Reverse engineering)`,

    whoami: `anant@cybersec:~$ whoami
anant

Current Status: Learning & Exploring Cybersecurity
Mode: Always curious, always learning
Interests: Breaking things (ethically) & securing systems
Goal: Become a skilled security professional`,

    ls: `total 5
drwxr-xr-x  2 anant users 4096 Jan 10 2025 about.html
drwxr-xr-x  2 anant users 4096 Jan 10 2025 notes.html
drwxr-xr-x  2 anant users 4096 Jan 10 2025 resume.html
drwxr-xr-x  2 anant users 4096 Jan 10 2025 certificates.html
drwxr-xr-x  2 anant users 4096 Jan 10 2025 writeups.html`,

    'cat resume': `Resume Summary
===============

Name: Anant Kumar Pandey
Role: Cybersecurity Enthusiast
Location: Chennai, Tamil Nadu, IN

Core Competencies:
→ Penetration Testing
→ Active Directory Security
→ Web Application Security
→ Bug Bounty Hunting

Education & Certifications:
→ Google Cybersecurity Professional
→ Multiple Job Simulations
→ OWASP API Security

For full resume: visit /resume.html`,

    date: new Date().toString(),

    clear: 'CLEAR'
};

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">></span> ${terminalInput.value}`;
        terminalOutput.appendChild(line);

        if (command === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (commands[command]) {
            const response = document.createElement('div');
            response.className = 'terminal-line';
            response.style.whiteSpace = 'pre-wrap';
            response.textContent = commands[command];
            terminalOutput.appendChild(response);
        } else if (command) {
            const error = document.createElement('div');
            error.className = 'terminal-line';
            error.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
            terminalOutput.appendChild(error);
        }

        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});