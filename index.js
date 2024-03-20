// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const { google } = require('googleapis');
// const morgan = require('morgan');
// const path = require('path');
// const fs = require('fs'); // Добавляем модуль для работы с файловой системой
//
// const app = express();
//
// app.use(bodyParser.json());
// app.use(morgan('combined'));
//
// // Загружаем keywords.json и responsible.json
// const keywordsData = JSON.parse(fs.readFileSync('keywords.json', 'utf8')); // Изменено на динамическую загрузку
// const responsibleData = JSON.parse(fs.readFileSync('responsible.json', 'utf8')); // Добавлено для загрузки responsible.json
//
// app.get('/styles.css', (req, res) => {
//     res.sendFile(path.join(__dirname, 'styles.css'), {
//         headers: {
//             'Content-Type': 'text/css'
//         }
//     });
// });
//
// app.get('/data.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'data.js'), {
//         headers: {
//             'Content-Type': 'application/javascript'
//         }
//     });
// });
//
// app.get('/data.json', (req, res) => {
//     res.sendFile(path.join(__dirname, 'data.json'), {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// });
//
// async function addFormDataToSheet(formData) {
//     try {
//         // Загружаем данные из файлов keywords.json и responsible.json
//         const keywordsData = JSON.parse(fs.readFileSync('keywords.json', 'utf8'));
//         const responsibleData = JSON.parse(fs.readFileSync('responsible.json', 'utf8'));
//
//         console.log('Loaded responsibleData:', responsibleData); // Добавлено для отладки
//
//         const auth = new google.auth.GoogleAuth({
//             keyFile: "credentials.json",
//             scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//         });
//
//         const client = await auth.getClient();
//         const googleSheets = google.sheets({ version: "v4", auth: client });
//
//         const spreadsheetId = process.env.SPREADSHEET_ID;
//         const range = `${process.env.SHEET_NAME}!A2:I`;
//
//         // Преобразование данных формы с учетом keywords.json
//         if (formData.url) {
//             const keywordEntry = keywordsData.keywords.find(entry => formData.url.includes(entry.keyword));
//             if (keywordEntry) {
//                 // Обновляем регион на основе найденного совпадения из keywords.json
//                 formData.region = keywordEntry.region;
//             }
//
//             // Обновление значения столбца "responsible" на основе responsible.json
//             const responsibleEntry = responsibleData.responsible.find(entry => formData.url.includes(entry.keyword));
//             console.log('Found responsibleEntry:', responsibleEntry); // Добавлено для отладки
//             if (responsibleEntry) {
//                 formData.responsible = responsibleEntry.value;
//             }
//         }
//
//         console.log('Final formData:', formData); // Добавлено для отладки
//
//         await googleSheets.spreadsheets.values.append({
//             spreadsheetId,
//             range,
//             valueInputOption: "USER_ENTERED",
//             resource: { values: [[formData.responsible, formData.vp, formData.region, formData.url, formData.format, formData.topic, formData.date, formData.content]] },
//         });
//
//         console.log('Data successfully added to Google Sheets:', formData);
//     } catch (error) {
//         console.error('Error adding data to Google Sheets:', error);
//         throw error;
//     }
// }
//
// app.get('/submit', (req, res) => {
//     res.sendFile(path.join(__dirname, 'data.html'));
// });
//
// app.post('/submit', async (req, res) => {
//     try {
//         // Предполагаем, что данные уже декодированы
//         console.log('Received data from form:', req.body.params);
//         await addFormDataToSheet(req.body.params);
//         res.status(200).send('Data added to Google Sheets successfully');
//     } catch (error) {
//         console.error('Failed to add data to Google Sheets:', error);
//         res.status(500).send('Failed to add data to Google Sheets');
//     }
// });
//
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs'); // Добавляем модуль для работы с файловой системой

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));

// Загружаем keywords.json и responsible.json
const keywordsData = JSON.parse(fs.readFileSync('keywords.json', 'utf8')); // Изменено на динамическую загрузку
const responsibleData = JSON.parse(fs.readFileSync('responsible.json', 'utf8')); // Добавлено для загрузки responsible.json

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/data.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
});

async function addFormDataToSheet(formData) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = `${process.env.SHEET_NAME}!A2:I`;

        // Преобразование данных формы с учетом keywords.json
        if (formData.url) {
            const keywordEntry = keywordsData.keywords.find(entry => formData.url.includes(entry.keyword));
            if (keywordEntry) {
                // Обновляем регион на основе найденного совпадения из keywords.json
                formData.region = keywordEntry.region;
            }
        }

        console.log('Final formData:', formData); // Добавлено для отладки

        await googleSheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            resource: { values: [[formData.responsible, formData.vp, formData.region, formData.url, formData.format, formData.topic, formData.date, formData.content]] },
        });

        console.log('Data successfully added to Google Sheets:', formData);
    } catch (error) {
        console.error('Error adding data to Google Sheets:', error);
        throw error;
    }
}

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.html'));
});

app.post('/submit', async (req, res) => {
    try {
        // Предполагаем, что данные уже декодированы
        console.log('Received data from form:', req.body.params);
        await addFormDataToSheet(req.body.params);
        res.status(200).send('Data added to Google Sheets successfully');
    } catch (error) {
        console.error('Failed to add data to Google Sheets:', error);
        res.status(500).send('Failed to add data to Google Sheets');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

