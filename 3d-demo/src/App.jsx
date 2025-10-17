import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Terminal as TerminalIcon } from "lucide-react";

extend({ MeshLineGeometry, MeshLineMaterial });

const profileData = {
  name: "Anant Kumar Pandey",
  title: "Cybersecurity Enthusiast",
  email: "anant.pandey017@gmail.com",
  location: "Jharsuguda, IN",
  phone: "+91-9337056057",
  linkedin: "https://www.linkedin.com/in/anant-ku-pandey",
  github: "https://github.com/sh4dowkey",
  summary: "Proactive cybersecurity enthusiast with practical experience in vulnerability assessment, red-team techniques, and security automation.",
  skills: {
    cybersecurity: ["Red-team", "Pentesting", "Vuln Assessment", "Credential Harvesting", "Lateral Movement", "Kerberoasting", "OSINT", "Web Application Security", "Network Security", "Malware Analysis"],
    tools: ["Burp Suite", "Nmap", "Wireshark", "Metasploit", "Nessus", "BloodHound", "Shodan", "theHarvester", "Gobuster", "Hydra", "John the Ripper", "SQLMap"],
    programming: ["Python", "Go", "Bash", "Java", "C", "JavaScript", "PowerShell", "Assembly"],
    frameworks: ["OWASP Top 10", "MITRE ATT&CK", "NIST", "Linux", "Windows", "Active Directory"],
    specialties: ["Cloud Security", "Container Security", "API Security", "IoT Security"]
  },
  projects: [
    { name: "CrawlX", desc: "High-performance concurrent web crawler built in Go", tech: ["Go", "Concurrency"], url: "https://github.com/sh4dowkey/CrawlX" },
    { name: "AD Attack-Defense Lab", desc: "Complete Active Directory penetration testing environment", tech: ["AD", "BloodHound", "PowerShell"], url: "https://github.com/sh4dowkey/AD-Lab" },
    { name: "Python Web Crawler", desc: "OSINT reconnaissance and data gathering tool", tech: ["Python", "BeautifulSoup"], url: "https://github.com/sh4dowkey/CLI-Web-Crawler" },
  ],
  certs: ["Google Cybersecurity Professional", "EC-Council C|CT (In Progress)", "OWASP API Security Top 10"],
  exp: [
    { role: "Cybersecurity Certification", company: "Teachnook", period: "FEB-MAR 2025", items: ["Network scanning & enumeration", "Custom CLI web crawler development", "OWASP Top 10 vulnerability exploitation"] },
    { role: "Cybersecurity Intern", company: "AICTE-IBM SkillsBuild", period: "JAN-FEB 2025", items: ["Lateral movement detection in AD environments", "Security incident analysis", "Threat hunting & investigation"] }
  ],
};

