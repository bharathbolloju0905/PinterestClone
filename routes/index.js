const express = require("express")
const router = express.Router();
const usermodel = require("../models/user");
const postmodel = require("../models/Post")
const passport = require("passport")
const localStrategy = require("passport-local");
const upload = require("./multer");
const { render } = require("ejs");
passport.use(new localStrategy(usermodel.authenticate()));
router.get("/", (req, res) => {
  res.render("index");  
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await usermodel.findOne({ username: req.session.passport.user }).populate('posts')
  res.render("profile", { user: user });
})
router.get("/uploadPost", isLoggedIn, async (req, res) => {
  res.render("uploadPost");
})
router.get("/allposts", isLoggedIn, async (req, res) => {
  const user = await usermodel.findOne({ username: req.session.passport.user }).populate('posts')
  res.render("AllPosts", { user: user });
})
router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(404).send("No files are Uploaded")
  }
  const user = await usermodel.findOne({ username: req.session.passport.user })
  const post = await postmodel.create({
    postText: req.body.caption,
    user: user._id,
    image: req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
}); 

router.post("/changedp", isLoggedIn, upload.single("dp"), async function (req, res) {
  const user = await usermodel.findOne({ username: req.session.passport.user });
  user.dp = req.file.filename
  await user.save();
  res.redirect("/profile")
});
router.post("/register", async function (req, res) {
  const userdata = await new usermodel({
    username: req.body.username,
    email: req.body.email,
  });
  usermodel.register(userdata, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
}
);
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));
router.get("/login", (req, res) => {

  res.render("login", { error: req.flash("error") });
});

router.get("/feed",isLoggedIn,async(req, res) =>{
  const user = await usermodel.findOne({ username: req.session.passport.user });
  const post = await postmodel.find().populate('user') ;
  console.log(post)
  res.render("feed",{user,post}) ;
})
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/")
  })
});

router.get('/allposts/:id', async (req, res) => {
  try {
      const post = await postmodel.findById(req.params.id);
      console.log(post);
      
      res.render('view', { post });
  } catch (err) {
      res.status(500).send('Server error');
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}


module.exports = router;  