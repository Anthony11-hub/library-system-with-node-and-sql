const express = require("express");
const router = express.Router();
const userModel = require.main.require('./models/user');
const bookModel = require.main.require('./models/book');
const validationRules = require.main.require('./validation_rules/rules');
const asyncValidator = require('async-validator-2');


router.get('/home', (req, res)=> {
    // const users = "";
    userModel.getAll((users)=> {
        if(!users){
            res.send("Invalid");
        }
        else {
            bookModel.getAll((books)=> {
                if(!books){
                    res.send("Invalid");
                }
                else {
                    bookModel.getAllBorrowedBooks((borrowed)=> {
                        if(!borrowed){
                            res.send("invalid");
                        }
                        else {
                            bookModel.totalBorrowed30((mostBorrowed)=> {
                                if(!mostBorrowed){
                                    res.send("not valid");
                                }
                                else {
                                    bookModel.mostRequestedBook((mostRequested)=> {
                                        if(!mostRequested){
                                            res.render("nothing here");
                                        }
                                        else {
                                            bookModel.mostBorrowedBook((mostBorrowedBook)=> {
                                                if(!mostBorrowedBook){
                                                    res.send("no borrowed books");
                                                }
                                                else {
                                                    res.render('admin/home', {usr: users.length, bk: books.length, brwd: borrowed.length, mb: mostBorrowed.length, mrb: mostRequested, mbb: mostBorrowedBook});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });


});


router.get('/profile', (req, res)=> {
    const admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('admin/profile', {res: result});
        }
    });
});

router.get('/profile/edit', (req, res)=> {
    const admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid");
        }
        else {
            console.log(result);
            res.render('admin/profile-edit', {res: result, errs: []});
        }
    });
});

router.post('/profile/edit', (req, res)=> {
    const rules = validationRules.users.update;
    const validator = new asyncValidator(rules);
    const data = {
        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updateUser(data, (result)=> {
                if(!result){
                    res.send('invalid');
                }
                else {
                    res.redirect('/admin/profile');
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/profile-edit', {errs: errors, res: []});
        }
    });
});

router.get('/changepass', (req, res)=> {
    var admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('admin/change-password', {res: result, errs: [], success: []});
        }
    });
});

router.post('/changepass', (req, res)=> {
    const rules = validationRules.users.changePassword;
    const validator = new asyncValidator(rules);
    const data = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    };

    if(req.body.password == req.body.oldPassword){
        validator.validate(data, (errors, fields)=> {
            if(!errors){
                if(req.body.newPassword == req.body.confirmPassword){
                    userModel.updatePassword(req.body.newPassword, req.body.user_id, (result)=> {
                        if(!result){
                            res.send('invalid');
                        }
                        else {
                            res.render('admin/change-password', {errs:[], res: [], success: [{message: "Password changed successfully"}]});
                        }
                    });
                }
                else {
                    res.render('admin/change-password', {errs:[{message: "Your new passwords don't match!"}], res: [], success: []});
                }
            }
            else {
                console.log(fields);
                res.render('admin/change-password', {errs: errors, res: [], success: []});
            }
        });
    }
    else {
        res.render('admin/change-password', {errs: [{message: "Your old passsword does not match!"}], res: [], success: []});
    }

});


router.get('/books', (req, res)=> {
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books', {res: result, errs: []});
        }
    });
});

router.post('/books', (req, res)=> {
    const searchBy = req.body.searchBy;
    const word = req.body.word;
    bookModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/books', {res: result, errs: []})
        }
    });
});


router.get('/student', (req, res)=> {
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/student', {res: result, errs: []});
        }
    });
});

router.post('/student', (req, res)=> {
    const searchBy = req.body.searchBy;
    const word = req.body.word;
    userModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/student', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/student', {res: result, errs: []})
        }
    });
});


router.get('/student/add', (req, res)=> {
    res.render('admin/student-add', {errs: [], success: [], data: []});
});

