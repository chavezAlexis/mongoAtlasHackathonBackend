const bcryptjs = require("bcryptjs");
const { ObjectId } = require("mongodb");
const client = require('../database/client');
const { generateJWT } = require("../helpers/generateJWT");
const isThereErrors = require("../helpers/isThereErrors");

const usersCollection = client.db('ConstellationsDB').collection('users');

const isUserExist = async (req, res) => {
    const { userName } = req.params;
    const user = await usersCollection.findOne({userName: {$eq: userName}});
    if( !user )
    {
        return res.status(400).json({message: "user name is not exist"});
    }
    res.json({userName: user.userName});    
}

const getUser = async (req, res) => {
    const { userName, password } = req.body;
    if (isThereErrors(req))
    {
        return res.status(400).json({ message: "User name or password are invalid" });
    }
    try
    {
        const user = await usersCollection.findOne({userName:{$eq:userName}});

        if(!user)
        {
            return res.status(400).json({message: "user name or password is incorrect"});
        }
        if(!bcryptjs.compareSync(password, user.password))
        {
            return res.status(400).json({message: "user name or password is incorrect"});
        }

        const {password:pass , ...rest} = user;
        const token = await generateJWT(user._id);
        return res.status(200).json({...rest, token });
    } 
    catch(error)
    {
        res.status(500).json({message:"INTERNAL SERVER ERROR"})
        console.log(error);
    }
}

const saveUser = async (req, res) => {
    const { userName, password, confirmPassword } = req.body;
    if(isThereErrors(req))
    {
        return res.status(400).json({ message: "invalid requirements" });
    }
    if(password !== confirmPassword)
    {
        return res.status(400).json({ message: "passwords are not equal" });
    }
    try
    {
        // -> validate that user name is not exist
        const user = await usersCollection.findOne({userName: {$eq:userName}});
        if( user )
        {
            return res.status(200).json({
                message: "user name is already exist",                
            });
        }
        // -> hash password 
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        // -> save user
        const response = await usersCollection.insertOne({ userName, password: hash });
        
        if(!response.acknowledged)
        {
            res.status(400).json({ message: "User not created" })
        }
        const token = await generateJWT(response.insertedId);
        return res.status(201).json({userName, _id: response.insertedId, token});
    }
    catch(error)
    {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

const validateUserByToken = async (req, res) => {
    const uid = req.uid;
    if(uid)
    {
        const user = await usersCollection.findOne({_id: {$eq: ObjectId(uid)}});
        const {password, ...rest} = user;
        const token = await generateJWT(user._id);
        return res.status(200).json( { ...rest, token } );
    }
}

module.exports = {
    isUserExist,
    getUser,
    saveUser,
    validateUserByToken
}