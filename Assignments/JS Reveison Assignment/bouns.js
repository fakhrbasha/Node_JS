/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
function createCounter(init) {
    let cnt = init;

    return {
        increment: () => {
            cnt++;
            return cnt;
        },
        decrement: () => {
            cnt--;
            return cnt;
        },
        reset: () => {
            cnt = init;
            return cnt;
        }
    };
}


/**
 * const counter = createCounter(5)
 * counter.increment(); // 6
 * counter.reset(); // 5
 * counter.decrement(); // 4
 */