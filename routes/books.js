//code the API
//REST application means API works over HTTP
//Using request from the HTTP verbs:
// - POST //insert something into the data base
//- GET //get data from data base
//-PATCH / PUT // update
//-DELETE

// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');

//
function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}


router.post('/', (request, response, next) => {
    let newBook = request.body;
    //console.log(request.body);

    //checks if there is the correct number of data
    if (!newBook.isbn || !newBook.author || !newBook.price || !newBook.name) {
            HandleError(response, 'Missing Info', 'Form data missing', 500);
    }
       else {
            let book = new BookSchema({
                isbn: newBook.isbn,
                name: newBook.name,
                author: newBook.author,
                price: newBook.price,
            });


            book.save((error) => {
                if (error) {
                    response.send({"error": error});
                } else {
                    response.send({"isbn": book.isbn});
                }
            });
        }
            });


router.get('/', (request, response, next) => {
    let author = request.query['author'];
    if (author){
        BookSchema
            .find({"author": author})
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }else{
        BookSchema
            .find()
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
    // FriendSchema
    //     .find()
    //     .exec( (error, friends) => {
    //         if (error){
    //             response.send({"error": error});
    //         }else{
    //             response.send(friends);
    //         }
    //     });
});

router.get('/:isbn', (request, response, next) =>{
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) =>{

            if (error) {
                response.status(500).send(error);
            }
            if (result){
                response.send(result);
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }

        });
});

router.patch('/:isbn', (request, response, next) =>{
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body.isbn){
                    delete request.body.isbn;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }

        });
});

router.delete('/:isbn', (request, response, next) =>{
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deleted isbn": request.params.isbn});
                });
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }
        });
});

module.exports = router;