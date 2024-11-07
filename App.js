class Point {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    extractRGB() {
        // Remove os caracteres "rgb(" e ")" da string
        const values = this.color.substring(4, this.color.length - 1).split(', ');
    
        // Converte os valores para números inteiros
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
    
        return { r, g, b };
    }
    rgbToHex(r, g, b) {
        // Converte os valores para formato hexadecimal e os concatena
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');
    
        // Retorna a string hexadecimal completa
        return `#${hexR}${hexG}${hexB}`;
    }
  }
  
  class Poly {
    constructor() {
        this.name = "";
        this.vertices = [];
        this.Edge = "rgb(0, 0, 0)";
    }
  
    extractRGB() {
        // Remove os caracteres "rgb(" e ")" da string
        const values = this.Edge.substring(4, this.Edge.length - 1).split(', ');
    
        // Converte os valores para números inteiros
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
    
        return { r, g, b };
    }
  }

let count = 0;
let listaPoly = [];
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

if (!context) {
  throw new Error('Não foi possível obter o contexto 2D do canvas.');
}

const windowWidth = window.innerWidth * 0.75;
const windowHeight = window.innerHeight * 0.75;
canvas.width = windowWidth;
canvas.height = windowHeight;

let currentPoly = new Poly();

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();

    if (currentPoly.vertices.length === 0) {
        poly_color = Math.floor(Math.random() * 256); // Gera a cor uma vez
        currentPoly.Edge = `rgb(255, 255, 0)`; // Define a cor da borda também
    }

    const currentPoint = new Point(
        event.clientX - rect.left,
        event.clientY - rect.top,
        `rgb(${poly_color}, ${poly_color}, ${poly_color})`
    );

    currentPoly.vertices.push(currentPoint);

    for (const vertex of currentPoly.vertices) {
        context.beginPath();
        context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        context.fillStyle = vertex.color;
        context.fill();
        context.strokeStyle = currentPoly.Edge;
        context.stroke();
    }
    document.getElementById('finalizePolygonButton').addEventListener('click', function() {
        if (currentPoly.vertices.length >= 3) {
          drawPoly(context, currentPoly.vertices, currentPoly.Edge);
          
          currentPoly.name = "P" + count++;
          
          listaPoly.push(currentPoly);
      
          fillPoly(currentPoly, context);
      
          currentPoly = new Poly();
          
          updatePolyTable();
        }
      });
});

function drawPoly(ctx, vertices, edge) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(vertices[0].x, vertices[0].y);

    for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    ctx.lineTo(vertices[0].x, vertices[0].y);

    ctx.closePath();
    ctx.strokeStyle = edge;
    ctx.stroke();
}

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    listaPoly.length = 0;
    count = 0;
    updatePolyTable()
  }

function updatePolyTable() {
const polyTable = document.getElementById('polyTable');

while (polyTable.rows.length > 1) {
    polyTable.deleteRow(1);
}

listaPoly.forEach((poly, index) => {
    const newRow = polyTable.insertRow();

    const idCell = newRow.insertCell(0);
    const colorTable = newRow.insertCell(1);
    const edgeCell = newRow.insertCell(2);
    const actionsCell = newRow.insertCell(3);


    idCell.textContent = poly.name;

    const createColorInput = (value, onchange) => {
        const hexColor = rgbToHex(parseInt(value.r), parseInt(value.g), parseInt(value.b))
        const input = document.createElement('input');
        input.type = 'color';
        input.value = hexColor;
        input.addEventListener('change', onchange); // Mudança para o evento 'change'
        return input;
    };
    colorTable.appendChild(createColorInput(poly.vertices[0].extractRGB(), (event) => handleColorChange(index, 'vertex', event)));
    const button = document.createElement('button');
    button.textContent = 'ON/OFF';
    button.addEventListener('click', (event) => handleColorChange(index, 'edge', event));
    edgeCell.appendChild(button);

    actionsCell.innerHTML = `<button onclick="deletePoly(${index})">Delete</button>`;
});
}

function rgbToHex(r, g, b) {
    const toHex = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
  
    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);
  
    return `#${hexR}${hexG}${hexB}`;
}

function handleColorChange(index, type, event) {
const colorPicker = event.target;
const hexColor = colorPicker.value;
const rgbColor = hexToRgb(hexColor);

    if (type === 'vertex') {
        const vertices = listaPoly[index].vertices;
        vertices.forEach(vertex => {
            vertex.color = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        });
        redrawCanvas(context);
    } else if (type === 'edge') {
        // Verifica a cor atual da borda
        const currentEdgeColor = listaPoly[index].Edge;

        if (currentEdgeColor === 'rgb(255, 255, 0)') { // Se for amarelo (em RGB)
            // Mudar para a cor do vértice
            const firstVertexColor = listaPoly[index].vertices[0].color;
            listaPoly[index].Edge = firstVertexColor;
        } else {
            // Volta para amarelo
            listaPoly[index].Edge = 'rgb(255, 255, 0)'; // Amarelo em RGB
        }

        redrawCanvas(context);
    }

updatePolyTable();
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
  
    return { r, g, b };
}

function redrawCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    listaPoly.forEach((poly) => {
        drawPoly(context, poly.vertices, poly.Edge);
  
        // Redesenha os vértices
        for (let i = 0; i < poly.vertices.length; i++) {
            const vertex = poly.vertices[i];
  
            context.beginPath();
            context.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            context.fillStyle = vertex.color;
            context.fill();
            context.strokeStyle = poly.Edge;
            context.stroke();
        }
        fillPoly(poly, context);
    });
}

function deletePoly(index) {
    // Remove o polígono da lista pelo índice
    listaPoly.splice(index, 1);
  
    // Redesenha o canvas com as novas informações
    redrawCanvas(context);
  
    // Atualiza a tabela com as novas informações
    updatePolyTable();
}

function fillPoly(poly, ctx) {
    // Cria um mapa para armazenar as interseções em cada coordenada y
    let intersections = new Map();
  
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < poly.vertices.length; i++) {
        minY = Math.min(minY, poly.vertices[i].y);
        maxY = Math.max(maxY, poly.vertices[i].y);
    }
  
    // Inicializa o mapa com arrays vazios para cada coordenada y entre os vértices
    for (let y = minY; y < maxY; y++) {
        intersections.set(y, []);
    }
  
    // Define as arestas do polígono
    let edges = [];
    let edgesRGB = [];
  
    for (let i = 0; i < poly.vertices.length; i++) {
      let nextIndex = (i + 1) % poly.vertices.length;
      let currentVertex = poly.vertices[i];
      let nextVertex = poly.vertices[nextIndex];
  
      // Calcula a taxa de variação de x por y (slope) para cada aresta
      let rateX = (nextVertex.x - currentVertex.x) / (nextVertex.y - currentVertex.y);
  
      edges.push({
        start: currentVertex,
        end: nextVertex,
        rate: rateX
      });
  
      // Extrai as cores dos vértices
      let startRGB = currentVertex.extractRGB();
      let endRGB = nextVertex.extractRGB();
  
      edgesRGB.push({
        rateR: (endRGB.r - startRGB.r) / (nextVertex.y - currentVertex.y),
        rateG: (endRGB.g - startRGB.g) / (nextVertex.y - currentVertex.y),
        rateB: (endRGB.b - startRGB.b) / (nextVertex.y - currentVertex.y)
      });
    }
  
    // Preenche o mapa de interseções para cada aresta
    for (let i = 0; i < edges.length; i++) {
        let initialY, endY, currentX, currentR, currentG, currentB;
  
        if (edges[i].start.y < edges[i].end.y) {
            initialY = edges[i].start.y;
            endY = edges[i].end.y;
            currentX = edges[i].start.x;
            currentR = edges[i].start.extractRGB().r;
            currentG = edges[i].start.extractRGB().g;
            currentB = edges[i].start.extractRGB().b;
        } else {
            initialY = edges[i].end.y;
            endY = edges[i].start.y;
            currentX = edges[i].end.x;
            currentR = edges[i].end.extractRGB().r;
            currentG = edges[i].end.extractRGB().g;
            currentB = edges[i].end.extractRGB().b;
        }
  
        for (let y = initialY; y < endY; y++) {
            intersections.get(y).push({ x: currentX, r: currentR, g: currentG, b: currentB });
            currentX += edges[i].rate;
            currentR += edgesRGB[i].rateR;
            currentG += edgesRGB[i].rateG;
            currentB += edgesRGB[i].rateB;
        }
    }
  
    // Ordena as interseções em cada linha de varredura
    intersections.forEach((sortX) => {
        const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
        sortX.splice(0, sortX.length, ...sortedX);
    });
  
    // Preenche o polígono usando as interseções
    for (let currentY = minY; currentY < maxY; currentY++) {
        let edge = intersections.get(currentY);
    
        for (let i = 0; i < edge.length; i += 2) {
            let initialX = Math.ceil(edge[i].x);
            let endX = Math.floor(edge[i + 1].x);
            let currentR = edge[i].r;
            let currentG = edge[i].g;
            let currentB = edge[i].b;
    
            const variationR = (edge[i + 1].r - edge[i].r) / (endX - initialX);
            const variationG = (edge[i + 1].g - edge[i].g) / (endX - initialX);
            const variationB = (edge[i + 1].b - edge[i].b) / (endX - initialX);
    
            for (let currentX = initialX; currentX < endX; currentX++) {
                ctx.fillStyle = `rgb(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)})`;
                ctx.fillRect(currentX, currentY, 1, 1);
                currentR += variationR;
                currentG += variationG;
                currentB += variationB;
            }
        }
    }
  }

