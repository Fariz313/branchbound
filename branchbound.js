
let datasetPekerja = [
    {
        "nama": "budi",
        "cost": [5000, 10000, 1000, 2000, 6000]
    },
    {
        "nama": "siti",
        "cost": [7000, 2000, 4000, 15000, 8000]
    },
    {
        "nama": "joko",
        "cost": [3000, 5000, 12000, 7000, 9000]
    },
    {
        "nama": "lisa",
        "cost": [9000, 6000, 3000, 11000, 4000]
    },
    {
        "nama": "david",
        "cost": [8000, 4000, 7000, 5000, 10000]
    }
];
function initializeForm() {
    datasetPekerja.forEach((kandidat, index) => {
        const kandidatIndex = index + 1;
        document.getElementById(`candidateName-${kandidatIndex}`).value = kandidat.nama;
        kandidat.cost.forEach((gaji, gajiIndex) => {
            document.getElementById(`candidateCost${gajiIndex + 1}-${kandidatIndex}`).value = gaji;
        });
    });
}

initializeForm();
let treeArray = [];
let id = 0;
let dataminlb = 0;
let dataminid = 0;
let theResult = null;
branchbound(datasetPekerja);
branchboundFull(datasetPekerja);
console.log(theResult);
renderView(treeArray, dataminlb, dataminid);
function handleSubmit(event) {
    event.preventDefault();
    treeArray = [];
    id = 0;
    dataminlb = 0;
    dataminid = 0;
    theResult = null;
    const formData = new FormData(event.target);
    const newDataPekerja = [];


    for (let i = 1; i <= 5; i++) {
        const nama = formData.get(`candidateName-${i}`);
        const estimasiGaji = [];
        for (let j = 1; j <= 5; j++) {
            estimasiGaji.push(parseInt(formData.get(`candidateCost${j}-${i}`)));
        }
        newDataPekerja.push({ nama: nama, cost: estimasiGaji });
    }


    datasetPekerja = newDataPekerja;
    branchbound(datasetPekerja);
    branchboundFull(datasetPekerja);
    renderView(treeArray, dataminlb, dataminid);

    const { minCost, allAssignments } = findMinimumCostAssignment();
    renderTable(allAssignments, minCost);
    
    console.log("Dataset Pekerja updated:", datasetPekerja);
    console.log(treeArray);
}
function next() {
    branchboundNext(datasetPekerja);
    renderView(treeArray, dataminlb, dataminid);
    console.log(treeArray);

}
function resetData() {
    treeArray = [];
    id = 0;
    branchbound(datasetPekerja);
    renderView(treeArray, dataminlb, dataminid);
}
/**
 * @param {Array} dataset - Parameter berisi dataset yang diolah.
 */
function branchbound(dataset) {
    const firstLb = lbCalulate(dataset)
    treeArray.push({ id, children: null, level: 0, address: [], fixValue: [], ...firstLb })
    dataminid = id
    dataminlb = firstLb.lb
}
/**
 * @param {Array} dataset - Parameter berisi dataset yang diolah.
 */
function branchboundNext(dataset) {
    let leafData = [];
    getLeaf(treeArray, leafData);
    let minLeaf = getMinLbForAll(leafData);
    // console.log(minLeaf, "inLeaf");
    const levelElement = minLeaf.level + 1
    const address = minLeaf.address
    if (levelElement <= dataset.length) {
        for (let index2 = 0; index2 < dataset.length; index2++) {
            // console.log("index2 = ", index2);
            const lb = lbCalulate(dataset, index2, address, index2, true)
            // console.log(lb);
            if (!minLeaf.children) {
                minLeaf.children = []
            }
            dataminid = minLeaf.id
            dataminlb = minLeaf.lb
            let addressElement = [...address, index2]
            if (lb) {
                minLeaf.children.push({ id: ++id, ...lb, children: null, level: levelElement, address: addressElement })
                if (levelElement == dataset.length) {
                    theResult = { id: ++id, ...lb, children: null, level: levelElement, address: addressElement }
                    console.log("theres", theResult);
                }
            }
        }
    }
}
function branchboundFull(dataset) {
    let leafData = [];
    getLeaf(treeArray, leafData);
    let minLeaf = getMinLbForAll(leafData);
    // console.log(minLeaf, "inLeaf");
    const levelElement = minLeaf.level + 1
    const address = minLeaf.address
    if (levelElement <= dataset.length) {
        for (let index2 = 0; index2 < dataset.length; index2++) {
            // console.log("index2 = ", index2);
            const lb = lbCalulate(dataset, index2, address, index2, true)
            // console.log(lb);
            if (!minLeaf.children) {
                minLeaf.children = []
            }
            dataminid = minLeaf.id
            dataminlb = minLeaf.lb
            let addressElement = [...address, index2]
            if (lb) {
                minLeaf.children.push({ id: ++id, ...lb, children: null, level: levelElement, address: addressElement })
                if (levelElement == dataset.length) {
                    theResult = { id: ++id, ...lb, children: null, level: levelElement, address: addressElement }
                    for (let index = 0; index < dataset.length; index++) {
                        document.getElementById("res" + (index + 1)).innerHTML = dataset[theResult.address.indexOf(index)].nama
                        document.getElementById("cost" + (index + 1)).innerHTML = theResult.lbSource[theResult.address.indexOf(index)]
                        document.getElementById("total-cost").innerHTML = theResult.lb
                    }
                }
            }
        }
        branchboundFull(dataset);
    }
}



