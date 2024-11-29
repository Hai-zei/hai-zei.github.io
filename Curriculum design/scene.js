let scene, camera, renderer;
let fairies = [];
let clouds = [];
let cloudSpeed = 0.5;
let ambientLight, directionalLight;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1;
    scene.add(groundMesh);

    // Initial scene population
    createTrees(100);
    createFairies(30);
    createClouds(20);

    // Event listeners for controls
    document.getElementById('fairy-count').addEventListener('input', updateFairyCount);
    document.getElementById('cloud-speed').addEventListener('input', updateCloudSpeed);
    document.getElementById('background-darkness').addEventListener('input', updateBackgroundDarkness);

    animate();
}

function createTrees(count) {
    for (let i = 0; i < count; i++) {
        const distance = Math.random() * 100 + 20;
        const angle = Math.random() * Math.PI * 2;
        const x = distance * Math.cos(angle);
        const z = distance * Math.sin(angle);
        createTree(x, z);
    }
}

function createTree(positionX, positionZ) {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunkMesh.position.set(positionX, 1, positionZ);

    const foliageGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliageMesh.position.set(positionX, 3, positionZ);

    scene.add(trunkMesh);
    scene.add(foliageMesh);
}

function createFairies(count) {
    // Clear existing fairies
    fairies.forEach(fairy => scene.remove(fairy));
    fairies = [];

    for (let i = 0; i < count; i++) {
        const fairy = createFairy();
        fairies.push(fairy);
        scene.add(fairy);
    }
}

function createFairy() {
    const radiusMin = 20;
    const radiusMax = 50;

    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffc0cb });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffe4b5 });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.y = 0.8;

    const wingGeometry = new THREE.PlaneGeometry(1, 1.5);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6, transparent: true, opacity: 0.5 });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.6, 0.3, 0);
    rightWing.position.set(0.6, 0.3, 0);
    leftWing.rotation.y = Math.PI / 6;
    rightWing.rotation.y = -Math.PI / 6;

    const haloGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
    const haloMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.position.y = 1.2;
    haloMesh.rotation.x = Math.PI / 2;

    const fairyGroup = new THREE.Group();
    fairyGroup.add(bodyMesh);
    fairyGroup.add(headMesh);
    fairyGroup.add(leftWing);
    fairyGroup.add(rightWing);
    fairyGroup.add(haloMesh);

    fairyGroup.userData = {
        radius: Math.random() * (radiusMax - radiusMin) + radiusMin,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2
    };

    return fairyGroup;
}

function createClouds(count) {
    // Clear existing clouds
    clouds.forEach(cloud => scene.remove(cloud));
    clouds = [];

    for (let i = 0; i < count; i++) {
        const cloud = createCloud();
        clouds.push(cloud);
        scene.add(cloud);
    }
}

function createCloud() {
    const cloudGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const cloudGeometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 32, 32);
        const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        cloudMesh.position.set(
            Math.random() * 5 - 2.5,
            Math.random() * 2 - 1,
            Math.random() * 5 - 2.5
        );

        cloudGroup.add(cloudMesh);
    }

    cloudGroup.position.set(
        Math.random() * 100 - 50,
        Math.random() * 30 + 20,
        Math.random() * 100 - 50
    );

    cloudGroup.userData = {
        direction: Math.random() > 0.5 ? 1 : -1
    };

    return cloudGroup;
}

function updateFairyCount(event) {
    createFairies(parseInt(event.target.value));
}

function updateCloudSpeed(event) {
    cloudSpeed = parseFloat(event.target.value);
}

function updateBackgroundDarkness(event) {
    const darknessValue = parseFloat(event.target.value);
    scene.background = new THREE.Color(
        (1 - darknessValue) * 0x87ceeb  // Sky blue base color
    );
    ambientLight.intensity = 0.6 * (1 - darknessValue);
    directionalLight.intensity = 0.8 * (1 - darknessValue);
    fairies.forEach(fairy => {
        const haloMesh = fairy.children[4];
        haloMesh.material.emissive.setScalar(darknessValue);
    });
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Fairy animation
    fairies.forEach(fairy => {
        const { radius, angle, speed } = fairy.userData;

        fairy.userData.angle += speed * 0.01;

        fairy.position.x = Math.cos(fairy.userData.angle) * radius;
        fairy.position.z = Math.sin(fairy.userData.angle) * radius;

        const leftWing = fairy.children[2];
        const rightWing = fairy.children[3];
        leftWing.rotation.z = Math.sin(time * 5) * 0.3;
        rightWing.rotation.z = -Math.sin(time * 5) * 0.3;
    });

    // Cloud animation
    clouds.forEach(cloud => {
        cloud.position.x += cloud.userData.direction * cloudSpeed * 0.1;

        // Wrap clouds
        if (Math.abs(cloud.position.x) > 100) {
            cloud.userData.direction *= -1;
        }
    });

    renderer.render(scene, camera);
}

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
init();