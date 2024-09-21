import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

router.get('/', async (req, res) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({ success: false, error: 'Missing link parameter' });
    }

    try {
        const hwid = link.replace("https://getkey.relzscript.xyz/redirect.php?hwid=", "");
        const session = axios.create();

        const initialCookies = {
            'check1': '1',
            'dom3ic8zudi28v8lr6fgphwffqoz0j6c': '901d9e30-900a-4158-9e0c-b355b36a5f77%3A3%3A1',
            'pp_main_e7e5688c4d672d39846f0eb422e33a7d': '1',
            'hwid': hwid,
            'check2': '1',
            'pp_sub_e7e5688c4d672d39846f0eb422e33a7d': '4'
        };

        // Set cookies for axios session
        session.defaults.headers.Cookie = Object.entries(initialCookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        await session.get('https://getkey.relzscript.xyz/check1.php');
        const headers = { 'Priority': 'u=0, i', 'Referer': 'https://loot-link.com/' };

        await session.get('https://getkey.relzscript.xyz/check2.php', { headers });
        await session.get('https://getkey.relzscript.xyz/check3.php', { headers });

        const finalResponse = await session.get('https://getkey.relzscript.xyz/generate.php', { headers });
        const $ = cheerio.load(finalResponse.data);
        const scripts = $('script');
        const pattern = /const keyValue = "(RelzHub_[\w]+)"/;

        let firstKey = null;
        scripts.each((i, script) => {
            const match = pattern.exec($(script).html());
            if (match) {
                firstKey = match[1];
                return false; // exit loop
            }
        });

        if (firstKey) {
            return res.json({ success: true, key: firstKey });
        } else {
            return res.status(404).json({ success: false, error: 'Key not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