/**
 * @param {Array} dataset - Parameter berisi dataset yang diolah.
 * @param {int} indexValue - Parameter berisi nilai index dari value yang akan dimasukan.
 * @param {Array} address - Parameter array alamat index dari tree.
 * @param {Array} fixValueIndex - Parameter nilai fix yang ada di parentnya.
 * @param {Boolean} debug - Parameter nilai untuk debug.
 */
function lbCalulate(dataset, indexValue = null, address, fixValueIndex, debug) {
    let lb = 0
    let lbSource = []
    dataset.forEach((element, index) => {
        if (indexValue === null) {
            const minValue = Math.min(...element.cost)
            lbSource.push(minValue);
            lb += minValue;
        } else {
            const level = address.length
            minValue = null
            element.cost.forEach((el, idx) => {
                if (index == level) {
                    if (idx == indexValue && !address.includes(idx)) {
                        minValue = el
                    }
                } else if (index < level) {
                    if (idx == address[index]) {
                        minValue = el
                    }
                } else {
                    if (!address.includes(idx) && idx != fixValueIndex) {
                        if (!minValue) {
                            minValue = el
                        } else if (minValue > el) {
                            minValue = el
                        }
                    }

                }
            });
            lbSource.push(minValue);
            lb += minValue;
        }
    });
    if (lbSource.includes(null)) {
        return null;
    }
    const lbObject = { lbSource, lb }
    return lbObject
}

/**
 * @param {Array} dataset - Parameter berisi dataset yang diolah.
 * @param {Array} output - Parameter output akan mendapat setiap leaf paling ujung.

 */
function getLeaf(dataset, output) {
    dataset.forEach(element => {
        if (element.children) {
            getLeaf(element.children, output)
        } else {
            output.push(element)
        }
    });
}

function getMinLbForAll(data) {
    let minlb = null;
    data.forEach(element => {
        if (!minlb) {
            minlb = element
        } else if (minlb.lb > element.lb) {
            minlb = element
        } else if (minlb.lb == element.lb && minlb.level < element.level) {
            minlb = element
        }
    });
    return minlb;
}


function createHierarchyElement(node) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('hv-item');

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('hv-item-parent');
    parentDiv.innerHTML = `<p class="simple-card"> ${node.id} <br> LB=${node.lb} </p>`;
    itemDiv.appendChild(parentDiv);

    if (node.children && node.children.length > 0) {
        const childrenDiv = document.createElement('div');
        childrenDiv.classList.add('hv-item-children');

        node.children.forEach(child => {
            const childDiv = createHierarchyElement(child);
            const hvItemChild = document.createElement('div');
            hvItemChild.classList.add('hv-item-child');
            hvItemChild.appendChild(childDiv);
            childrenDiv.appendChild(hvItemChild);
        });

        itemDiv.appendChild(childrenDiv);
    }
    if (node.level == datasetPekerja.length) {
        document.getElementById('min-id').innerHTML = node.id + " <b>Ini adalah data hasil</b>";
        document.getElementById('min-lb').innerHTML = node.lb;
        parentDiv.classList.add('finish-item');
    }
    if (node.children == null) {
        parentDiv.classList.add('no-tail');
    }

    return itemDiv;
}

function renderView(dataset, minlb, minid) {
    document.getElementById('min-id').innerHTML = minid;
    document.getElementById('min-lb').innerHTML = minlb;
    const mainParent = document.getElementById('mainParent');
    mainParent.innerHTML = '';
    mainParent.appendChild(createHierarchyElement(dataset[0]));
}


