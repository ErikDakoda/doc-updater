// src/index.ts
import express from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());
const oauth2 = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI   // match the one you add in GCP
);

app.post("/updateDoc", async (req, res) => {
  const { access_token, docId, findText, replaceText } = req.body;
  oauth2.setCredentials({ access_token });
  const docs = google.docs({ version: "v1", auth: oauth2 });

  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          replaceAllText: {
            containsText: { text: findText, matchCase: false },
            replaceText,
          },
        },
      ],
    },
  });

  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 8080);
