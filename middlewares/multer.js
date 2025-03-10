import multer from "multer";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
  },
});
const signupavatar = multerUpload.single("avatar");
export { signupavatar };
