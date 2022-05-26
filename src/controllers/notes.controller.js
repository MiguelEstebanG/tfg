import Note from "../models/Note.js";
import UserRegistered from "../models/UserRegistered.js";
import User from "../models/User.js";
import ContractD from "../models/ContractD.js";

export const renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

export const createNewNote = async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user.id);
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
    if(user.empresa == "Si"){
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();

    var hour = new Date();
    var fecha = new Date();

    var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

    var day = new Date(fecha).getDate();
    var monthIndex = new Date(fecha).getMonth() + 1;
    var year = new Date(fecha).getFullYear();

    var fecha = day + '/' + monthIndex + '/' + year;

    const userId = req.user.id; 
    const contractUN = await ContractD.findOne({ belongsTo: userId });
    const noteId = newNote._id;

    const phrase = "Company with id: " + userId + " has purchased a new offer with id: " + noteId + " at " + hour + " of " + fecha;

    contractUN._activities.ofertarEmpleo._actions.habilitarOferta.events.offerSubmitted.push(phrase);

    const frase = {id: newNote._id, title: newNote.title, description: newNote.description, user: newNote.user, date: hour + ' of ' + fecha };

    contractUN._activities.ofertarEmpleo._actions.detallesOferta.events.offerDetails.push(frase);

    contractUN.save();

    
    req.flash("success_msg", "Application Added Successfully");
    res.redirect("/notes");
    }else{
      req.flash("error_msg", "Not authorized to purchase an application");
      res.redirect("/notes");
    }
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
  const noteUser = noteD.user; 

  if(noteUser != req.user.id){
    req.flash("error_msg", "Not authorized to delete this offer");
    res.redirect("/notes");
  }else{
    await noteD.delete();
    req.flash("success_msg", "Application Deleted Successfully");
    res.redirect("/notes");
  }
};

export const registerOne = async (req, res) => {
  let jobRegistering = await Note.findById(req.params.id);
  jobRegistering = jobRegistering._id;
  const { userName, email, address, reasons, job, idUser} = req.body;
  const errors = [];
  const emailRegistered = await UserRegistered.findOne({email: req.user.email, job: jobRegistering});
  let userNote = await Note.findById(req.params.id);
  userNote = userNote.user;

  const user = await User.findById(req.user.id);

  if(userNote == req.user.id){
    errors.push({ text: "You cannot apply to your own offer"});
  }
  if(user.empresa == "Si"){
    errors.push({ text: "You cannot apply being a company"});
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
    const newUserRegistered = new UserRegistered({ userName, email, address, reasons, job, idUser });  
    newUserRegistered.email = req.user.email;
    newUserRegistered.job = jobRegistering;
    newUserRegistered.idUser = req.user.id;
    await newUserRegistered.save();

    var hour = new Date();
    var fecha = new Date();

    var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

    var day = new Date(fecha).getDate();
    var monthIndex = new Date(fecha).getMonth() + 1;
    var year = new Date(fecha).getFullYear();

    var fecha = day + '/' + monthIndex + '/' + year;

    const userId = req.user.id; 
    const contractUN = await ContractD.findOne({ belongsTo: userId });

    var data = {offer: newUserRegistered.job, name: newUserRegistered.userName, email: newUserRegistered.email, address: newUserRegistered.address, date: hour + ' of ' + fecha };

    var application = "Candidate with id: " + userId + " has applied to the offer: " +  newUserRegistered.job + " at " + hour + " of " + fecha;

    contractUN._activities.aplicacion._actions.datosPersonales.events.datos.push(data);

    contractUN._activities.aplicacion._actions.aplicar.events.applicationSubmitted.push(application);

    await contractUN.save();

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
    jobRegistered = jobRegistered._id; 
    // const userR = await UserRegistered.find({job: jobRegistered})
    let userR = await UserRegistered.find({job: jobRegistered}).lean();
      // .sort({ date: "desc" })
      // .lean();
    res.render('notes/view-applicants', {userR});
  }
};

export const interview = async (req, res) =>{
  res.render('notes/interview');
}

//export const renderViewApplicantsForm = async (req, res) =>{
  //let jobRegistered = await Note.findById(req.params.id);
  //jobRegistered = jobRegistered.title; 
  //const userR = await UserRegistered.find({job: jobRegistered})
  //  .sort({ date: "desc" })
    //.lean();
  //res.render("notes/view-applicants", { userR });
//};

