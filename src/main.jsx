import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Code2,
  Database,
  Github,
  Globe2,
  Layers3,
  Mail,
  Server,
  Sparkles,
} from 'lucide-react';
import * as THREE from 'three';
import './styles.css';

const skills = [
  { icon: Code2, label: 'Frontend', text: 'React, TypeScript, accessible interfaces, responsive systems.' },
  { icon: Server, label: 'Backend', text: 'Node.js, APIs, auth, integrations, clean service boundaries.' },
  { icon: Database, label: 'Data', text: 'SQL, MongoDB, schema design, caching, dashboards.' },
  { icon: Layers3, label: 'Delivery', text: 'Git workflows, deployment, testing, performance tuning.' },
];

const projects = [
  {
    title: 'SaaS Command Center',
    tag: 'React / Node',
    text: 'Operational dashboard with role-based access, analytics cards, and API-backed workflows.',
  },
  {
    title: 'Commerce Platform',
    tag: 'Full Stack',
    text: 'Product catalog, checkout flow, admin tools, and inventory sync for growing stores.',
  },
  {
    title: 'Realtime Workspace',
    tag: 'WebSockets',
    text: 'Collaborative boards, live presence, and activity streams built for fast moving teams.',
  },
];

function PortfolioScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.55, 3);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      roughness: 0.34,
      metalness: 0.28,
      emissive: 0x08251d,
      emissiveIntensity: 0.4,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.72, 2),
      new THREE.MeshBasicMaterial({ color: 0xf4f1e8, wireframe: true, transparent: true, opacity: 0.32 }),
    );
    group.add(wire);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffb86b, transparent: true, opacity: 0.68 });
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(2.28, 0.018, 12, 160), ringMaterial),
      new THREE.Mesh(new THREE.TorusGeometry(2.78, 0.014, 12, 160), ringMaterial.clone()),
      new THREE.Mesh(new THREE.TorusGeometry(3.18, 0.012, 12, 160), ringMaterial.clone()),
    ];

    rings[0].rotation.x = Math.PI / 2.45;
    rings[1].rotation.y = Math.PI / 2.35;
    rings[2].rotation.x = Math.PI / 2.2;
    rings[2].rotation.z = Math.PI / 3.8;
    rings.forEach((ring) => group.add(ring));

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f1e8,
      roughness: 0.18,
      metalness: 0.2,
      emissive: 0x41301b,
      emissiveIntensity: 0.5,
    });
    const nodeGeometry = new THREE.SphereGeometry(0.09, 24, 24);
    const nodes = [];
    const nodePositions = [
      [-2.8, 0.8, 0.1],
      [2.3, -1.1, 0.2],
      [-1.8, -1.7, -0.3],
      [1.9, 1.55, 0.05],
      [0.25, 2.55, 0.18],
      [-0.35, -2.55, 0.15],
    ];

    nodePositions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      nodes.push(node);
      group.add(node);
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x9bd8ff, transparent: true, opacity: 0.28 });
    nodePositions.forEach((from, index) => {
      const to = nodePositions[(index + 2) % nodePositions.length];
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...from),
        new THREE.Vector3(...to),
      ]);
      group.add(new THREE.Line(geometry, lineMaterial));
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const mintLight = new THREE.PointLight(0x5eead4, 8, 10);
    mintLight.position.set(-3, 1.5, 3);
    scene.add(mintLight);
    const amberLight = new THREE.PointLight(0xffb86b, 6, 10);
    amberLight.position.set(3, -2, 4);
    scene.add(amberLight);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = elapsed * 0.18 + pointer.x * 0.18;
      group.rotation.x = Math.sin(elapsed * 0.5) * 0.08 + pointer.y * 0.12;
      core.rotation.y = elapsed * 0.36;
      wire.rotation.x = elapsed * 0.22;
      wire.rotation.z = elapsed * 0.18;
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.002 + index * 0.001;
      });
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 1.7 + index) * 0.18);
      });
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      coreGeometry.dispose();
      coreMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      ringMaterial.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return <div className="scene" ref={mountRef} aria-label="Interactive 3D developer network" />;
}

function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <nav className="nav" aria-label="Portfolio">
            <a href="#work">Work</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="intro">
            <p className="eyebrow">
              <Sparkles size={16} />
              Full Stack Developer
            </p>
            <h1 id="hero-title">Muhammad Umer</h1>
            <p className="lead">
              I build modern web products from polished React interfaces to reliable APIs, databases,
              and deployment-ready backend systems.
            </p>
            <div className="actions">
              <a className="button button--primary" href="mailto:muhammadumer@example.com">
                <Mail size={18} />
                Contact Me
              </a>
              <a className="button button--ghost" href="#work">
                <Globe2 size={18} />
                View Work
              </a>
            </div>
          </div>
        </div>
        <PortfolioScene />
      </section>

      <section className="section stats" aria-label="Highlights">
        <div>
          <strong>React</strong>
          <span>Interface Engineering</span>
        </div>
        <div>
          <strong>APIs</strong>
          <span>Backend Systems</span>
        </div>
        <div>
          <strong>Data</strong>
          <span>Storage and Insights</span>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section__header">
          <p className="eyebrow">Capabilities</p>
          <h2>Frontend polish with backend depth.</h2>
        </div>
        <div className="skill-grid">
          {skills.map(({ icon: Icon, label, text }) => (
            <article className="skill" key={label}>
              <Icon size={24} />
              <h3>{label}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="work">
        <div className="section__header">
          <p className="eyebrow">Selected Work</p>
          <h2>Systems shaped for real users and real maintenance.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project" key={project.title}>
              <span>{project.tag}</span>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
              <a href="#contact" aria-label={`Discuss ${project.title}`}>
                Discuss project
                <ArrowUpRight size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">Available For Work</p>
          <h2>Let’s build something useful, fast, and clean.</h2>
        </div>
        <div className="contact__links">
          <a className="button button--primary" href="mailto:muhammadumer@example.com">
            <Mail size={18} />
            Email Muhammad
          </a>
          <a className="button button--ghost" href="https://github.com/" target="_blank" rel="noreferrer">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
