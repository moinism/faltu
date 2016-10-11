var assert = require("assert");
var Faltu  = require("../build/faltu.min.js");

var data = [{
  age: 22,
  office: 2,
  name: 'Jane',
  isSenior: false,
  groups: ['sales', 'IT']
}, {
  age: 28,
  office: 2,
  name: 'John',
  isSenior: true,
  groups: ['sales', 'IT', 'HR']
}, {
  age: 18,
  name: 'Jo',
  isIntern: true,
  groups: ['graphics']
}];

var faltuData = null;

describe('Faltu', function(){
  describe('contructor', function(){

    it('should be a function.', function(){
      assert.equal(typeof Faltu, 'function');
    });
    it('should have match method', function(){
      assert.equal(Faltu.match, RegExp);
    });
    it('should have gt method that should return object', function(){
      assert.equal(typeof Faltu.gt, 'function');
      assert.equal(typeof Faltu.gt(1), 'object');
    });
    it('should have gte method', function(){
      assert.equal(typeof Faltu.gte, 'function');
      assert.equal(typeof Faltu.gte(1), 'object');
    });
    it('should have lte method', function(){
      assert.equal(typeof Faltu.lte, 'function');
      assert.equal(typeof Faltu.lte(1), 'object');
    });
    it('should have lt method', function(){
      assert.equal(typeof Faltu.lt, 'function');
      assert.equal(typeof Faltu.lt(1), 'object');
    });
    it('should have ne method', function(){
      assert.equal(typeof Faltu.ne, 'function');
      assert.equal(typeof Faltu.ne(1), 'object');
    });
    it('should have ANY property', function(){
      assert.equal(Faltu.ANY, Infinity);
    });
    it('should have NONE property', function(){
      assert.equal(Faltu.NONE, -Infinity);
    });
    it('should have SORT property', function(){
      assert.equal(typeof Faltu.SORT, 'object');
    });
    it('should have not throw error when initialized', function(){
      assert.doesNotThrow(function () {
        faltuData = new Faltu(data);
      });
    });

  });

  describe('faltuObject', function(){

    it('should be a an object', function(){
      assert.equal(typeof faltuData, 'object');
    });

    describe('.find()', function(){

      it('should be a method', function(){
        assert.equal(typeof faltuData.find, 'function');
      });
      it('should return all when no arguments is passed', function(){
        assert.deepEqual(faltuData.find().get(), data);
      });
      it('should return all when null is passed', function(){
        assert.deepEqual(faltuData.find(null).get(), data);
      });
      it('should return all when {} is passed', function(){
        assert.deepEqual(faltuData.find({}).get(), data);
      });
      it('should return matched data of name John', function(){
        assert.deepEqual(new Faltu(data).find({
          name: 'John'
        }).get(), [data[1]]);
      });
      it('should return matched data of name either John or Jo', function(){
        assert.deepEqual(new Faltu(data).find({
          name: ['John', 'Jo']
        }).get(), [data[1], data[2]]);
      });
      it('should return matched data of name ending at "e"', function(){
        assert.deepEqual(new Faltu(data).find({
          name: Faltu.match('e$')
        }).get(), [data[0]]);
      });
      it('should return matched data of aged 28', function(){
        assert.deepEqual(new Faltu(data).find({
          age: 28
        }).get(), [data[1]]);
      });
      it('should return matched data of age > 20', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $gt: 20
          }
        }).get(), [data[0], data[1]]);
      });
      it('should return matched data of age > 20 limited to 1', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $gt: 20
          }
        }, {
          limit: 1
        }).get(), [data[0]]);
      });
      it('should return matched data of age < 22', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $lt: 22
          }
        }).get(), [data[2]]);
      });
      it('should return matched data of age <= 22', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $lte: 22
          }
        }).get(), [data[0], data[2]]);
      });
      it('should return matched data of age >= 22', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $gte: 22
          }
        }).get(), [data[0], data[1]]);
      });
      it('should return matched data of age != 22', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $ne: 22
          }
        }).get(), [data[1], data[2]]);
      });
      it('should return matched data of sales group', function(){
        assert.deepEqual(new Faltu(data).find({
          groups: 'sales'
        }).get(), [data[0], data[1]]);
      });
      it('should return matched data of sales & IT group', function(){
        assert.deepEqual(new Faltu(data).find({
          groups: ['sales', 'IT'],
        }).get(), [data[0], data[1]]);
      });
      it('should return matched data of isSenior:false', function(){
        assert.deepEqual(new Faltu(data).find({
          isSenior: false
        }).get(), [data[0]]);
      });
      it('should return matched data of isSenior:ANY', function(){
        assert.deepEqual(new Faltu(data).find({
          isSenior: Faltu.ANY
        }).get(), [data[0], data[1]]);
      });
      it('should return matched data of isIntern:NONE', function(){
        assert.deepEqual(new Faltu(data).find({
          isIntern: Faltu.NONE
        }, null).get(), [data[0], data[1]]);
      });
      it('should limit data to 1', function(){
        assert.equal(new Faltu(data).find(null, {
          limit: 1
        }).get().length, 1);
      });
      it('should skip 1', function(){
        assert.equal(new Faltu(data).find(null, {
          skip: 1
        }).get().length, 2);
      });
      it('should limit 1 skip 1', function(){
        assert.deepEqual(new Faltu(data).find(null, {
          skip: 1,
          limit: 1
        }).get(), [data[1]]);
      });
      it('should match get a unique "office" record', function(){
        assert.equal(new Faltu(data).find(null, {
          unique: 'office'
        }).get().length, 1);
      });
      it('should orderBy (with string) ASC', function(){
        assert.deepEqual(new Faltu(data).find(null, {
          orderBy: 'age'
        }).get(), data.sort(function(a,b) { return a.age > b.age; }));
      });
      it('should sort (with string) ASC', function(){
        assert.deepEqual(new Faltu(data).find(null, {
          sort: 'age'
        }).get(), data.sort(function(a,b) { return a.age > b.age; }));
      });
      it('should sort (with object) ASC', function(){
        assert.deepEqual(new Faltu(data).find(null, {
          sort: {
            age: 1
          }
        }).get(), data.sort(function(a,b) { return a.age > b.age; }));
      });
      it('should sort (with object) DESC', function(){
        assert.deepEqual(new Faltu(data).find(null, {
          sort: {
            age: -1
          }
        }).get(), data.sort(function(a,b) { return b.age > a.age; }));
      });

    });

    describe('.findOne()', function () {
      it('should return only 1 record', function(){
        assert.equal(new Faltu(data).findOne().get().length, 1);
      });
    });

    describe('.each()', function () {
      it('should accept a function', function(){
        assert.throws(function () {
          var tempData = new Faltu(data);
          tempData.each('string');
        });
      });

      it('should pass record as 1st argument and index of record as 2nd', function(){
        var tempData = new Faltu(data);
        tempData.each(function (record, index) {
          assert.equal(typeof record, 'object');
          assert.equal(typeof index, 'number');
        });
      });
    });

    describe('.filter()', function () {
      it('should accept a function', function(){
        assert.throws(function () {
          var tempData = new Faltu(data);
          tempData.filter('string');
        });
      });

      it('should pass record as 1st argument and index of record as 2nd', function(){
        var tempData = new Faltu(data);
        tempData.filter(function (record, index) {
          assert.equal(typeof record, 'object');
          assert.equal(typeof index, 'number');
        });
      });

      it('should return filtered data', function(){
        assert.deepEqual(new Faltu(data).filter(function (record, index) {
          return record.isIntern;
        }).get(), [data[2]]);
      });

    });

    describe('.sort()', function () {
      it('should return matched data of age > 20 in DESC', function(){
        assert.deepEqual(new Faltu(data).find({
          age: {
            $gt: 20
          }
        }).sort({
          age: -1
        }).get(), [data[0], data[1]].sort(function(a,b) { return b.age > a.age; }));
      });

      it('should return data if no argument is passed', function(){
        assert.deepEqual(new Faltu(data).find().sort().get(), data);
      });
    });

    describe('.limit()', function () {
      it('should return matched data of age > 20 limited to 1', function(){
        assert.equal(new Faltu(data).find({
          age: {
            $gte: 20
          }
        }).limit(1).get().length, 1);
      });
    });

    describe('.count()', function () {
      it('should return a count', function(){
        assert.equal(faltuData.find().count(), 3);
      });
    });

    describe('.unique()', function () {
      it('should return matched data to a unique key', function(){
        assert.equal(new Faltu(data).find(null).unique('office').get().length, 1);
      });
    });

    describe('.skip()', function () {
      it('should skip given number of records', function(){
        assert.equal(new Faltu(data).find().skip(1).get().length, 2);
      });
    });

    describe('.then()', function () {
      it('should accept a function', function(){
        assert.throws(function () {
          var tempData = new Faltu(data);
          tempData.then('string');
        });
      });

      it('should pass data to given function', function(){
        var tempObj = new Faltu(data);
        tempObj.then(function (d) {
          assert.equal(typeof d, 'object');
        });
      });

      it('should return object type', function(){
        var tempObj = new Faltu(data);
        assert.equal(typeof tempObj.then(function () {}), typeof tempObj);
      });
    });

  });

});
