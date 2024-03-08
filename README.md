# REST API zur verwaltung einer Bibliothek

**Entitäten:**

* Book 
    {
        id,
        title,
        author,
        category,
    }
* Author
    {
        id,
        name,
        birthdate
    }
* Category
    {
        id,
        name
    }
    {
        id,
        title,
        description
    }

**Endpoints:**

* GET /api/v1/books
* GET /api/v1/books/{id}
* POST /api/v1/books
* POST /api/v1/books/{id}
* DELETE /api/v1/books/{id}

* GET /api/v1/authors
* GET /api/v1/authors/{id}
* POST /api/v1/authors
* POST /api/v1/authors/{id}
* DELETE /api/v1/authors/{id}

* GET /api/v1/categories
* GET /api/v1/categories/{id}
* POST /api/v1/categories
* POST /api/v1/categories/{id}
* DELETE /api/v1/categories/{id}

