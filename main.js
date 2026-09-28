/* =========================================
MACAANSHE - Premium Restaurant Website
========================================= */

document.addEventListener('DOMContentLoaded', () => {

// --- 1. Loading Screen ---
const loader = document.getElementById('loader');

// Fallback: Always hide the loader after 2.5 seconds, even if images are slow
setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal animation after loader fades
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 200);
        });
    }, 300);
}, 2500); // 2.5 seconds loading time

// --- 2. Custom Cursor ---
const cursor = document.getElementById('cursor');
const hoverElements = document.querySelectorAll('a, button, .menu-item, .service-card, .testimonial-card, input, textarea');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
});

function animateCursor() {
// Lerp for smooth cursor movement
cursorX += (mouseX - cursorX) * 0.15;
cursorY += (mouseY - cursorY) * 0.15;

cursor.style.left = `${cursorX}px`; 
cursor.style.top = `${cursorY}px`;

requestAnimationFrame(animateCursor);
}
animateCursor();

hoverElements.forEach(el => {
el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// --- 3. Navigation ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
if (window.scrollY > 50) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
updateActiveLink();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('active');
navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
link.addEventListener('click', () => {
hamburger.classList.remove('active');
navLinks.classList.remove('active');
});
});

// Active link highlighting
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
let current = '';
sections.forEach(section => {
const sectionTop = section.offsetTop;
const sectionHeight = section.clientHeight;
if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
current = section.getAttribute('id');
}
});

navLinkItems.forEach(link => {
link.classList.remove('active');
if (link.getAttribute('href').substring(1) === current) {
link.classList.add('active');
}
});
}

// --- 4. Scroll Reveal (IntersectionObserver) ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('active');
// Optional: unobserve after revealing to improve performance
// revealObserver.unobserve(entry.target);
}
});
}, {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- 5. Form Validation ---
const form = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
e.preventDefault();

let isValid = true;
const inputs = form.querySelectorAll('input[required]');

inputs.forEach(input => {
const formGroup = input.closest('.form-group');

if (!input.value.trim()) {
formGroup.classList.add('error');
isValid = false;
} else {
formGroup.classList.remove('error');
}

// Email specific validation
if (input.type === 'email' && input.value.trim()) {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
if (!emailRegex.test(input.value)) {
formGroup.classList.add('error');
isValid = false;
}
}
});

if (isValid) {
form.style.display = 'none';
formSuccess.classList.add('active');
}
});

// Remove error on input
form.querySelectorAll('input, textarea').forEach(input => {
input.addEventListener('input', () => {
input.closest('.form-group').classList.remove('error');
});
});

// --- 6. Three.js Hero Particles ---
const canvasContainer = document.getElementById('hero-canvas');

if (canvasContainer && window.THREE) {
initThreeJS();
}

function initThreeJS() {
// Detect mobile for performance optimization
const isMobile = window.innerWidth < 768;

// 1. Scene Setup
const scene = new THREE.Scene();
// Transparent background
scene.background = null;

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({
alpha: true,
antialias: !isMobile
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
canvasContainer.appendChild(renderer.domElement);

// 4. Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isMobile ? 400 : 1200;

const posArray = new Float32Array(particlesCount * 3);
const randomArray = new Float32Array(particlesCount); // For varied movement

for (let i = 0; i < particlesCount * 3; i++) {
// Spread particles across a wide 3D space
posArray[i] = (Math.random() - 0.5) * 20;
if (i % 3 === 0) {
randomArray[i / 3] = Math.random();
}
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// 5. Material
const particlesMaterial = new THREE.PointsMaterial({
size: 0.03,
color: 0xB7A65A, // Gold color
transparent: true,
opacity: 0.6,
blending: THREE.AdditiveBlending,
depthWrite: false
});

// 6. Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 7. Mouse Interaction (Parallax)
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
mouseX = (event.clientX - windowHalfX);
mouseY = (event.clientY - windowHalfY);
});

// Touch support for mobile
document.addEventListener('touchmove', (event) => {
if (event.touches.length > 0) {
mouseX = (event.touches[0].clientX - windowHalfX);
mouseY = (event.touches[0].clientY - windowHalfY);
}
}, { passive: true });

// 8. Animation Loop
const clock = new THREE.Clock();

function animate() {
requestAnimationFrame(animate);

const elapsedTime = clock.getElapsedTime();

// Smooth mouse parallax
targetX += (mouseX * 0.001 - targetX) * 0.05;
targetY += (mouseY * 0.001 - targetY) * 0.05;

// Subtle camera movement
camera.position.x = targetX;
camera.position.y = -targetY;
camera.lookAt(scene.position);

// Slow rotation of particle field
particlesMesh.rotation.y = elapsedTime * 0.05;
particlesMesh.rotation.x = elapsedTime * 0.02;

// Subtle floating movement for particles
const positions = particlesGeometry.attributes.position.array;
for (let i = 0; i < particlesCount; i++) {
const i3 = i * 3;
// Move particles up and down slowly based on their random value
positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + randomArray[i]) * 0.002;
}
particlesGeometry.attributes.position.needsUpdate = true;

renderer.render(scene, camera);
}

animate();

// 9. Resize Handler
let resizeTimeout;
window.addEventListener('resize', () => {
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => {
const width = window.innerWidth;
const height = window.innerHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2));
}, 250);
});
}
});