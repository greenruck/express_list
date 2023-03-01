process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let pizza = { name: "pizza" };

beforeEach(function(){
    items.push(pizza);

});

afterEach(function(){
    items.length = 0;
});

describe("Get /items", function(){
    test("gets a list of items", async function(){
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({items: [pizza]});
    });
});

describe("GET /items/:name", function(){
    test("Get a single item", async function(){
        const resp = await request(app).get(`/items/${pizza.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({item: pizza});
    });
    test("Responds with 404 if can't find item", async function() {
        const resp = await request(app).get(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /items", function(){
    test("Creates a new item", async function(){
        const resp = await request(app)
        .post(`/items`)
        .send({
            name: "pasta"
        });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: {name: "pasta"}
        });
    });
});

describe("PATCH /items/:name", function(){
    test("Updates a single item", async function(){
        const resp = await request(app)
        .patch(`/items/${pizza.name}`)
        .send({
            name: "pie"
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: { name: "pie"}
        });
    });
    test("Responds with 404 if id invalid", async function(){
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", function() {
    test("Deletes a single a item", async function() {
      const resp = await request(app).delete(`/items/${pizza.name}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Deleted" });
    });
  });