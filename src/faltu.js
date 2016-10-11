(function (_global) {

  "use strict";

  /* polyfills & custom utility methods */

  // for < IE9 Array.isArray support: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
  // if (!Array.isArray) {
  //   Array.isArray = function(arg) {
  //     return Object.prototype.toString.call(arg) === '[object Array]';
  //   };
  // }
  //
  //  // for < IE9 Array.forEach support: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
  // if (!Array.prototype.forEach) {
  //   Array.prototype.forEach = function(callback, thisArg) {
  //     var T, k;
  //     if (this === null) {
  //       throw new TypeError('this is null or not defined');
  //     }
  //     var O = Object(this);
  //     var len = O.length >>> 0;
  //     if (typeof callback !== 'function') {
  //       throw new TypeError(callback + ' is not a function');
  //     }
  //     if (arguments.length > 1) {
  //       T = thisArg;
  //     }
  //     k = 0;
  //     while (k < len) {
  //       var kValue;
  //       if (k in O) {
  //         kValue = O[k];
  //         callback.call(T, kValue, k, O);
  //       }
  //       k++;
  //     }
  //   };
  // }

  // check if one array is subset of another: http://stackoverflow.com/a/8632144/1227747
  Array.prototype.containsArray = function ( array ) {

      var index = null,
          last  = null;

      if( arguments[1] ) {
        index = arguments[1];
        last  = arguments[2];
      } else {
        index = 0;
        last  = 0;
        this.sort();
        array.sort();
      }

      return index === array.length ||
          ( last = this.indexOf( array[index], last ) ) > -1 &&
          this.containsArray( array, ++index, ++last );
  };

  // Global count for Arrays, Strings and Objects
  function _count (target) {
    return target.length || Object.keys(target).length || 0;
  }

  /* End polyfills & custom utility methods */


  function _getUnique (data, key) {

    var _has  = [],
        _ret  = [];

    data.forEach(function(record) {

      if( record[key] !== undefined && _has[record[key]] === undefined ) {
        _has[record[key]] = 1;
        _ret.push(record);
      }

    });

    return _ret;
  }


  function _match (search, record) {

    if( search == record ) {
      return true;
    }

    if( typeof search === 'string' ) {
      return ( typeof record === 'string' &&
        search.toLowerCase() == record.toLowerCase()) ||
      (Array.isArray(record) && record.indexOf(search) > -1); // for 'PHP' in ['PHP','Python','Perl'] like comparison
    } else if( Array.isArray(search) ) {
      return (!Array.isArray(record) && search.indexOf(record) > -1) || // for any of ['PHP','Python','Perl'] matches 'PHP' comparison. $in
      (Array.isArray(record) && record.containsArray(search)); // for ['PHP', 'Perl'] part of ['PHP','Python','Perl'] like comparison
    } else if ( search !== null && typeof search === 'object' ) {  // comparison operators
      return ( (search.exec !== undefined && search.exec(record) !== null) || // RegExp
      (search.$ne && record !== search.$ne) ||
      record < search.$lt || record <= search.$lte ||
      record > search.$gt || record >= search.$gte );
    } else {
      return false;
    }

  }

  function _sort(data, options) {

    if(!options) {
      return data;
    }

    if(typeof options === 'string') {
      options = {
        key: options,
        type: 1
      };
    } else if(typeof options === 'object') {
      var _key = Object.keys(options)[0];
      options = {
        key: _key,
        type: options[_key]
      };
    }

    // slightly modified version of: http://stackoverflow.com/a/1129270/1227747
    return data.sort(function (a,b) {
      if (a[options.key] < b[options.key])
        return -1 * options.type;
      if (a[options.key] > b[options.key])
        return 1 * options.type;
      return 0;
    });

  }

  // Apply filtering options to passed data
  function _applyOpts (data, options) {

    // no options, nothing to apply
    if(
      !options ||
      typeof options !== 'object' ||
      options === null
    ) {
      return data;
    }

    if(options.unique) {
      data = _getUnique(data, options.unique);
    }

    if(options.sort || options.orderBy) {
      data = _sort(data, options.sort || options.orderBy);
    }

    if(options.skip && options.skip > 0) {
      if(options.limit && options.limit > 0) {
        options.limit += options.skip;
      }
    }

    return data.slice(options.skip, options.limit);
  }

  var Faltu = function(data) {

    var current = data;

    var _faltuSearch = {

      find: function(search, options) {

        options = options || {};

        // when {}, [], '', null or nothing is passed to find
        if(!search || search === null ||
          (search !== null && _count(search) === 0) ) {
          // do nothing as all the data is in current

          current = _applyOpts(data, options);
          return this;
        } else {
          // reduce current to only searched data

          var _temp = current;
          current = [];
          var _searchKeys  = _count(search),
              _searchMatch = 0;

          _temp.forEach(function(record) {
            _searchMatch = 0;

            for(var _k in search) {
              if(
                (record[_k] !== undefined &&
                  (
                    search[_k] === Infinity || // when .ANY is used
                    _match(search[_k], record[_k])
                  )
                ) ||
                (search[_k] === -Infinity && !record[_k]) // when .NONE is used
              ) {
                _searchMatch++;
              }

              if(_searchMatch == _searchKeys) {
                current.push(record);
              }
            }

          });

          current = _applyOpts(current, options);
          return this;
        }

      },
      findOne: function(search) {

        return this.find(search, {
          limit: 1
        });

      },
      each: function(fn) {

        if(typeof fn !== 'function') {
          throw Error('.each accepts a function, "' + typeof fn + '" passed instead.');
        }

        current.forEach(function(record, index) {
          fn.call(this, record, index);
        });

        return this;
      },
      filter: function(fn) {

        if(typeof fn !== 'function') {
          throw Error('.filter accepts a function, "' + typeof fn + '" passed instead.');
        }

        var _temp = current;
        current   = [];

        _temp.forEach(function(record, index) {
          if( fn.call( this, record, index ) === true ) {
            current.push(record);
          }
        });

        return this;
      },
      sort: function(options) {
        current = _sort(current, options);
        return this;
      },
      unique: function(key) {
        current = _getUnique(current, key);
        return this;
      },
      skip: function(n) {
        current = current.slice(n);
        return this;
      },
      limit: function(n) {
        current = current.slice(0, n);
        return this;
      },
      then: function(fn) {

        if(typeof fn !== 'function') {
          throw Error('.then accepts a function, "' + typeof fn + '" passed instead.');
        }

        fn.call(null, current);
        return this;
      },
      count: function() {
        return current.length;
      },
      get: function() {
        return current;
      }
    };

    return _faltuSearch;

  };

  Faltu.ANY  = Infinity;
  Faltu.NONE = -Infinity;
  Faltu.SORT = {
              ASC: 1,
              DSC: -1
            };
  Faltu.match = RegExp;

  Faltu.gt  = function (n) { return {$gt:  n}; };
  Faltu.gte = function (n) { return {$gte: n}; };
  Faltu.lt  = function (n) { return {$lt:  n}; };
  Faltu.lte = function (n) { return {$lte: n}; };
  Faltu.ne  = function (n) { return {$ne:  n}; };

	if(typeof module === 'object' && typeof module.exports === 'object') { // NodeJS support
	  return module.exports = Faltu;
	} else if (typeof define === 'function' && define.amd) { // AMD (RequireJS) support
	  return define('Faltu', [], function() {
			return Faltu;
	  });
	} else {
		return _global.Faltu = Faltu;
	}



})(this);
