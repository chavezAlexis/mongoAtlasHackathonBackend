const client = require("../database/client");
const { ObjectId } = require('mongodb');
const isThereErrors = require("../helpers/isThereErrors");
const commentsCollection = client.db('ConstellationsDB').collection('comments');


const saveComment = async (req, res) => {

    if(isThereErrors(req))
    {
        return res.status(400).json({ error: "comment does not be empty" });
    }

    try {
        const { comment, user, user_id, item_id } = req.body;
        const response = await commentsCollection.insertOne({
            comment,
            user: user,
            user_id: ObjectId(user_id),
            item_id: ObjectId(item_id)
        });
        // -> If the comment can't be saved, return a 400 code
        if (!response.insertedId) 
        {
            return res.status(400).json({ message: "Bad request" })
        }
        res.status(201).json({
            message: 'Comment published successfully',
            insertedId: response.insertedId
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = {
    saveComment
}