
(function () {
    /* 
    EC(ANY),EC(G)
    this: window
    var val ,json
        val:1
        json: 0x000000
    */
    var val = 1; // 2
    var json = {
        val: 10, 
        dbl: function () {
            /* 
            EC(any2),EC(ANY)
            this: json
             */
            val *= 2;
        }
    };
    json.dbl();
    alert(json.val + val); // => 10+2= 12
})();