function permute(arr) {
    let result = [];

    if (arr.length === 0) return [[]];

    for (let i = 0; i < arr.length; i++) {
        let copy = arr.slice();
        let head = copy.splice(i, 1);
        let rest = permute(copy);

        for (let j = 0; j < rest.length; j++) {
            let next = head.concat(rest[j]);
            result.push(next);
        }
    }
    return result;
}

function calculateCost(permutation) {
    let totalCost = 0;
    permutation.forEach((job, i) => {
        totalCost += datasetPekerja[i].cost[job];
    });
    return totalCost;
}

function findMinimumCostAssignment() {
    const n = datasetPekerja.length;
    const jobs = Array.from(Array(n).keys()); // [0, 1, 2, 3, 4]
    const permutations = permute(jobs);

    let minCost = Infinity;
    let minAssignment = [];

    const allAssignments = [];

    permutations.forEach(permutation => {
        const cost = calculateCost(permutation);
        const assignment = {
            pekerja: permutation.map(job => datasetPekerja[job].nama),
            cost: cost
        };
        allAssignments.push(assignment);
        if (cost < minCost) {
            minCost = cost;
            minAssignment = permutation;
        }
    });

    return { minCost, minAssignment, allAssignments };
}

function renderTable(allAssignments, minCost) {
    const tableBody = document.getElementById('table-bruteforce').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    allAssignments.forEach((assignment, index) => {
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        indexCell.textContent = ++index;
        row.appendChild(indexCell);
        assignment.pekerja.forEach(pekerja => {
            const cell = document.createElement('td');
            cell.textContent = pekerja;
            row.appendChild(cell);
        });
        const cellCost = document.createElement('td');
        cellCost.textContent = assignment.cost;
        if (assignment.cost == minCost) {
            row.setAttribute('class', 'table-success');
        }
        row.appendChild(cellCost);
        tableBody.appendChild(row);
    });

    const row = document.createElement('tr');
    const cellTotal = document.createElement('td');
    cellTotal.textContent = 'Total Minimum Cost';
    cellTotal.colSpan = 6;
    const cellTotalCost = document.createElement('td');
    cellTotalCost.textContent = minCost;

    row.appendChild(cellTotal);
    row.appendChild(cellTotalCost);
    tableBody.appendChild(row);
}

// Find the minimum cost assignment and render the table
let { minCost, allAssignments } = findMinimumCostAssignment();
renderTable(allAssignments, minCost);
