import Note from "../models/Note.js";
import UserRegistered from "../models/UserRegistered.js";

export const renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

export const createNewNote = async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("success_msg", "Application Added Successfully");
    res.redirect("/notes");
  }
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find()
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

export const updateNote = async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Application Updated Successfully");
  res.redirect("/notes");
};

export const deleteNote = async (req, res) => {
  let noteD = await Note.findById(req.params.id);
  noteD = noteD.user; 
  if(noteD != req.user.id){
    req.flash("error_msg", "Not authorized to delete this offer");
    res.redirect("/notes");
  }else{
  req.flash("success_msg", "Application Deleted Successfully");
  res.redirect("/notes");
  }
};

export const registerOne = async (req, res) => {
  let jobRegistering = await Note.findById(req.params.id);
  jobRegistering = jobRegistering.title;
  const { userName, email, address, reasons, job} = req.body;
  const errors = [];
  const emailRegistered = await UserRegistered.findOne({email: req.user.email, job: jobRegistering});
  let userNote = await Note.findById(req.params.id);
  userNote = userNote.user;
  if(userNote == req.user.id){
    errors.push({ text: "You cannot apply to your own offer"});
  }
  if(emailRegistered){
    errors.push({ text: "User already registered"});
  }
  if(!address){
    errors.push({ text: "Please Write an Address"});
  }
  if (errors.length > 0) {
    res.render("notes/register", {
      errors,
      userName,
      email,
      address,
      job,
    });
  } else {
    const newUserRegistered = new UserRegistered({ userName, email, address, reasons, job });
    newUserRegistered.userName = req.user.name;  
    newUserRegistered.email = req.user.email;
    newUserRegistered.job = jobRegistering;
    await newUserRegistered.save();
    req.flash("success_msg", "User Registered Successfully");
    res.redirect("/notes");
  }
};

export const renderRegisterOneForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  res.render("notes/register", { note });
};

export const renderViewApplicants = async (req, res) =>{
  const errors = [];
  let userNote = await Note.findById(req.params.id);
  userNote = userNote.user;
  if(userNote != req.user.id){
    errors.push({ text: "You cannot see the applicants for this offer"});
  }
  if(errors.length > 0){
    res.render("notes/come-back", {
      errors,
    });
  }else{
    let jobRegistered = await Note.findById(req.params.id);
    jobRegistered = jobRegistered.title; 
    const userR = await UserRegistered.find({job: jobRegistered});
    res.render("notes/view-applicants", { userR });
  }
};

//export const renderViewApplicantsForm = async (req, res) =>{
  //let jobRegistered = await Note.findById(req.params.id);
  //jobRegistered = jobRegistered.title; 
  //const userR = await UserRegistered.find({job: jobRegistered})
  //.sort({ date: "desc" })
  //.lean();
  //res.render("notes/view-applicants", { userR });
//};

