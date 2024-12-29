import express from "express";
const router = express.Router();
router.get("/test", (req, res) => {
  console.log("router works");
  res.send("ot works");
});
router.post("/test", (req, res) => {
  console.log("router works");
  res.send("ot works");
});
router.put("/test", (req, res) => {
  console.log("router works");
  res.send("ot works");
});
router.delete("/test", (req, res) => {
  console.log("router works");
  res.send("ot works");
});
export default router;
