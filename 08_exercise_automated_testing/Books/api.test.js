const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);

function generateRandomNumber() {
    return Math.floor(Math.random() * 1000) + 1000;
}

describe('Books API', () => {
    let bookId;

    it('should POST a book', (done) => {
        const reqBody = {
            id: "1",
            title: "Test Book",
            author: "Test Author"
        };
        chai.request(server)
            .post('/books')
            .send(reqBody)
            .end((err, resp) => {
                if (err) {
                    return done(err)
                };
                expect(resp.statusCode, "Status Code").to.be.equal(201);
                expect(resp).to.have.status(201);

                expect(resp.body).to.be.a('object');

                expect(resp.body.id, "Id property").to.be.equal(reqBody.id);
                expect(resp.body.id).to.exist;
                expect(resp.body).to.have.property('id');

                expect(resp.body.title, "Title property").to.be.equal(reqBody.title);
                expect(resp.body).to.have.property('title');

                expect(resp.body.author, "Author property").to.be.equal(reqBody.author);
                expect(resp.body).to.have.property('author');
                bookId = resp.body.id;
                done();
            });
    });

    it('should GET all books', (done => {
        chai.request(server)
            .get('/books')
            .end((err, resp) => {
                if (err) {
                    return done(err)
                };
                expect(resp.statusCode, "Status Code").to.be.equal(200);
                expect(resp).to.have.status(200);

                expect(resp.body).to.be.a('array');
                done();
            });
    }));

    it('should GET a single book', (done) => {
        const bookId = 1;

        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, resp) => {
                if (err) {
                    return done(err)
                };
                expect(resp.statusCode, "Status Code").to.be.equal(200);
                expect(resp, "Status Code").to.have.status(200);

                expect(resp.body).to.be.a('object');

                expect(resp.body.id).to.exist;
                expect(resp.body).to.have.property('id');

                expect(resp.body).to.have.property('title');

                expect(resp.body).to.have.property('author');

                done();
            });
    });

    it('shoud PUT an existing book', (done) => {
        const bookId = 1;
        const updatedBook = {
            id: bookId,
            title: 'Updated Test Book',
            author: 'Updated Test Author'
        };
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, resp) => {
                if (err) {
                    return done(err)
                };
                expect(resp.statusCode, "Status Code").to.be.equal(200);
                expect(resp, "Status Code").to.have.status(200);

                expect(resp.body).to.be.a('object');

                expect(resp.body.title, "Book Title").to.equal('Updated Test Book');

                expect(resp.body.author, "Book Author").to.equal('Updated Test Author');

                done();
            });
    });

    it('should DELETE a book', (done) => {
        // Create a book to assure there will be a book to delete.
        bookId = `${generateRandomNumber()}`

        const reqBody = {
            id: bookId,
            title: "Test Book",
            author: "Test Author"
        };

        chai.request(server)
            .post('/books')
            .send(reqBody)
            .end((err, postResp) => {
                if (err) {
                    return done(err);
                }

                expect(postResp.statusCode, 'Status code for POST').to.be.equal(201);

                // Use the obtained book id to perform DELETE request.
                chai.request(server)
                    .delete(`/books/${bookId}`)
                    .end((err, deleteResp) => {
                        if (err) {
                            return done(err)
                        };
                        expect(deleteResp.statusCode, "Status Code for DELETE").to.be.equal(204);
                        expect(deleteResp, "Status Code for DELETE").to.have.status(204);

                        done();
                    });
            });
    });

    it('should return 404 when trying to GET, PUT, DELETE a non-existing book', (done) => {
        bookId = `${generateRandomNumber()}`

        // GET
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, getResp) => {
                if (err) {
                    return done(err)
                };
                expect(getResp.statusCode, "Status Code for GET").to.be.equal(404);
            });

        //PUT
        chai.request(server)
            .put(`/books/${bookId}`)
            .end((err, putResp) => {
                if (err) {
                    return done(err)
                };
                expect(putResp.statusCode, "Status Code for PUT").to.be.equal(404);
            });
        // DELETE
        chai.request(server)
            .delete(`/books/${bookId}`)
            .end((err, deleteResp) => {
                if (err) {
                    return done(err)
                };
                expect(deleteResp.statusCode, "Status Code for DELETE").to.be.equal(404);
            });

        done();

    });
});
