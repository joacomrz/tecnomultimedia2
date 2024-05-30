let sections = [];
let numCols = 3;
let numRows = 3;
let minImgSize = 20;  // Tamaño mínimo de las imágenes
let maxImgSize = 110; // Tamaño máximo de las imágenes
let images = [];
let fondoImages = [];
let currentSectionIndex = 0;
let isMouseHeld = false;
let currentFondo;

function preload() {
  // Cargamos todas las imágenes antes de iniciar el programa
  for (let i = 1; i <= 10; i++) {
    images.push(loadImage(`images/${i}.png`));
  }
  
  // Cargamos las imágenes de fondo
  for (let i = 1; i <= 2; i++) {
    fondoImages.push(loadImage(`images/fondo${i}.png`));
  }
}

function setup() {
  createCanvas(700, windowHeight);
  let sectionWidth = width / numCols;
  let sectionHeight = height / numRows;

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      let x = i * sectionWidth;
      let y = j * sectionHeight;
      sections.push(new Section(x, y, sectionWidth, sectionHeight));
    }
  }

  // Establecemos un fondo inicial aleatorio
  currentFondo = random(fondoImages);
}

function draw() {
  // Dibujamos el fondo actual
  background(170);
  image(currentFondo, 0, 0, width, height);

  for (let section of sections) {
    section.display();
  }

  if (isMouseHeld && currentSectionIndex < sections.length) {
    sections[currentSectionIndex].generateImagesGradually();
  }
}

function mousePressed() {
  isMouseHeld = true;
}

function mouseReleased() {
  isMouseHeld = false;
  if (currentSectionIndex < sections.length) {
    currentSectionIndex++;
  }
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    // Cambiamos el fondo a uno aleatorio
    currentFondo = random(fondoImages);
  }
}

class Section {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.images = [];
  }

  generateImagesGradually() {
    if (this.images.length < 10) { // Limitar la cantidad de imágenes por sección
      let imgSize = random(minImgSize, maxImgSize);  // Tamaño aleatorio de la imagen
      let imgX, imgY;
      let attempts = 0;
      let maxAttempts = 100;  // Evitar bucle infinito
      let newImage;
      do {
        imgX = random(this.x, this.x + this.w - imgSize);
        imgY = random(this.y, this.y + this.h - imgSize);
        newImage = { x: imgX, y: imgY, img: random(images), size: imgSize };
        attempts++;
      } while (this.checkOverlap(newImage) && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        this.images.push(newImage);
      }
    }
  }

  checkOverlap(newImage) {
    for (let img of this.images) {
      let d = dist(newImage.x + newImage.size / 2, newImage.y + newImage.size / 2, img.x + img.size / 2, img.y + img.size / 2);
      if (d < (newImage.size / 2 + img.size / 2)) {
        return true;
      }
    }
    return false;
  }

  display() {
    noFill();
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    for (let img of this.images) {
      image(img.img, img.x-20, img.y, img.size+40, img.size);  // Mostrar imagen aleatoria con tamaño aleatorio
    }
  }
}