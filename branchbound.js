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
function branchbound(dataset) {
    const firstLb = lbCalulate(dataset)
    treeArray.push({ id: 0, ...firstLb })
    console.log(treeArray);
}

function lbCalulate(dataset, ...fixValue) {
    let lb = 0
    let lbSource = []
    dataset.forEach(element => {
        const minValue = Math.min(...element.cost)
        lbSource.push(minValue);
        lb += minValue;
    });
    const lbObject = { lbSource, lb }
    return lbObject
}

branchbound(datasetPekerja);
treeArray.forEach((element, index) => {
    $("#mainParent").html("<div class='hv-item-parent'><p class='simple-card'> ID=" + element.id + "      LB=" + element.lb + " Level=" + index + "   </p></div><div id='level" + index + "Parent' class='hv-item-children'></div>");
});
