import Note from "../models/Note.js";
import UserRegistered from "../models/UserRegistered.js";
import User from "../models/User.js";
import ContractD from "../models/ContractD.js";
import Interview from "../models/Interview.js";
import Contract from "../models/Contract.js";

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

    var data = {offer: newUserRegistered.job, name: newUserRegistered.userName, email: newUserRegistered.email, address: newUserRegistered.address, date: hour + ' of ' + fecha, idUser: userId };

    var application = "Candidate with id: " + userId + " has applied to the offer: " +  newUserRegistered.job + " at " + hour + " of " + fecha;

    contractUN._activities.aplicacion._actions.datosPersonales.events.datos.push(data);

    contractUN._activities.aplicacion._actions.aplicar.events.applicationSubmitted.push(application);

    await contractUN.save();

    const jobS = newUserRegistered.job;
    const appDC = await Note.findOne({ _id: jobS});   
    const empId = appDC.user;
    
    const contractEmp = await ContractD.findOne({ belongsTo: empId });

    var datas = {offer: newUserRegistered.job, name: newUserRegistered.userName, email: newUserRegistered.email, address: newUserRegistered.address, date: hour + ' of ' + fecha, idUser: userId };

    var applic = "Candidate with id: " + userId + " has applied to the offer: " +  newUserRegistered.job + " at " + hour + " of " + fecha;

    contractEmp._activities.aplicacion._actions.datosPersonales.events.datos.push(datas);

    contractEmp._activities.aplicacion._actions.aplicar.events.applicationSubmitted.push(applic);

    await contractEmp.save();

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
  // let jobR = await Note.findById(req.params.id);
  // let userInt = await UserRegistered.find({job: req.params.id});
  // userInt = userInt.idUser;
  const userApp = await UserRegistered.findById(req.params.id);
  
  const {application, job, place, date, extraInfo} = req.body;
  let userId = userApp.idUser;
  let jobId = userApp.job;

  const newInterview = new Interview({application, job, place, date, extraInfo});
  newInterview.interviewer = req.user.id;
  newInterview.interviewee = userId;
  newInterview.job = jobId;

  await newInterview.save();

  var hour = new Date();
  var fecha = new Date();

  var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

  var day = new Date(fecha).getDate();
  var monthIndex = new Date(fecha).getMonth() + 1;
  var year = new Date(fecha).getFullYear();

  var fecha = day + '/' + monthIndex + '/' + year;

  const contractInterviewer = await ContractD.findOne({ belongsTo: req.user.id }); 

  var selected = "Candidate with id: "  + userId + " has been selected by the company: " + req.user.id + " at " + hour + " of " + fecha +  " to have an interview for the job: " + jobId;

  var interviewData = "Candidate with id: "  + userId + " has been appointed for an interview in " + newInterview.place + " at " + newInterview.date + " by " + newInterview.interviewer;

  contractInterviewer._activities.entrevistar._actions.seleccionarCandidatos.events.applicantsSelected.push(selected);

  contractInterviewer._activities.entrevistar._actions.terminos.events.interviewTerms.push(interviewData);

  await contractInterviewer.save();

  const contractCandidate = await ContractD.findOne({ belongsTo:  userId }); 

  var selected = "Candidate with id: "  + userId + " has been selected by the company: " + req.user.id + " at " + hour + " of " + fecha + " to have an interview for the job: " + jobId;

  var interviewData = "Candidate with id: "  + userId + " has been appointed for an interview in " + newInterview.place + " at " + newInterview.date + " by " + newInterview.interviewer;

  contractCandidate._activities.entrevistar._actions.seleccionarCandidatos.events.applicantsSelected.push(selected);

  contractCandidate._activities.entrevistar._actions.terminos.events.interviewTerms.push(interviewData);

  await contractCandidate.save();

  req.flash("success_msg", "Interview succesfully appointed");
  res.redirect("/notes/" + jobId + "/view-applicants");

  // res.render("notes/interview", { userRId: req.params.id });
};

export const renderInterview = async (req, res) => {
  const userApp = await UserRegistered.findById(req.params.id);
  let jobId = userApp.job;
  res.render("notes/interview", { userRId: req.params.id, appId: userApp.job });
};


