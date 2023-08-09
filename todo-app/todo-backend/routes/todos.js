const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});



/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const currentAddedTodo = await redis.getAsync('added_todo') || 0;
  const newAddedTodo = parseInt(currentAddedTodo) + 1;
  await redis.setAsync('added_todo', newAddedTodo);

  console.log('added todos,', newAddedTodo);
  res.send(todo);
});



const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo;
  res.send(todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  const { id } = req.todo;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text, done }, { new: true });

    if (!updatedTodo) {
      return res.status(404).send('Todo not found');
    }

    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)




module.exports = router;
