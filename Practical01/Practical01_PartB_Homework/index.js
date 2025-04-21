const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

app.get("/intro", (req, res) => {
    res.send("I am a student at Ngee Ann Polytechnic, studying Information Technology. I am currently in my second year of study. I am very interested in everything technology-related.");
});
  
app.get("/name", (req, res) => {
    res.send("Hendi W.");
});

app.get("/hobbies", (req, res) => {
    res.send("My hobbies are reading, playing Marvel Rivals and reviewing movies on Letterboxd.");
});

app.get("/food", (req, res) => {
    res.send("My favourite food is sushi, especially salmon sushi. I also like to eat chicken rice and wanton noodles.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let myJSONHobbies = '["coding", "reading", "cycling"]';
let myObjHobbies = JSON.parse(myJSONHobbies);
let length = myObjHobbies.length;
let sentence = "My hobbies are: ";
for (let i = 0; i < length; i++) {
    sentence += myObjHobbies[i] + ", ";
}
sentence = sentence.slice(0, -2) + ".";


app.get("/bonushobbies", (req, res) => {
    res.send(sentence);
});

let myJSON = `{
    "name": "Alex",
    "hobbies": ["coding", "reading", "cycling"],
    "intro": "Hi, I'm Alex, a Year 2 student passionate about building APIs!"
  }`;
  
  let myObj = JSON.parse(myJSON);
  let studentHobbiesLength = myObj.hobbies.length;
  let studentHobbiesSentence = "My hobbies are: ";
  for (let i = 0; i < studentHobbiesLength; i++) {
      studentHobbiesSentence += myObj.hobbies[i] + ", ";
  }
  studentHobbiesSentence = studentHobbiesSentence.slice(0, -2) + ".";


  let studentIntro = myObj.intro;
  let studentName = myObj.name;



  app.get("/student", (req, res) => {
    res.send(studentHobbiesSentence + " " + studentIntro + " " + studentName);
});
