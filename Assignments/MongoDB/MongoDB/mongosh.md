### Create an explicit collection named “books” with a validation rule to ensure that each document has a non-empty “title” field. (0.5 Grade)

```jsx
db.createCollection('books', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          description: 'title must non-empty string',
        },
      },
    },
  },
});
```

### Create an implicit collection by inserting data directly into a new collection named “authors”. (0.5 Grade)

```jsx
db.author.insertOne({ data });
```

### 3. Create a capped collection named “logs” with a size limit of 1MB. (0.5 Grade)

```jsx
db.createCollection('logs', {
  capped: true,
  size: 1048576,
});
```

- test `db.logs.isCapped()`

### Create an index on the books collection for the title field. (0.5 Grade)

```jsx
db.books.createIndex({ title: 1 }, { name: 'title_1' });
```

### Insert one document into the books collection. (0.5 Grade)

```jsx
db.books.insertOne({
  title: 'Clean Code',
  author: 'fakhr',
  year: 2023,
  genres: ['fakhr', 'fakhryat'],
});
```

### Insert multiple documents into the books collection with at least three records. (0.5 Grade)

```js
db.books.insertMany([

    {title: "Clean Code",author :"fakhr" , year:2023 , genres :['fakhr' , 'fakhryat']}
    {title: "Clean Code",author :"fakhr" , year:2023 , genres :['fakhr' , 'fakhryat']}
    {title: "Clean Code",author :"fakhr" , year:2023 , genres :['fakhr' , 'fakhryat']}
    // etc
    ])
```

### Insert a new log into the logs collection.

```js
db.logs.insertOne({
  book_id: ObjectId('697e2adf10b257b0ccf2b162'),
  action: 'borrowed',
});
```

### Update the book with title “Future” change the year to be 2022. (0.5 Grade)

```js
db.books.updateOne({ title: 'Future' }, { $set: { year: 2022 } });
```

### Find a Book with title “Brave New World”. (0.5 Grade)

```js
db.books.findOne({ title: 'Brave New World' });
```

### 10. Find all books published between 1990 and 2010. (0.5 Grade)

```js
db.books.find({
  year: { $gte: 1990, $lte: 2010 },
});
```

### Find books where the genre includes "Science Fiction".(0.5 Grade)

```js
db.books.find({
  genres: { $elemMatch: { $eq: 'Science Fiction' } },
});
```

### Skip the first two books, limit the results to the next three, sorted by year in descending order. (0.5 Grade)

```js
db.books.find({}).sort({ year: -1 }).skip(2).limit(3);
```

### Find books where the year field stored as an integer. (0.5 Grade)

```js
db.books.find({
  year: { $type: 'int' },
});
```

### Find all books where the genres field does not include any of the genres "Horror" or "Science Fiction". (0.5 Grade)

```js
db.books.find({
  genres: { $nin: ['Horror', 'Science Fiction'] },
});
```

### 15. Delete all books published before 2000. (0.5 Grade)

```js
db.books.deleteMany({
  year: { $lt: 2000 },
});
```

### Using aggregation Functions, Filter books published after 2000 and sort them by year descending. (0.5 Grade)

```js
db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  { $sort: { year: -1 } },
]);
```

### 17. Using aggregation functions, Find all books published after the year 2000. For each matching book, show only the title, author, and year fields. (0.5 Grade)

- match , project

```js
db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  {
    $project: {
      _id: 0,
      title: 1,
      author: 1,
      year: 1,
    },
  },
]);
```

### Using aggregation functions,break an array of genres into separate documents. (0.5 Grade)

- unwind

```js
db.books.aggregate([{ $unwind: '$genres' }]);
```

### 19. Using aggregation functions, Join the books collection with the logs collection. (1 Grade)

- `lookup`

```js
db.logs.aggregate([
  {
    $lookup: {
      from: 'books',
      localField: 'book_id',
      foreignField: '_id',
      as: 'book_details',
    },
  },
  { $unwind: '$book_details' },
  {
    $project: {
      _id: 0,
      action: 1,
      book_details: {
        title: '$book_details.title',
        author: '$book_details.author',
        year: '$book_details.year',
      },
    },
  },
]);
```

[postman](https://mosalaha361-6851529.postman.co/workspace/Fakhr-Basha's-Workspace~317760f7-6833-4547-8924-25e283a22349/collection/49271050-1c59c421-8d06-454e-83a0-1163692e0438?action=share&source=copy-link&creator=49271050)
