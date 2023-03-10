import { Router } from 'express';

const routes = Router();

routes.post('/sendToQueue', async (req, res) => {
  const {
    name, document
  } = req.body;
  const kafka = req.kafka;

  const result = await kafka.sendToQueue([{
    name,
    document
  }]);

  res.json({
    ok: result,
    username: name
  })
})

export default routes;