export const hire = async (req, res) => {
  const userApp = await UserRegistered.findById(req.params.id);

  const { activity, salary, startDate, duration, typeOfContract, timetable, extraInfo } = req.body;
  let userId = userApp.idUser;
  let jobId = userApp.job;

  const newContractSigned = new Contract({activity, salary, startDate, duration, typeOfContract, timetable, extraInfo});
  newContractSigned.job = jobId;
  newContractSigned.employee = userId;
  newContractSigned.employer = req.user.id;

  await newContractSigned.save();

  var hour = new Date();
  var fecha = new Date();

  var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

  var day = new Date(fecha).getDate();
  var monthIndex = new Date(fecha).getMonth() + 1;
  var year = new Date(fecha).getFullYear();

  var fecha = day + '/' + monthIndex + '/' + year;

  const contractEmployer = await ContractD.findOne({ belongsTo: req.user.id });

  var contractOffered = "Company with id: "  + req.user.id + " has offered at " + hour + " of " + fecha + " a new contract to the candidate: " + userId + " for the job: " + jobId;

  var contractResolution = "Candidate with id: "  + userId + " has signed a new " + newContractSigned.typeOfContract + " contract since " + newContractSigned.startDate + " for the job: " + jobId + " performing the activity " + newContractSigned.activity + " for " + newContractSigned.duration; 

  var detailsC = {job: newContractSigned.job, 
    employee: newContractSigned.employee, 
    employer: newContractSigned.employer, 
    salary: newContractSigned.salary, 
    startDate: newContractSigned.startDate, 
    duration: newContractSigned.duration,
    typeOfContract: newContractSigned.typeOfContract,
    activity: newContractSigned.activity,
    timetable: newContractSigned.timetable,
    extraInfo: newContractSigned.extraInfo};

  contractEmployer._activities.contratacion._actions.ofertarContrato.events.contractsOffered.push(contractOffered);

  contractEmployer._activities.contratacion._actions.detallesContrato.events.details.push(detailsC);

  contractEmployer._activities.contratacion._actions.resolucionFinal.events.resolution.push(contractResolution);

  await contractEmployer.save();


  const contractEmployee = await ContractD.findOne({ belongsTo: userId });

  var contractOffered = "Company with id: "  + req.user.id + " has offered at " + hour + " of " + fecha + " a new contract to the candidate: " + userId + " for the job: " + jobId;

  var contractResolution = "Candidate with id: "  + userId + " has signed a new " + newContractSigned.typeOfContract + " contract since " + newContractSigned.startDate + " for the job: " + jobId + " performing the activity " + newContractSigned.activity + " for " + newContractSigned.duration; 

  var detailsC = {job: newContractSigned.job, 
    employee: newContractSigned.employee, 
    employer: newContractSigned.employer, 
    salary: newContractSigned.salary, 
    startDate: newContractSigned.startDate, 
    duration: newContractSigned.duration,
    typeOfContract: newContractSigned.typeOfContract,
    activity: newContractSigned.activity,
    timetable: newContractSigned.timetable,
    extraInfo: newContractSigned.extraInfo};

  contractEmployee._activities.contratacion._actions.ofertarContrato.events.contractsOffered.push(contractOffered);

  contractEmployee._activities.contratacion._actions.detallesContrato.events.details.push(detailsC);

  contractEmployee._activities.contratacion._actions.resolucionFinal.events.resolution.push(contractResolution);

  await contractEmployee.save();  

  req.flash("success_msg", "Contract succesfully appointed");
  res.redirect("/notes/" + jobId + "/view-applicants");
};

export const renderHire = async (req, res) =>{
  const userApp = await UserRegistered.findById(req.params.id);
  let jobId = userApp.job;
  res.render("notes/contract", { userRId: req.params.id, appId: userApp.job })
};

export const renderDocumentContract = async (req, res) => {
  // const errors = [];
  // let userNote = await Note.findById(req.params.id);
  // userNote = userNote.user;
  // if(userNote != req.user.id){
  //   errors.push({ text: "You cannot see the applicants for this offer"});
  // }
  // if(errors.length > 0){
  //   res.render("notes/come-back", {
  //     errors,
  //   });
  // }else{

    const documentContract = await ContractD.findOne({ belongsTo: req.user.id }).lean();

    var dc = JSON.stringify(documentContract, null, 2);
      
    res.render('notes/document-contract', {dc});
  // }
};


//export const renderViewApplicantsForm = async (req, res) =>{
  //let jobRegistered = await Note.findById(req.params.id);
  //jobRegistered = jobRegistered.title; 
  //const userR = await UserRegistered.find({job: jobRegistered})
  //  .sort({ date: "desc" })
    //.lean();
  //res.render("notes/view-applicants", { userR });
//};

