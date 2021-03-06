import { Http } from "./http";


export default class Lineof {
    constructor() {
        this.http = new Http();
    }

    fetch(url) {
        return this.http.fetch(url);
    }

    toObject(jsonString) {
        return JSON.parse(jsonString);
    }
    
    toJson(collec) {
        return JSON.stringify(collec);
    }
    
    toNum(s) {
        return Number(s);
    }
    
    stringify(collec) {
        return this.isString(collec) ? collec : JSON.stringify(collec);
    }
    
    toChars(s) {
        return Array.from(s);
    }
    
    isArray(o) {
        return Array.isArray(o);
    }
    
    isElement(o) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrome)
            return o instanceof HTMLElement;
        }
        catch(e){
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have (works on IE7)
            return (typeof o==="object") &&
                (o.nodeType===1) && (typeof o.style === "object") &&
                (typeof o.ownerDocument ==="object");
        }
    }
    
    isString(o) {
        return typeof o === "string";
    }
    
    isNumber(num) {
        return typeof num === "number";
    }
    
    isEmpty(o) {
        return this.keys(o).length === 0;
    }
    
    isEqual(o1, o2) {
        return JSON.stringify(o1) == JSON.stringify((o2));
    }
    
    isFunction(obj) {
        return obj && {}.toString.call(obj) === '[object Function]';
    }
    
    isIterable(o) {
        return typeof o[Symbol.iterator] === 'function';
    }
    
    isSameObject(o1, o2) {
        return (this.isElement(o1) && this.isElement(o2)) ? o1.isSameNode(o2) : o1 == o2;
    }
    
    escape(s) {
        let newS = s;
        this.forEach(this.escapeMap, function(el, key) {
            newS = newS.replace(new RegExp(key, "g"), el);
        });
        return newS;
    }
    
    unescape(s) {
        let newS = s;
        this.forEach(this.escapeMap, function(el, key) {
            newS = newS.replace(new RegExp(el, "g"), key);
        });
        return newS;
    }
    
    keys(o) {
        return Object.keys(o);
    }
    
    values(o) {
        let vals = [];
        let keys = this.keys(o);
        
        for (let i = 0; i < keys.length; i++) {
            vals.push(o[keys[i]]);
        }
        
        return vals;
    }
    
    isContains(arr, o) {
        let ret = false;
        const self = this;
        this.forEach(arr, function(el) {
            if(self.isEqual(el, o)) {
                ret = true;
                return true;
            }
        });
        return ret;
    }
    
    random(min, max=null) {
        if (this.isArray(min)) {
            let rand = 0 + Math.floor(Math.random() * (min.length));
            return min[rand];
        }
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    
    range(min, max=null) {
        const rng = [];
        
        if (this.isString(min)) {
            min = min.charCodeAt(0);
            max = max.charCodeAt(0);
            
            for (let i = min; i <= max; i++) {
                rng.push(String.fromCharCode(i));
            }
            return rng;
        }
        
        if (max == null) {
            max = min;
            min = 0;
        }
        
        for (let i = min; i <= max; i++) {
            rng.push(i);
        }
        return rng;
    }
    
    
    map(collec, callback) {
        const isArray = this.isArray(collec);
        const isString = this.isString(collec);

        let newCollec;
        if (isArray) {
            newCollec = [];
        } else if (isString) {
            newCollec = "";
        } else {
            newCollec = Object.assign({}, collec);
        }
        let keys = this.keys(collec);
        
        for (let i = 0; i < keys.length; i++) {
            if (isArray) {
                newCollec.push(callback(collec[keys[i]], keys[i], collec));
            } else if (isString) {
                newCollec += callback(collec[keys[i]], keys[i], collec)
            } else {
                newCollec[keys[i]] = callback(collec[keys[i]], keys[i], collec);
            }
        }
        return newCollec;
    }
    
    reduce(collec, callback) {
        let keys = this.keys(collec);
        let oldValue = collec[keys[0]];
        for (let i = 1; i < keys.length; i++) {
            oldValue = callback(oldValue, collec[keys[i]], collec);
        }
        return oldValue;
    }
    
    reduceRight(collec, callback) {
        let keys = this.keys(collec);
        let oldValue = collec[keys[keys.length - 1]];
        for (let i = keys.length - 2; i >= 0; i--) {
            oldValue = callback(oldValue, collec[keys[i]], collec);
        }
        return oldValue;
    }
    
    find(collec, callback) {
        let retValue = null;
        this.forEach(collec, function(el, key) {
            let ret = callback(el, key, collec);
            if (ret) {
                retValue = el;
                return true;
            }
        });
        return retValue;
    }
    
    filter(arr, callback) {
        let newArr = [];
        this.forEach(arr, function(el, key) {
            let ret = callback(el, key, arr);
            if (ret) {
                newArr.push(el);
            }
        });
        return newArr;
    }
    
    
    where(arr, obj) {
        let newArr = [];
        let keys = this.keys(obj);
        let self = this;
        
        this.forEach(arr, function(el) {
            if (typeof el == "object") {
                let canIAdd = true;
                for (let i = 0; i < keys.length; i++) {
                    if (el[keys[i]] !== obj[keys[i]]) {
                        canIAdd = false;
                        break;
                    }
                }
                
                if (canIAdd) {
                    newArr.push(el);
                }
            } else {
                if (self.isEqual(el, obj)) {
                    newArr.push(el);
                }
            }
        });
        
        return newArr;
    }
    
    reject(arr, callback) {
        let newArr = [];
        this.forEach(arr, function(el, key) {
            let ret = callback(el, key, arr);
            if (!ret) {
                newArr.push(el);
            }
        });
        return newArr;
    }
    
    all(arr, callback) {
        let isAllOk = true;
        this.forEach(arr, function(el, i) {
            let ret = callback(el, i, arr);
            if (!ret) {
                isAllOk = false;
                return true;
            }
        });
        return isAllOk;
    }
    
    any(arr, callback) {
        let isAllOk = false;
        this.forEach(arr, function(el, i) {
            let ret = callback(el, i, arr);
            if (ret) {
                isAllOk = true;
                return true;
            }
        });
        return isAllOk;
    }
    
    invoke() {
        let args = arguments[0];
        let startVal = 1;
        if (this.isFunction(args)) {
            startVal--;
            args = null;
        }
        let result = [];
        for (let i = startVal; i < arguments.length; i++) {
             if (args === null) {
                result.push(arguments[i]());
             } else {
                result.push(arguments[i](args));
             }
        }
        return result;
    }
    
    extend() {
        let newArr = [];
        for (let i = 0; i < arguments.length; i++) {
            newArr = newArr.concat(arguments[i])
        }
        return newArr;
    }
    
    clone(collec) {
        return this.isArray(collec) ? [].concat(collec) : Object.assign({}, collec);
    }
    
    has(collec, key) {
        return this.isContains(this.keys(collec), key);
    }
    
    forEach(o, callback) {
        if (this.isArray(o) || this.isIterable(o)) {
            for (let i = 0; i < o.length; i++) {
                let ret = false;
                ret = callback(o[i], i, o);
                if (ret === true) break;
            }
        } else {
            let keys = this.keys(o);
            for (let i = 0; i < keys.length; i++) {
                const ret = callback(o[keys[i]], keys[i], o);
                
                if (ret === true) break;
            }
        }
    }
    
    $drop(o, num, isEnd=false) {
        let arr;
        let itWasString = false;
        
        if (this.isString(o)) {
            itWasString = true;
            arr = o.split("");
        } else {
            arr = o;
        }
        
        isEnd ? arr.splice(arr.length - num, num) : arr.splice(0, num);
        
        return itWasString ? arr.join("") : arr;
    }
    
    dropLast(o, num=1) {
        return this.$drop(o, num, true);
    }
    
    dropFirst(o, num=1) {
        return this.$drop(o, num, false);
    }
}

Lineof.prototype.escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};

Lineof.__proto__.plugin = function(callback) {
    return callback(Lineof.prototype);
};

if (typeof window !== "undefined") window.Lineof = Lineof;
