import fs from 'fs/promises';

const APPLYMATCHINGS_JSON_FILENAME = 'applyMatchings.json';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { applyID, id, interest, timeStart, timeEnd, minHeadCount, maxHeadCount } = req.body;
        const data = await fs.readFile(APPLYMATCHINGS_JSON_FILENAME);
        const applies = JSON.parse(data.toString());
        applies.push({ applyID, id, interest, timeStart, timeEnd, minHeadCount, maxHeadCount });
        await fs.writeFile(APPLYMATCHINGS_JSON_FILENAME, JSON.stringify(applies));
        res.status(201).json({ message: 'Apply success' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