router.post('/student/add', (req, res)=> {
    const data = {
        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender
    };

    const rules = validationRules.users.create;
    const validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.createUser(data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/student-add', {errs: [], success: [{message: "student added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/student-add', {errs: errors, success: [], data});
        }
    });
});


router.get('/books/add', (req, res)=> {
    res.render('admin/books-add', {errs: [], success: [], data: []});
});

router.post('/books/add', (req, res)=> {
    const data = {
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        isbn: req.body.isbn
    };

    const rules = validationRules.books.create;
    const validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.createBook(data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/books-add', {errs: [], success: [{message: "Book added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/books-add', {errs: errors, success: [], data});
        }
    });
});


router.get('/books/edit/:id', (req, res)=> {
    const book = req.params.id;
    bookModel.getBook(book, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            res.render('admin/books-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/books/edit/:id', (req, res)=> {
    const data = {
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        isbn: req.body.isbn
    };
    const book_id = req.body.book_id;

    const rules = validationRules.books.create;
    const validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.updateBook(book_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/books-edit', {res: result, errs:[], success: [{message: "Book updated successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/books-edit', {res: data, errs: errors, success: []})
        }
    });

});



router.get('/students/edit/:id', (req, res)=> {
    const student = req.params.id;
    userModel.getUser(student, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            res.render('admin/students-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/students/edit/:id', (req, res)=> {
    const data = {
        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender
    };
    const student_id = req.body.user_id;

    const rules = validationRules.users.create;
    const validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updatestudent(student_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/students-edit', {res: result, errs:[], success: [{message: "student updated successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/students-edit', {res: data, errs: errors, success: []});
        }
    });

});

router.get('/students/profile/:id', (req, res)=> {
    const id = req.params.id;
    const student = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/students-profile', {res: result});
        }
    });
});

router.get('/students/delete/:id', (req, res)=> {
    const id = req.params.id;
    const student = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/students-delete', {res: result});
        }
    });
});


router.post('/students/delete/:id', (req, res)=> {
    const id = req.body.user_id;
    const student = userModel.deleteUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/students');
        }
    });
});

router.get('/books/delete/:id', (req, res)=> {
    const id = req.params.id;
    const book = bookModel.getBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-delete', {res: result});
        }
    });
});

router.post('/books/delete/:id', (req, res)=> {
    const id = req.body.book_id;
    const book = bookModel.deleteBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/books');
        }
    });
});

router.get('/books/:id/issue', (req, res)=> {
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-issue', {res: result, errs: [], success: []});
        }
    });
});


router.post('/books/:id/issue', (req, res)=> {
    const book_id = req.params.id;
    const customer_id = req.body.user_id;

    bookModel.booksIssuedByCustomer(customer_id, (books)=> {
        if(!books){
            res.send("Invalid");
        }
        else {
            console.log(books.length);
            if(books.length <= 2){
                bookModel.setIssueDate(book_id, customer_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                    }
                });
                bookModel.issueBook(book_id, customer_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                        res.redirect('/admin/books');
                    }
                });
            }
            else{
                userModel.getAll((result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                        res.render('admin/books-issue', {res: result, errs: [{message: "This customer has already issued 3 books, please unissue one first!"}], success: []});
                    }
                });
            }
        }
    });
});


router.get('/books/issued', (req, res)=> {
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid!");
        }
        else {
            console.log(result);
            res.render('admin/issued-books', {res: result});
        }
    });
});

router.post('/books/issued', (req, res)=> {
    const book_id = req.body.book_id;
    bookModel.unissueBook(book_id, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/books');
        }
    });
});


router.get('/books/requested', (req, res)=> {
    bookModel.getRequestedBooks((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-requested', {res: result, errs: []});
        }
    });
});

router.post('/books/requested', (req, res)=> {
    const searchBy = req.body.searchBy;
    const word = req.body.word;
    bookModel.bookRequestSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books-requested', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/books-requested', {res: result, errs: []})
        }
    });
});



module.exports = router;