const commands = {
  help: () => `╔════════════════════════════════════════╗
║         AVAILABLE COMMANDS             ║
╚════════════════════════════════════════╝

📋 INFORMATION
  help         Show this help message
  about        Bio & professional summary
  whoami       Current user information
  
🛠️ SKILLS & EXPERTISE  
  skills       All technical skills
  tools        Security tools arsenal
  languages    Programming languages
  frameworks   Frameworks & methodologies
  
💼 PROFESSIONAL
  experience   Work history
  projects     Featured projects
  certs        Certifications
  
📞 CONTACT & LINKS
  contact      Contact information
  github       Open GitHub profile
  linkedin     Open LinkedIn profile
  email        Send email
  
🎨 TERMINAL COMMANDS
  neofetch     System information
  cowsay       Wise cow with wisdom
  banner       ASCII art banner
  clear        Clear terminal
  
🎮 FUN COMMANDS
  joke         Cybersecurity joke
  quote        Security quote
  hack         Matrix animation
  
❌ EXIT
  exit         Close terminal (type twice)

💡 TIP: Use arrow keys for command history`,

  about: () => `╔════════════════════════════════════════╗
║           ABOUT ME                     ║
╚════════════════════════════════════════╝

👤 ${profileData.name}
🎯 ${profileData.title}
📍 ${profileData.location}

${profileData.summary}

I specialize in offensive security, with hands-on experience in
penetration testing, vulnerability assessment, and security automation.

🔍 Current Focus:
  • Advanced persistent threats (APT) simulation
  • Cloud security assessment
  • Red team operations
  • Security tool development`,

  whoami: () => `anantsec

You are: ${profileData.name}
Role: ${profileData.title}
Location: ${profileData.location}
Access Level: Root (Cybersecurity Professional)

"In the digital realm, I am the shield and the sword."`,

  skills: () => `╔════════════════════════════════════════╗
║       TECHNICAL SKILLS                 ║
╚════════════════════════════════════════╝

🛡️ CYBERSECURITY EXPERTISE
${profileData.skills.cybersecurity.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}

🔧 SECURITY TOOLS
${profileData.skills.tools.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}

💻 PROGRAMMING LANGUAGES
${profileData.skills.programming.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}

📚 FRAMEWORKS & STANDARDS
${profileData.skills.frameworks.map((s, i) => `   ${i + 1}. ${s}`).join('\n')}`,

  tools: () => `╔════════════════════════════════════════╗
║       SECURITY TOOLS ARSENAL           ║
╚════════════════════════════════════════╝

🔍 RECONNAISSANCE
   • Nmap - Network scanning
   • Shodan - Internet-wide scanning
   • theHarvester - OSINT gathering
   • Gobuster - Directory enumeration

🎯 EXPLOITATION
   • Metasploit - Exploitation framework
   • Burp Suite - Web app testing
   • SQLMap - SQL injection
   • Hydra - Password cracking

🕵️ POST-EXPLOITATION
   • BloodHound - AD analysis
   • Mimikatz - Credential extraction
   
🔐 DEFENSE & ANALYSIS
   • Wireshark - Network analysis
   • Nessus - Vulnerability scanning`,

  languages: () => `╔════════════════════════════════════════╗
║       PROGRAMMING LANGUAGES            ║
╚════════════════════════════════════════╝

🐍 Python         ████████████ Expert
   Security automation, tool development
   
🔵 Go             ██████████   Advanced
   High-performance tools
   
💻 Bash           ███████████  Expert
   System automation
   
☕ Java           ████████     Intermediate
   Application security
   
⚡ C              ████████     Intermediate
   System programming
   
🌐 JavaScript     ████████     Intermediate
   Web app testing`,

  frameworks: () => `╔════════════════════════════════════════╗
║    FRAMEWORKS & METHODOLOGIES          ║
╚════════════════════════════════════════╝

📋 SECURITY STANDARDS
   • OWASP Top 10 - Web application security
   • MITRE ATT&CK - Threat modeling
   • NIST Cybersecurity Framework
   
🖥️ OPERATING SYSTEMS
   • Kali Linux (Primary)
   • Parrot Security OS
   • Windows Server
   • Ubuntu/Debian`,

  projects: () => `╔════════════════════════════════════════╗
║       FEATURED PROJECTS                ║
╚════════════════════════════════════════╝

${profileData.projects.map((p, i) => `📁 [${i + 1}] ${p.name}
    ${p.desc}
    💻 Tech: ${p.tech.join(", ")}
    🔗 ${p.url}
`).join('\n')}`,

  experience: () => `╔════════════════════════════════════════╗
║       WORK EXPERIENCE                  ║
╚════════════════════════════════════════╝

${profileData.exp.map((e) => `🏢 ${e.role}
   ${e.company} | ${e.period}
   
   Responsibilities:
${e.items.map((item) => `   • ${item}`).join('\n')}
`).join('\n')}`,

  certs: () => `╔════════════════════════════════════════╗
║       CERTIFICATIONS                   ║
╚════════════════════════════════════════╝

${profileData.certs.map((c, i) => `📜 [${i + 1}] ${c}`).join('\n\n')}`,

  contact: () => `╔════════════════════════════════════════╗
║       CONTACT INFORMATION              ║
╚════════════════════════════════════════╝

📧 Email:    ${profileData.email}
📱 Phone:    ${profileData.phone}
🔗 LinkedIn: ${profileData.linkedin}
💻 GitHub:   ${profileData.github}
📍 Location: ${profileData.location}

💡 Tip: Use 'email' to compose a message
    Use 'github' or 'linkedin' to visit profiles`,

  github: () => {
    window.open(profileData.github, "_blank");
    return "🚀 Opening GitHub profile...";
  },

  linkedin: () => {
    window.open(profileData.linkedin, "_blank");
    return "🚀 Opening LinkedIn profile...";
  },

  email: () => {
    window.location.href = `mailto:${profileData.email}`;
    return `📧 Opening email client...`;
  },

  neofetch: () => `            ..,
          ..,,;;:::..                              anantsec@kali
        .,;;::::;;;;::,.                           ──────────────────
      ..,::;;;;;;;;;;;;:,..                        OS: Kali Linux 2025.1
    ..,::;;;;;;;;;;;;;;;;;;:,.                     Host: Portfolio Terminal
  ..,:::;;;;;;;;;;;;;;;;;;;;::,..                  Kernel: 6.6.9-custom-sec
.,::;;;;;;;;;;;;;;;;;;;;;;;;;;;;:,.                Uptime: ∞ (Always Learning)
:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:                Packages: 2847 (dpkg)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;.               Shell: zsh 5.9
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;.               Resolution: responsive@60Hz
:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:                DE: React + Three.js
.,::;;;;;;;;;;;;;;;;;;;;;;;;;;;;:,.                Theme: Kali Dark
  ..,:::;;;;;;;;;;;;;;;;;;;;::,..                  Terminal: anantsec-term
    ..,::;;;;;;;;;;;;;;;;;;:,.                     CPU: Neural Processing
      ..,::;;;;;;;;;;;;::,..                       GPU: WebGL 2.0
        .,;;::::;;;;::,.                           Memory: Optimized
          ..,,;;:::..                              
            ..,                                    

┌────────────────────────────────────────────────┐
│ 🔐 SECURITY STATUS                             │
│ ────────────────────────────────────────────── │
│ User: anantsec (root)                          │
│ Location: ${profileData.location}                            │
│ Status: 🟢 Active | Available                  │
│ Mode: Offensive Security                       │
└────────────────────────────────────────────────┘

💡 Try 'cowsay' for wisdom!`,

  cowsay: () => {
    const messages = [
      "Hack the planet!",
      "Security is a process, not a product.",
      "Stay curious. Stay ethical.",
      "There's no patch for human stupidity.",
      "Coffee + Code + Security = Life",
      "sudo make me a sandwich"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const len = msg.length;
    const top = " " + "_".repeat(len + 2);
    
    return `${top}
< ${msg} >
 ${"-".repeat(len + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||

           ~ anantsec ~`;
  },

  banner: () => `
   █████╗ ███╗   ██╗ █████╗ ███╗   ██╗████████╗███████╗███████╗ ██████╗
  ██╔══██╗████╗  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔════╝██╔════╝
  ███████║██╔██╗ ██║███████║██╔██╗ ██║   ██║   ███████╗█████╗  ██║     
  ██╔══██║██║╚██╗██║██╔══██║██║╚██╗██║   ██║   ╚════██║██╔══╝  ██║     
  ██║  ██║██║ ╚████║██║  ██║██║ ╚████║   ██║   ███████║███████╗╚██████╗
  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝ ╚═════╝
  
            [ Cybersecurity Portfolio Terminal ]
            "Security through knowledge"
               
  Type 'help' for available commands`,

  clear: () => "CLEAR",

  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛",
      "A SQL query walks into a bar...\n'Can I JOIN you?' 😄",
      "How many programmers does it take to change a light bulb?\nNone. It's a hardware problem. 💡",
      "Why did the hacker break up?\nToo many trust issues. 🔐",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  quote: () => {
    const quotes = [
      '"The only truly secure system is powered off." - Gene Spafford',
      '"Security is not a product, but a process." - Bruce Schneier',
      '"Hackers are breaking systems for profit." - Anonymous',
      '"In God we trust. All others we monitor." - NSA',
    ];
    return `💭 ${quotes[Math.floor(Math.random() * quotes.length)]}`;
  },

  hack: () => `Initializing hack sequence...
    
[████████████████████] 100%

ACCESS GRANTED
MAINFRAME BREACHED

Just kidding! This is a portfolio 😄
Type 'help' for real commands.`,
};

function Badge() {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={["#050508"]} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segProps = { type: "dynamic", canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  const { nodes, materials } = useGLTF("https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb");
  const frontTex = useTexture("/assets/front.png");
  const backTex = useTexture("/assets/back.png");
  const bandTexture = useTexture("/assets/band.png");
  const { width, height } = useThree((s) => s.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clamp = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clamp * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group position={[0, 0, 0]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))} onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh position={[0, 0, 0.011]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshPhysicalMaterial map={frontTex} transparent clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshPhysicalMaterial map={backTex} transparent clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <group scale={2.25} position={[0, -1.2, -0.05]}>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={bandTexture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}

function TypewriterText({ text, speed = 1, onComplete }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <>{displayText}</>;
}

function KaliTerm() {
  const [hist, setHist] = useState([
    { type: "sys", txt: "┌──(anantsec㉿kali)-[~]\n└─$ Welcome to anantsec terminal", animated: false },
    { type: "sys", txt: 'Type "help" or "neofetch" for info', animated: false },
  ]);
  const [inp, setInp] = useState("");
  const [exitCount, setExitCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [hist]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    
    const key = cmd.toLowerCase();
    const newH = [...hist, { type: "inp", txt: `┌──(anantsec㉿kali)-[~]\n└─$ ${cmd}`, animated: false }];

    setCmdHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (key === "exit") {
      if (exitCount === 0) {
        newH.push({
          type: "out",
          txt: `⚠️  Nice try! You can't escape that easily 😄\n\n💡 Use "clear" to clear terminal\n💡 Type "exit" again to leave`,
          animated: true
        });
        setExitCount(1);
        setHist(newH);
        setInp("");
        return;
      } else {
        newH.push({ 
          type: "out", 
          txt: "👋 Goodbye! Redirecting...", 
          animated: true 
        });
        setHist(newH);
        setTimeout(() => {
          window.location.href = "https://anantsec.netlify.app";
        }, 2000);
        return;
      }
    }

    if (exitCount > 0) setExitCount(0);

    if (commands[key]) {
      const out = commands[key]();
      if (out === "CLEAR") {
        setHist([{ type: "sys", txt: "┌──(anantsec㉿kali)-[~]\n└─$ Terminal cleared", animated: false }]);
        setInp("");
        return;
      }
      newH.push({ type: "out", txt: out, animated: true });
      setIsTyping(true);
    } else {
      newH.push({ type: "err", txt: `bash: ${cmd}: command not found\n\n💡 Type 'help' for available commands`, animated: true });
      setIsTyping(true);
    }
    
    setHist(newH);
    setInp("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isTyping) run(inp);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInp(cmdHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInp("");
        } else {
          setHistoryIndex(newIndex);
          setInp(cmdHistory[newIndex]);
        }
      }
    }
  };

  const quickCommands = ["help", "neofetch", "about", "skills", "projects", "contact", "cowsay"];

  return (
    <div style={{ 
      backgroundImage: "linear-gradient(rgba(5, 8, 12, 0.96), rgba(8, 10, 14, 0.98)), url(/assets/kali-dragon.png)", 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat", 
      backgroundBlendMode: "overlay", 
      borderRadius: "8px", 
      overflow: "hidden", 
      border: "1px solid #1a1a1a", 
      boxShadow: "0 12px 48px rgba(0,0,0,0.9)", 
      fontFamily: '"Fira Code", monospace', 
      color: "#d4d4d4", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      <div style={{ 
        background: "linear-gradient(180deg, #1a1a1a, #0d0d0d)", 
        padding: "8px 12px", 
        borderBottom: "1px solid #222", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <TerminalIcon size={14} color="#6dd4ff" />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#6dd4ff" }}>anantsec@kali: ~</span>
      </div>

      <div 
        className="terminal-body" 
        style={{ 
          flex: 1, 
          padding: "16px", 
          overflow: "auto", 
          fontSize: "13px", 
          lineHeight: "1.6", 
          whiteSpace: "pre-wrap", 
          background: "rgba(5, 8, 12, 0.7)",
          wordBreak: "break-word"
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {hist.map((e, i) => {
          const col = e.type === "inp" ? "#6dd4ff" : e.type === "err" ? "#ff6b6b" : e.type === "out" ? "#e0e0e0" : "#9ed6ff";
          return (
            <div key={i} style={{ color: col, marginBottom: "12px" }}>
              {e.animated && i === hist.length - 1 ? (
                <TypewriterText 
                  text={e.txt} 
                  speed={1} 
                  onComplete={() => setIsTyping(false)}
                />
              ) : (
                e.txt
              )}
            </div>
          );
        })}

        <div style={{ 
          display: "flex", 
          gap: "8px", 
          alignItems: "flex-start", 
          marginTop: "16px",
          flexWrap: "wrap"
        }}>
          <span style={{ 
            color: "#6dd4ff", 
            fontWeight: 700, 
            whiteSpace: "pre",
            minWidth: "fit-content"
          }}>
            ┌──(anantsec㉿kali)-[~]{"\n"}└─$
          </span>
          <input
            ref={inputRef}
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command..."
            autoComplete="off"
            spellCheck="false"
            disabled={isTyping}
            style={{ 
              flex: 1, 
              background: "transparent", 
              border: "none", 
              outline: "none", 
              color: "#d4d4d4", 
              fontFamily: "inherit", 
              fontSize: "inherit", 
              padding: "4px", 
              caretColor: "#6dd4ff",
              minWidth: "200px"
            }}
          />
        </div>

        <div style={{ 
          display: "flex", 
          gap: "8px", 
          flexWrap: "wrap", 
          marginTop: "16px", 
          paddingTop: "12px", 
          borderTop: "1px dashed #333" 
        }}>
          {quickCommands.map((s) => (
            <button
              key={s}
              onClick={() => !isTyping && run(s)}
              disabled={isTyping}
              style={{ 
                background: "rgba(109, 212, 255, 0.1)", 
                border: "1px solid rgba(109, 212, 255, 0.3)", 
                color: "#6dd4ff", 
                padding: "6px 12px", 
                borderRadius: "4px", 
                cursor: isTyping ? "not-allowed" : "pointer", 
                fontSize: "11px", 
                fontFamily: "inherit", 
                transition: "all 0.2s",
                opacity: isTyping ? 0.5 : 1
              }}
              onMouseEnter={(e) => !isTyping && (e.target.style.background = "rgba(109, 212, 255, 0.2)")}
              onMouseLeave={(e) => (e.target.style.background = "rgba(109, 212, 255, 0.1)")}
            >
              {s}
            </button>
          ))}
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100%", background: "#050505", display: "grid", gridTemplateColumns: "42% 58%", gap: 0, overflow: "hidden" }} className="main-grid">
      <div className="badge-panel" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(180deg, rgba(6,8,10,1), rgba(4,6,8,1))", 
        padding: 0, 
        margin: 0, 
        overflow: "hidden", 
        width: "100%", 
        height: "100%" 
      }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Badge />
        </div>
      </div>

      <div className="right-panel" style={{ 
        padding: "28px", 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh", 
        overflow: "hidden" 
      }}>
        <KaliTerm />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body, html, #root {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(109,212,255,0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(109,212,255,0.5);
        }
        
        /* Tablet Responsiveness */
        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 45vh 55vh !important;
          }
          
          .badge-panel {
            height: 45vh !important;
          }
          
          .right-panel {
            padding: 20px !important;
            height: 55vh !important;
          }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 40vh 60vh !important;
            height: 100vh !important;
          }
          
          .badge-panel {
            height: 40vh !important;
            min-height: 300px;
          }
          
          .right-panel {
            padding: 12px !important;
            height: 60vh !important;
          }
          
          .terminal-body {
            font-size: 11px !important;
            padding: 12px !important;
          }
          
          .terminal-body input {
            font-size: 11px !important;
          }
          
          .terminal-body button {
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
        }
        
        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .main-grid {
            grid-template-rows: 35vh 65vh !important;
          }
          
          .badge-panel {
            height: 35vh !important;
            min-height: 250px;
          }
          
          .right-panel {
            padding: 8px !important;
            height: 65vh !important;
          }
          
          .terminal-body {
            font-size: 10px !important;
            padding: 8px !important;
          }
        }
        
        /* Landscape Mobile */
        @media (max-width: 968px) and (orientation: landscape) {
          .main-grid {
            grid-template-columns: 45% 55% !important;
            grid-template-rows: 1fr !important;
          }
          
          .badge-panel {
            height: 100vh !important;
          }
          
          .right-panel {
            height: 100vh !important;
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}