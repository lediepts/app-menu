import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();
  switch (method) {
    case 'GET':
      try {
        const orders = await Order.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json(orders);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const order = await Order.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: order });
      } catch (error) {
        console.log('31>>', error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
