import fs from 'fs';
import path from 'path';

import createApiHandler from '../../../lib/api/create-api-handler';
import FileNotFoundError from '../../../lib/errors/FileNotFoundError';

const DataHandler = createApiHandler().get(async (req, res) => {
  try {
    const dir = path.resolve('./public', `json/${req.query.fileName}`);
    const file = await fs.promises.readFile(dir, 'base64');

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.json(file);
  } catch (err) {
    throw new FileNotFoundError(req.query.fileName as string);
  }
});

export default DataHandler;
