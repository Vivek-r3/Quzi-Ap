import { insertIntoTable, selectFromTable } from '../../dbOps';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, phone_number, password_hash } = req.body;
    try {
      const newUser = await insertIntoTable('gkc_qz_tbl_users', {
        email,
        phone_number,
        password_hash,
      });
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else if (req.method === 'GET') {
    try {
      const users = await selectFromTable('gkc_qz_tbl_users', '*');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
}