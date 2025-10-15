import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Terminal } from "lucide-react";

extend({ MeshLineGeometry, MeshLineMaterial });

const profileData = {
  name: "Anant Kumar Pandey",
  title: "Cybersecurity Enthusiast",
  email: "anant.pandey017@gmail.com",
  location: "Jharsuguda, IN",
  phone: "+91-9337056057",
  linkedin: "https://www.linkedin.com/in/anant-ku-pandey",
  github: "https://github.com/sh4dowkey",
  summary:
    "Proactive cybersecurity enthusiast with practical experience in vulnerability assessment, red-team techniques, and security automation.",
  skills: {
    cybersecurity: [
      "Red-team",
      "Pentesting",
      "Vuln Assessment",
      "Credential Harvesting",
      "Lateral Movement",
      "Kerberoasting",
      "OSINT",
    ],
    tools: [
      "Burp Suite",
      "Nmap",
      "Wireshark",
      "Metasploit",
      "Nessus",
      "BloodHound",
      "Shodan",
      "theHarvester",
      "Gobuster",
    ],
    programming: ["Python", "Go", "Bash", "Java", "C", "JavaScript"],
    frameworks: ["OWASP Top 10", "MITRE ATT&CK", "Linux"],
  },
  projects: [
    {
      name: "CrawlX",
      desc: "Go concurrent web crawler",
      tech: ["Go"],
      url: "https://github.com/sh4dowkey/CrawlX",
    },
    {
      name: "AD Attack-Defense Lab",
      desc: "Full AD lab for security practice",
      tech: ["AD", "BloodHound"],
      url: "https://github.com/sh4dowkey/AD-Lab",
    },
    {
      name: "Python Web Crawler",
      desc: "OSINT reconnaissance tool",
      tech: ["Python"],
      url: "https://github.com/sh4dowkey/CLI-Web-Crawler",
    },
  ],
  certs: [
    "Google Cybersecurity",
    "EC-Council C|CT (Progress)",
    "OWASP API Security",
  ],
  exp: [
    {
      role: "Cyber Cert",
      company: "Teachnook",
      period: "FEB-MAR 2025",
      items: ["Network scanning", "CLI crawler", "OWASP exploitation"],
    },
    {
      role: "Cyber Cert",
      company: "AICTE-IBM",
      period: "JAN-FEB 2025",
      items: ["Lateral movement detection", "Security reports"],
    },
  ],
};

const commands = {
  help: () =>
    `Available commands:
  help       - Show commands
  about      - Bio & summary
  skills     - Technical skills
  projects   - Featured projects
  experience - Work history
  certs      - Certifications
  contact    - Contact info
  github     - Open GitHub
  linkedin   - Open LinkedIn
  neofetch   - System info
  clear      - Clear terminal
  exit       - Exit the terminal (Just kidding.....)`,
  about: () => profileData.summary,
  skills: () => {
    let o =
      "╔═══════════════════════════╗\n║    TECHNICAL SKILLS       ║\n╚═══════════════════════════╝\n\n";
    o +=
      "┌─ Cybersecurity\n" +
      profileData.skills.cybersecurity.map((s) => `│  • ${s}`).join("\n") +
      "\n\n";
    o +=
      "┌─ Tools\n" +
      profileData.skills.tools.map((s) => `│  • ${s}`).join("\n") +
      "\n\n";
    o +=
      "┌─ Programming\n" +
      profileData.skills.programming.map((s) => `│  • ${s}`).join("\n");
    return o;
  },
  projects: () => {
    let o =
      "╔═══════════════════════════╗\n║        PROJECTS           ║\n╚═══════════════════════════╝\n\n";
    profileData.projects.forEach((p, i) => {
      o += `[${i + 1}] ${p.name}\n    ${p.desc}\n    Tech: ${p.tech.join(
        ", "
      )}\n    └─> ${p.url}\n\n`;
    });
    return o;
  },
  experience: () => {
    let o =
      "╔═══════════════════════════╗\n║       EXPERIENCE          ║\n╚═══════════════════════════╝\n\n";
    profileData.exp.forEach((e) => {
      o += `▸ ${e.role} — ${e.company} (${e.period})\n`;
      e.items.forEach((h) => (o += `  • ${h}\n`));
      o += "\n";
    });
    return o;
  },
  certs: () =>
    "╔═══════════════════════════╗\n║     CERTIFICATIONS        ║\n╚═══════════════════════════╝\n\n" +
    profileData.certs.map((c, i) => `[${i + 1}] ${c}`).join("\n"),
  contact: () =>
    `╔═══════════════════════════╗\n║      CONTACT INFO         ║\n╚═══════════════════════════╝\n\nEmail:    ${profileData.email}\nPhone:    ${profileData.phone}\nLinkedIn: ${profileData.linkedin}\nGitHub:   ${profileData.github}`,
  github: () => {
    window.open(profileData.github, "_blank");
    return "→ Opening GitHub...";
  },
  linkedin: () => {
    window.open(profileData.linkedin, "_blank");
    return "→ Opening LinkedIn...";
  },
  neofetch: () =>
    `            ..,
          ..,,;;:::..                              anantsec@kali
        .,;;::::;;;;::,.                           ─────────────
      ..,::;;;;;;;;;;;;:,..                        OS: Kali Linux
    ..,::;;;;;;;;;;;;;;;;;;:,.                     Host: Portfolio Terminal
  ..,:::;;;;;;;;;;;;;;;;;;;;::,..                  Kernel: 6.x-custom
.,::;;;;;;;;;;;;;;;;;;;;;;;;;;;;:,.                Uptime: ∞ learning
:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:                Shell: zsh 5.9
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;.               Resolution: responsive
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;.               DE: React + Three.js
:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:                Theme: Kali Dark
.,::;;;;;;;;;;;;;;;;;;;;;;;;;;;;:,.                Terminal: custom
  ..,:::;;;;;;;;;;;;;;;;;;;;::,..
    ..,::;;;;;;;;;;;;;;;;;;:,.                     User: anantsec
      ..,::;;;;;;;;;;;;::,..                       Location: ${profileData.location}
        .,;;::::;;;;::,.                           Status: Open to work
          ..,,;;:::..
            ..,`,
  clear: () => "CLEAR",
};

