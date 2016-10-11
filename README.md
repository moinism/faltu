
[![npm version](https://badge.fury.io/js/faltu.svg)](https://badge.fury.io/js/faltu)
[![License](https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat)](https://github.com/moinism/faltu/blob/master/LICENSE)


# Faltu

> Search sort, filter, limit and iterate over an array of objects in Mongo-style.


## Installation


In __NodeJS__:

````bash
npm install faltu --save
````

For other projects simply <a href="https://raw.githubusercontent.com/moinism/faltu/master/build/faltu.min.js"
target="_blank">download</a> and include the file in your pages:

````html
<script src="faltu.min.js"></script>
````

## Usage

All the data passed is expected to be an array or objects.

e.g:
````
[record, record, ..., record]
````

All the data returned is also of the same type.

For example:

````javascript
var data = [{
  name: "John",
  age: 16
},{
  name: "Doe",
  age: 18
},{
  name: "Smith",
  age: 22
}];
````

Pass the array to constructor:

In __NodeJS__:

````javascript
var Faltu = require('faltu');
var faltuData = new Faltu(data);
````


### Searching

You can use `find` method for searching.
Search for all the guys who are 18 years of age:

```javascript
var newData = new Faltu(data).find({
  age: 18
}).get();
```

`newData` would look something like:

```javascript
[{
  name: "Doe",
  age: 18
}]
```

Search for all the guys who are 18 years of age or older:

```javascript
var newData = new Faltu(data).find({
  age: {
    $gte: 18 // $gte is similar to >= (greater than or equal to)
  }
}).get();
```

`newData`:

```javascript
[{
  name: "Doe",
  age: 18
},{
  name: "Smith",
  age: 22
}]
```

Other supported comparison operators in `find` are:

- `$lt`: <
- `$lte`: <=
- `$gt`: >
- `$ne`: !=

Search for all the guys who are 18 or 16 years of age:

```javascript
var newData = new Faltu(data).find({
  age: [16, 18]
}).get();
```

`newData`:

```javascript
[{
  name: "John",
  age: 16
},{
  name: "Doe",
  age: 18
}]
```

Passing `null`, empty object `{}` or nothing to `find` means not performing any search.


### Sorting

Use `sort` to sort the result in descending order by `age`:

```javascript
var newData = new Faltu(data).find({
  age: [16, 18]
}).sort({
  age: -1 // 1 = ASC, -1 = DESC
}).get();
```

`newData`:

```javascript
[{
  name: "Doe",
  age: 18
},{
  name: "John",
  age: 16
}]
```

### Limit

Let's get only 1 object back:

```javascript
var newData = new Faltu(data).find().limit(1).get();
```

`newData`:

```javascript
[{
  name: "John",
  age: 16
}]
```


### Skip

Let's skip 1st object:

```javascript
var newData = new Faltu(data).find().skip(1).get();
```

`newData`:

```javascript
[{
  name: "Doe",
  age: 18
},{
  name: "Smith",
  age: 22
}]
```


### Skip & Limit

Let's skip 1st object:

```javascript
var newData = new Faltu(data).find().skip(1).limit(1).get();
```

`newData`:

```javascript
[{
  name: "Doe",
  age: 18
}]
```

### Filtering

You can also perform `jQuery`-esque filtering yourself. Call `filter` method, pass a `function`.


```javascript
var newData = new Faltu(data).find().filter(function (person) {
  return person.age == 16; // return true if you want to keep the object
}).get();
```

`newData`:

```javascript
[{
  name: "John",
  age: 16
}]
```

### Iterate

`each` iterates over all the records returned.


````javascript
var newData = new Faltu(data).find(null).each(function(person, index){
  console.log('User name:', person.name);
});
````
