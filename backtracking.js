function permute(dataset) {
    let minLB = Infinity;
    let bestPermutation = null;
    let idCounter = 0;
    const n = dataset.length;
    let resultNodes = [];

    function isValidState(state) {
        return state.length === n;
    }

    function* getCandidates(state) {
        for (let i = 0; i < n; i++) {
            if (!state.includes(i)) {
                yield i;
            }
        }
    }

    function createNode(state, lbSource, lb, level) {
        return {
            id: idCounter++,
            lbSource: lbSource,
            lb: lb,
            children: [],
            level: level,
            address: state.slice()
        };
    }

    function backtrack(state, level,lbObject=null) {
        if(lbObject===null){
            lbObject = lbCalculate(dataset, null, state);
            if (lbObject === null || lbObject.lb >= minLB) {
                return null;
            }
        }

        let node = createNode(state, lbObject.lbSource, lbObject.lb, level);

        if (isValidState(state)) {
            if (level === 5) {
                resultNodes.push(node);
            }
            if (lbObject.lb < minLB) {
                minLB = lbObject.lb;
                bestPermutation = state.slice();
            }
            return node;
        }

        for (const candidate of getCandidates(state)) {
            lbObject = lbCalculate(dataset, candidate, state);
            state.push(candidate);
            const childNode = backtrack(state, level + 1,lbObject);
            if (childNode !== null) {
                node.children.push(childNode);
            }
            state.pop();
        }

        return node;
    }

    backtrack([], 0);
    return { bestPermutation, minLB, resultNodes };
}
// Example usage:
const result = permute(datasetPekerja);
console.log('Best Permutation:', result.bestPermutation);
console.log('Minimum LB:', result.minLB);
console.log(result.resultNodes);
console.log(JSON.stringify(result.rootNode, null, 2));
document.getElementById('backtrackingResult').innerHTML =result.minLB
document.getElementById('backtrackingCombination').innerHTML ="Dengan Permutasi "+result.bestPermutation
