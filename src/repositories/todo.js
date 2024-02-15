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

    return {
        insertOne,
        find
    };
};