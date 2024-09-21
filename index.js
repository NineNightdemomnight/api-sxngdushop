const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});

app.get('/api/byfluxus', async (req, res) => {
    const { startUrl } = req.query;

    if (!startUrl) {
        return res.status(400).json({ success: false, message: "Missing startUrl parameter" });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(startUrl);

        // ที่นี่คุณสามารถเพิ่มการเลือกเนื้อหาที่ต้องการได้
        const randomStuff = await page.evaluate(() => {
            return document.querySelector('code[style="background:#29464A;color:#F0F0F0; font-size: 13px;font-family: \'Open Sans\';"]').innerText.trim();
        });

        await browser.close();
        return res.status(200).json({ success: true, key: randomStuff });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// API สำหรับ byRelzScript
app.get('/api/byrelzscript', async (req, res) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({ success: false, error: 'Missing link parameter' });
    }

    try {
        const hwid = link.replace("https://getkey.relzscript.xyz/redirect.php?hwid=", "");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setCookie({
            name: 'hwid',
            value: hwid,
        });

        await page.goto('https://getkey.relzscript.xyz/check1.php');
        // ทำตามที่ต้องการที่นี่...

        await browser.close();
        return res.json({ success: true, key: firstKey }); // ปรับให้เหมาะสม
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT}`);
});
