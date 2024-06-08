
const datasetPekerja = [
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
let treeArray = [];

/**
 * @param {Array} dataset - Parameter berisi dataset yang diolah.
 */
function branchbound(dataset) {
    const firstLb = lbCalulate(dataset)
    let id = 0
    treeArray.push({ id, children: null, level: 0, address: [], fixValue: [], ...firstLb })
    console.log(treeArray);
    let leafData = [];
    getLeaf(treeArray, leafData);
    leafData.forEach((element, index) => {
        const levelElement = element.level + 1
        const address = element.address
        for (let index2 = 0; index2 < dataset.length; index2++) {
            // console.log("index2 = ", index2);
            const lb = lbCalulate(dataset, index2, address, element.fixValue)
            // console.log(lb);
            if (!element.children) {
                element.children = []
            }
            let addressElement = [...address, index2]
            element.children.push({ id: ++id, ...lb, children: null, level: levelElement, address: addressElement })
        }
    });
    console.log("yg ini", treeArray);
    leafData = [];
    getLeaf(treeArray, leafData);
    let minLeaf = getMinLbForAll(leafData);
    console.log(minLeaf, "inLeaf");
    const levelElement = minLeaf.level + 1
    const address = minLeaf.address
    for (let index2 = 0; index2 < dataset.length; index2++) {
        console.log("index2 = ", index2);
        const lb = lbCalulate(dataset, index2, address, minLeaf.fixValue, true)
        console.log(lb);
        if (!minLeaf.children) {
            minLeaf.children = []
        }
        let addressElement = [...address, index2]
        if (lb) {
            minLeaf.children.push({ id: ++id, ...lb, children: null, level: levelElement, address: addressElement })
        }
    }
    console.log("yg ini", treeArray);
    leafData = [];
    getLeaf(treeArray, leafData);
    minLeaf = getMinLbForAll(leafData);
    console.log(minLeaf, "inLeaf");

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
            let data = element
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
    if(lbSource.includes(null)){
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
        }else if (minlb.lb == element.lb && minlb.level<element.level) {
            minlb = element
        }
    });
    return minlb;
}

branchbound(datasetPekerja);
treeArray.forEach((element, index) => {
    $("#mainParent").html("<div class='hv-item-parent'><p class='simple-card'> ID=" + element.id + "      LB=" + element.lb + " Level=" + index + "   </p></div><div id='level" + index + "Parent' class='hv-item-children'></div>");
});
