import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { v4 as uuidv4 } from 'uuid';
import { validateTodo, validateUser } from '../schemas/validators.js';
import auth from '../middleware/auth.js';
import { verifyToken } from '../functions/cookies.js';


dayjs.extend(utc);
const router = express.Router();

export default ({ todoRepository }) => {
    // Create new todo
    router.post('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = uuidv4();
            const created = dayjs().utc().toISOString();
            const completed = false;

            let newTodo = {
                ...req.body,
                todoID,
                userID: session.userID,
                created,
                completed
            };

            if (validateTodo(newTodo)) {
                let resultTodo = await todoRepository.insertOne(newTodo);
                return res.status(201).send(resultTodo);
            }
            console.error(validateTodo.errors);
            return res.status(400).send({ error: "Invalid field used." });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Todo creation failed." });
        }
    });

    //Get all todos under an user id
    router.get('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todos = await todoRepository.find(session.userID);

            if (todos) {
                res.status(200).json({ todos });
            }
            else {
                return res.status(400).send({});
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send({ error: "Failed to find todos." });
        }
    });

    //Flips the completed boolean of the todoID
    router.post('/update', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = req.body.todoID;

            if (todoID) {
                let updatedToDo = await todoRepository.updateOne(todoID, session.userID);
                return res.status(200).send({ updatedToDo });
            }
            else {
                return res.status(400).send({});
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send({ error: "Failed to update todos." });
        }
    });

    return router;
}
