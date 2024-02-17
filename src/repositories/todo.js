export default (db) => {
    const { TODO_COLLECTION } = process.env;
    const collection = db.collection(TODO_COLLECTION);

    async function insertOne(todo) {
        return await collection.insertOne(todo);
    }

    async function find(userID) {
        return await collection.find({
            userID
        }).toArray(function (err, results) {
            console.log(results)
        });
    }

    //update function that flips the completed boolean of the todo
    //Takes in todoID and userID so that we can confirm the task updated belongs to user
    async function updateOne(todoID, userID) {
        return await collection.updateOne({
            todoID: todoID,
            userID: userID
        },
            [{ $set: { completed: { $not: "$completed" } } }]
        );
    }

    return {
        insertOne,
        find,
        updateOne
    };
};