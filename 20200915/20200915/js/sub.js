let sub = (function () {
    let pond = {};

    const on = function on(type, func) {
        !pond.hasOwnProperty(type) ? pond[type] = [] : null;
        let arr = pond[type];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === func) {
                return;
            }
        }
        arr.push(func);
    };

    const off = function off(type, func) {
        let arr = pond[type] || [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === func) {
                arr[i] = null;
                break;
            }
        }
    };

    const fire = function fire(type, ...params) {
        let arr = pond[type] || [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            arr.splice(i, 1);
            i--;
        }
    };

    return {
        on,
        off,
        fire
    };
})();