const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const topicsData = JSON.parse(fs.readFileSync("topics.json", "utf-8"));
const testsData = JSON.parse(fs.readFileSync("tests.json", "utf-8"));

app.use(cors());
app.use(bodyParser.json());

// Endpoint để lấy danh sách các chủ đề
app.get("/topics", (req, res) => {
  // Trả về cấu trúc dữ liệu topics
  res.json({ topics: topicsData.topics });
});

// Endpoint để lấy chi tiết của một chủ đề
app.get("/topics/:id", (req, res) => {
  const topicId = req.params.id;
  // Tìm chủ đề theo ID
  const topic = topicsData.topics.find((topic) => topic.id === topicId);
  if (topic) {
    res.json(topic);
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để tạo một chủ đề mới
app.post("/topics", (req, res) => {
  const newTopic = req.body;
  // Thêm chủ đề mới vào cấu trúc dữ liệu
  topicsData.topics.push(newTopic);
  res.json(newTopic);
});

// Endpoint để cập nhật một chủ đề
app.put("/topics/:id", (req, res) => {
  const topicId = req.params.id;
  const updatedTopic = req.body;
  // Tìm chủ đề theo ID
  const topicIndex = topicsData.topics.findIndex(
    (topic) => topic.id === topicId
  );
  if (topicIndex !== -1) {
    // Cập nhật chủ đề
    topicsData.topics[topicIndex] = updatedTopic;
    res.json(updatedTopic);
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để xóa một chủ đề
app.delete("/topics/:id", (req, res) => {
  const topicId = req.params.id;
  // Tìm index của chủ đề theo ID
  const topicIndex = topicsData.topics.findIndex(
    (topic) => topic.id === topicId
  );
  if (topicIndex !== -1) {
    // Xóa chủ đề khỏi cấu trúc dữ liệu
    topicsData.topics.splice(topicIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để tạo một câu hỏi mới cho một chủ đề
app.post("/topics/:id/questions", (req, res) => {
  const topicId = req.params.id;
  const newQuestion = req.body;
  // Tìm chủ đề theo ID
  const topic = topicsData.topics.find((topic) => topic.id === topicId);
  if (topic) {
    // Thêm câu hỏi mới vào chủ đề
    topic.questions.push(newQuestion);
    res.json(newQuestion);
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để cập nhật một câu hỏi trong một chủ đề
app.put("/topics/:topicId/questions/:questionId", (req, res) => {
  const topicId = req.params.topicId;
  const questionId = req.params.questionId;
  const updatedQuestion = req.body;
  // Tìm chủ đề theo ID
  const topic = topicsData.topics.find((topic) => topic.id === topicId);
  if (topic) {
    // Tìm câu hỏi trong chủ đề theo ID
    const question = topic.questions.find(
      (question) => question.id === questionId
    );
    if (question) {
      // Cập nhật câu hỏi
      Object.assign(question, updatedQuestion);
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ error: "Câu hỏi không tồn tại." });
    }
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để xóa một câu hỏi trong một chủ đề
app.delete("/topics/:topicId/questions/:questionId", (req, res) => {
  const topicId = req.params.topicId;
  const questionId = req.params.questionId;
  const topic = topicsData.topics.find((topic) => topic.id === topicId);
  if (topic) {
    // Tìm index của câu hỏi trong chủ đề theo ID
    const questionIndex = topic.questions.findIndex(
      (question) => question.id === questionId
    );
    if (questionIndex !== -1) {
      // Xóa câu hỏi khỏi chủ đề
      topic.questions.splice(questionIndex, 1);
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Câu hỏi không tồn tại." });
    }
  } else {
    res.status(404).json({ error: "Chủ đề không tồn tại." });
  }
});

// Endpoint để lấy tất cả các bài kiểm tra
app.get("/tests", (req, res) => {
  res.json(testsData.test);
});

// Endpoint để lấy chi tiết của một bài kiểm tra
app.get("/tests/:id", (req, res) => {
  const testId = req.params.id;
  const test = testsData.test.find((test) => test.id === testId);
  if (test) {
    res.json(test);
  } else {
    res.status(404).json({ error: "Bài kiểm tra không tồn tại." });
  }
});

// Endpoint để tạo một bài kiểm tra mới
app.post("/tests", (req, res) => {
  const newTest = req.body;
  testsData.test.push(newTest);
  fs.writeFileSync("tests.json.json", JSON.stringify(testsData, null, 4));
  res.json(newTest);
});

// Endpoint để cập nhật một bài kiểm tra
app.put("/tests/:id", (req, res) => {
  const testId = req.params.id;
  const updatedTest = req.body;
  const testIndex = testsData.test.findIndex((test) => test.id === testId);
  if (testIndex !== -1) {
    testsData.test[testIndex] = updatedTest;
    fs.writeFileSync("tests.json", JSON.stringify(testsData, null, 4));
    res.json(updatedTest);
  } else {
    res.status(404).json({ error: "Bài kiểm tra không tồn tại." });
  }
});

// Endpoint để xóa một bài kiểm tra
app.delete("/tests/:id", (req, res) => {
  const testId = req.params.id;
  const testIndex = testsData.test.findIndex((test) => test.id === testId);
  if (testIndex !== -1) {
    testsData.test.splice(testIndex, 1);
    fs.writeFileSync("tests.json", JSON.stringify(testsData, null, 4));
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Bài kiểm tra không tồn tại." });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
