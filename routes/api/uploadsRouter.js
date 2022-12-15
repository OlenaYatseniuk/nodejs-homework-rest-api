import { Router } from "express";

import multer from "multer";
import * as path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_EXTENTIONS = [".png", ".jpg", ".jpeg"];

const uploadsRouter = Router();

export const upload = multer({
  dest: "uploads/",
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (!ALLOWED_EXTENTIONS.includes(ext)) {
      return callback(new Error("Only images allowed!"));
    }
    callback(null, true);
  },
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadFile(file) {
  const { originalname, path: tempPath } = file;
  const uniqueName = uuidv4() + "-" + originalname;
  const newPath = path.join(__dirname, "../../public/avatars", uniqueName);
  await fs.rename(tempPath, newPath);
  return `http://${process.env.HOST}:${process.env.PORT}/avatars/${uniqueName}`;
}

uploadsRouter.post("/", upload.single("avatar"), async (req, res, next) => {
  try {
    const url = await uploadFile(req.file);
    res.json({ url });
  } catch (err) {
    console.log("tempPath in catch", req.file.path);
    await fs.unlink(req.file.path);
    console.log("after unlink");
    next(err);
  }
});

export default uploadsRouter;