function Badge() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={["#050508"]} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]}/>
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]}/>
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]}/>
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]}/>
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
  const [curve] = useState(() => new THREE.CatmullRomCurve3([ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ]));
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

function KaliTerm() {
  const [hist, setHist] = useState([
    { type: "sys", txt: "┌──(anantsec㉿kali)-[~]\n└─$ Welcome to anantsec terminal" },
    { type: "sys", txt: 'Type "help" for commands or "neofetch" for info' },
  ]);
  const [inp, setInp] = useState("");
  const [exitCount, setExitCount] = useState(0); // State re-added
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [hist]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const key = cmd.toLowerCase();
    const newH = [...hist, { type: "inp", txt: `┌──(anantsec㉿kali)-[~]\n└─$ ${cmd}` }];

    // Special logic for the two-step exit
    if (key === "exit") {
      if (exitCount === 0) {
        newH.push({
          type: "out",
          txt: `Nice try! You can't escape cybersecurity that easily. 😄\nUse "clear" to clear the terminal, or type "exit" again to leave.`,
        });
        setExitCount(1);
        setHist(newH);
        setInp("");
        return;
      } else {
        newH.push({ type: "out", txt: "Goodbye! Redirecting to main site..." });
        setHist(newH);
        window.location.href = "https://anantsec.netlify.app";
        return;
      }
    }

    if (commands[key]) {
      const out = commands[key]();
      if (out === "CLEAR") {
        setHist([{ type: "sys", txt: "┌──(anantsec㉿kali)-[~]\n└─$ Terminal cleared" }]);
        setInp("");
        setExitCount(0); // Reset the exit counter on clear
        return;
      }
      newH.push({ type: "out", txt: out });
    } else {
      newH.push({ type: "err", txt: `bash: ${cmd}: command not found` });
    }
    setHist(newH);
    setInp("");
  };

  const sug = ["help", "neofetch", "about", "skills", "projects", "contact"];
  return (
    <div style={{ backgroundImage: "linear-gradient(rgba(5, 8, 12, 0.96), rgba(8, 10, 14, 0.98)), url(/assets/kali-dragon.png)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundBlendMode: "overlay", borderRadius: "8px", overflow: "hidden", border: "1px solid #1a1a1a", boxShadow: "0 12px 48px rgba(0,0,0,0.9)", fontFamily: '"Fira Code", monospace', color: "#d4d4d4", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(180deg, #1a1a1a, #0d0d0d)", padding: "8px 12px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <Terminal size={14} color="#6dd4ff" />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#6dd4ff" }}>anantsec@kali: ~</span>
      </div>
      <div className="terminal-body" style={{ flex: 1, padding: "16px", overflow: "auto", fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", background: "rgba(5, 8, 12, 0.7)" }}>
        {hist.map((e, i) => {
          const col = e.type === "inp" ? "#6dd4ff" : e.type === "err" ? "#ff6b6b" : e.type === "out" ? "#e0e0e0" : "#9ed6ff";
          return <div key={i} style={{ color: col, marginBottom: "12px" }}>{e.txt}</div>;
        })}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "16px" }}>
          <span style={{ color: "#6dd4ff", fontWeight: 700, whiteSpace: "nowrap" }}>┌──(anantsec㉿kali)-[~]{"\n"}└─$</span>
          <input value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), run(inp))} placeholder="Type command..." autoComplete="off" spellCheck="false" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#d4d4d4", fontFamily: "inherit", fontSize: "inherit", padding: "4px", caretColor: "#6dd4ff" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #333" }}>
          {sug.map((s) => (
            <button key={s} onClick={() => run(s)} style={{ background: "rgba(109, 212, 255, 0.1)", border: "1px solid rgba(109, 212, 255, 0.3)", color: "#6dd4ff", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => (e.target.style.background = "rgba(109, 212, 255, 0.2)")} onMouseLeave={(e) => (e.target.style.background = "rgba(109, 212, 255, 0.1)")}>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, rgba(6,8,10,1), rgba(4,6,8,1))", padding: 0, margin: 0, overflow: "hidden", width: "100%", height: "100%" }}>
        <div style={{ width: "100%", height: "100%" }}><Badge /></div>
      </div>
      <div className="right-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <KaliTerm />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body, html, #root { margin: 0; padding: 0; overflow: hidden; }
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:rgba(0,0,0,0.3)}
        ::-webkit-scrollbar-thumb{background:rgba(109,212,255,0.3);border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(109,212,255,0.5)}
        
        @media(max-width:968px){
          .main-grid{
            grid-template-columns:1fr!important;
            grid-template-rows:40vh 60vh!important;
            height: 100vh!important;
          }
          
          .right-panel {
            padding: 12px !important;
          }
          .terminal-body {
            word-break: break-all;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}