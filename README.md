# Hierarchical note taking app

![mind map](./images/mind.png "Mind map") 

## Features

* Nested notes displayed like mindmaps
* Each note can have multiple child notes connected to it.
* Supports rich formatting features.
* Notes can be moved around.
* The view is restricted to depth of three.
* A collection of notes are rooted at a 'book'.
* Books can be public or private
* Public books can be seen by anyone. They can be upvoted, downvoted, and commented on.
* There will be a news feed showing popular books. Popularity = speed of books = upvotes/time.

# Notes


### Index of my books

```
GET /books/
```

### Index of only public/private books

```
GET /books/public/
GET /books/private/
```

### Create/update/delete/view a book

```
POST,PATCH,DELETE,GET /books/
```


### View a user's books

```
GET /books/username/
```


### Add/update/delete a new note to a book

```
POST,PATCH,DELETE /books/note/
```


### Connect two notes

```
PATCH /notes/connect/
```


### View a note

```
GET /notes/
```


# Feed

### View feed

```
GET /feed/
```

### Sort feed by tag

```
GET /feed/tag/
```


### Upvote book

```
PATCH /books/upvote/
```


### Comment on book

```
POST /books/comment/
```


### View my favourite books

```
GET /favourites/
```
