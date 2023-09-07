const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const fs = require('fs');
const nodemailer = require("nodemailer");
const puppeteer = require('puppeteer');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const app = express();
const path = require("path");
const REGISTRATIONCollection = require("./model/model");
const Template = require('./model/template');


const temp_path = path.join(__dirname, "Public", "views");
require("./db/db");
app.set("view engine", "hbs");
app.set("views", temp_path);
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nagshikharcareer@gmail.com",
    pass: "ruenjpyhwukvwpjm"//get this password from two step authentication of gmail.
  }
});
const templateNameToFileMap = {}; // Create a mapping object to store template name to file name correspondence


// FOR REGISTRATION 
app.post('/registration', [
    body("username").isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
  body('confirmpassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const resdata = new REGISTRATIONCollection({
        username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          confirmpassword: req.body.confirmpassword,
      });

      const postdata = await resdata.save();
      res.status(200).send(postdata);

  } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error saving data' });
  }
});


// FOR LOGIN
app.post('/login', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await REGISTRATIONCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', username: user.username,email:user.email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error logging in' });
  }
});

// Load template content from the backend
app.get('/loadTemplate/:templateName', (req, res) => {
  const { templateName } = req.params;

  // Check if the template name exists in the mapping
  if (templateName in templateNameToFileMap) {
    const filename = templateNameToFileMap[templateName];
    const filePath = path.join(__dirname, 'saved_templates', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error loading template:', err);
        return res.status(500).json({ error: 'Error loading template' });
      }

      res.json({ html: data });
    });
  } else {
    // If the template name doesn't exist in the mapping, return an error
    console.error(`Template with name '${templateName}' not found`);
    return res.status(404).json({ error: `Template with name '${templateName}' not found` });
  }
});

// Save Template endpoint
app.post('/saveTemplate', (req, res) => {
  const { name, html, oldName } = req.body;

  if (oldName && templateNameToFileMap[oldName]) {
    const filename = templateNameToFileMap[oldName];
    const filePath = path.join(__dirname, 'saved_templates', filename);

    fs.writeFile(filePath, html, (err) => {
      if (err) {
        console.error('Error saving template:', err);
        return res.status(500).json({ error: 'Error saving template' });
      }

      if (name !== oldName) {
        // Rename the file if the name has changed
        const newFilename = `${name}.html`;
        const newFilePath = path.join(__dirname, 'saved_templates', newFilename);

        fs.rename(filePath, newFilePath, (err) => {
          if (err) {
            console.error('Error renaming template:', err);
            return res.status(500).json({ error: 'Error renaming template' });
          }

          // Update the mapping with the new name and file name
          templateNameToFileMap[name] = newFilename;
          delete templateNameToFileMap[oldName];
          console.log(`Template '${oldName}' renamed to '${name}' with filename: ${newFilename}`);
          res.json({ filename: newFilename, name: name }); // Return the new filename and name to the frontend
        });
      } else {
        // If the name is the same, simply return the existing filename and name to the frontend
        res.json({ filename: filename, name: name });
      }
    });
  } else {
    // If the template name doesn't exist in the mapping and no oldName provided, it's a new template, proceed with the regular saving logic
    const filename = `${name}.html`;
    const filePath = path.join(__dirname, 'saved_templates', filename);

    fs.writeFile(filePath, html, (err) => {
      if (err) {
        console.error('Error saving template:', err);
        return res.status(500).json({ error: 'Error saving template' });
      }

      templateNameToFileMap[name] = filename; // Update the mapping with the new name and file name
      console.log(`Template '${name}' saved with filename: ${filename}`);

      res.json({ filename: filename, name: name }); // Return the filename and name to the frontend
    });
  }
});

app.post('/publish', async (req, res) => {
  try {
    console.log('Received request body:', req.body,); // Add this line to log the entire request body

    const { code, output, userEmail, templateName ,renderedHTML } = req.body;
     // Extract the templateName from the request body

     // Create a new Puppeteer browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set the content of the page to the HTML code received from the frontend
    await page.setContent(code);

     // Wait for the content to be rendered properly
     await page.waitForTimeout(2000); // Adjust the timeout as needed

     // Capture a screenshot of the rendered output
     const screenshotBuffer = await page.screenshot();
 
     // Close the browser
     await browser.close();

     


    // Save the template data to MongoDB
    const template = new Template({ userEmail, code, output });
    const savedTemplate = await template.save();

    // Send an email to the logged-in user
    const mailOptions = {
      from: 'nagshikharcareer@gmail.com', // Senders email  
      to: userEmail, // Replace with email that has been taken for the user logged in 
      subject: `Your Template '${templateName}' has been Published`, // Use the templateName received in the request body
      
      text: `Congratulations! Your template '${templateName}' has been published successfully.,`,
      attachments: [
        {
          filename: `${templateName}.png`, 
          content: screenshotBuffer,
        },
      ],
      // Use the templateName received in the request body
    };
    console.log(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Send a response back to the frontend
    res.status(200).json({ message: 'Template published successfully', template: savedTemplate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error publishing template' });
  }
});





module.exports = app;
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
