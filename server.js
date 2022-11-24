const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

let responseData = '';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <section>
          <h2>Test cho a Chung</h2>
        </section>
        <form action="/submit" method="POST">
          <div class="form-control">
            <label>URL</label>
            <input type="text" name="inputUrl" style="width:100%">
            <br/>
            <label>XML</label>
            <textarea name="inputXml" style="width:100%"></textarea>
          </div>
          <button>Submit</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/submit', async (req, res) => {
  try {
    const url = req.body.inputUrl;
    let xml = req.body.inputXml;
    const regex1 = new RegExp(`\\n`, 'g');
    xml = xml.replace(regex1, '')
    const regex2 = new RegExp(`\\r`, 'g');
    xml = xml.replace(regex2, '')
    await axios.post(
      url,
      xml,
      {
        headers: {
          'Content-type': 'text/xml'
        }
      }
    ).then((response) => {
      res.status(200).send(response)
    }).catch(err => {
      console.log(err)
      console.log("ERROR::::", err.response ? err.response.data : err.response)
      res.status(500).send(err.response ? err.response.data : err.response)
    })
  } catch (e) {
    res.status(500).send(e)
  }
})

app.listen(process.env.PORT || 8086, () => {
  console.log('Server is started on PORT:'+ (process.env.PORT || 8086))
})
