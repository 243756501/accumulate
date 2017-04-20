/**
 * Created by Administrator on 15-8-14.
 */


var cache = {
    setCache: function (key, val, expire) {
        var cacheText = plus.storage.getItem('$cache') || "{}";
        if(expire == null){
            expire = 300;
        }
        var cache = JSON.parse(cacheText);
        var timestamp = (Date.parse(new Date())) / 1000;
        cache[key] = {value: val, time: timestamp, expire: expire};
        plus.storage.setItem('$cache', JSON.stringify(cache));
    },
    getCache: function (key) {
        var cacheText = plus.storage.getItem('$cache') || "{}";
        var cache = JSON.parse(cacheText);
        var item = cache[key];
        if (item == null) {
            return null
        } else {
            var timestamp = (Date.parse(new Date())) / 1000;
            if (item.time + item.expire < timestamp) {
                delete cache[key];
                plus.storage.setItem('$cache', JSON.stringify(cache));
                return null;
            } else {
                return cache[key].value;
            }
        }
    },
    clean: function () {
        plus.storage.removeItem('$cache');
    }

}