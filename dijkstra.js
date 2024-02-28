// Ініціалізація Google Charts
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawGraph);

let graph = {};
let chartData = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loadGraph').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function(event) {
        readFile(event.target);
    });

    document.getElementById('findShortestPath').addEventListener('click', function() {
        findShortestPath();
    });
});

function findShortestPath() {
    graph = parseGraph(document.getElementById('graphInput').value);
    const startNode = document.getElementById('startNode').value.trim();
    if (!startNode) {
        alert('Будь ласка, вкажіть стартову вершину.');
        return;
    }
    const distances = dijkstra(graph, startNode);
    displayResult(distances);
    drawGraph();
}

function parseGraph(input) {
    const graph = {};
    chartData = [['Edge', 'Weight']];
    const edges = input.split('\n');
    edges.forEach(edge => {
        const [start, end, weight] = edge.split(',');
        if (!graph[start]) graph[start] = {};
        graph[start][end] = parseInt(weight, 10);
        chartData.push([`${start} -> ${end}`, parseInt(weight, 10)]);
    });
    return graph;
}

function dijkstra(graph, startNode) {
    const distances = {};
    const prev = {};
    const nodes = new PriorityQueue();

    nodes.enqueue(startNode, 0);
    distances[startNode] = 0;

    while (!nodes.isEmpty()) {
        const { element: currentNode } = nodes.dequeue();

        if (graph[currentNode]) {
            Object.keys(graph[currentNode]).forEach(neighbor => {
                const newDist = distances[currentNode] + graph[currentNode][neighbor];
                if (distances[neighbor] === undefined || distances[neighbor] > newDist) {
                    distances[neighbor] = newDist;
                    prev[neighbor] = currentNode;
                    nodes.enqueue(neighbor, newDist);
                }
            });
        }
    }

    return distances;
}

function displayResult(distances) {
    const result = Object.keys(distances)
        .map(node => `${node}: ${distances[node]}`)
        .join('\n');
    document.getElementById('result').textContent = result;
}

function loadGraph() {
    document.getElementById('fileInput').click();
}

function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('graphInput').value = e.target.result;
    };
    reader.readAsText(file);
}

function drawGraph() {
    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
        chart: {
            title: 'Граф',
            subtitle: 'Відображення зважених ребер'
        },
        width: 900,
        height: 500
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
            if (queueElement.priority < this.collection[i].priority) {
                this.collection.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) {
            this.collection.push(queueElement);
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}
