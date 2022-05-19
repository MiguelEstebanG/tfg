import User from "../models/User.js";
import ContractD from "../models/ContractD.js";
import passport from "passport";

export const renderSignUpForm = (req, res) => res.render("users/signup");

export const singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, empresa, belongsTo, _activities, gestionarCuenta, _actions, Alta, events, dateRegistered, user} = req.body;
  var hour = new Date();
  var fecha = new Date(); 


  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
      empresa,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      // Saving a New User
      const newUser = new User({ name, email, password, empresa});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();

      var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

      var day = new Date(fecha).getDate();
      var monthIndex = new Date(fecha).getMonth() + 1;
      var year = new Date(fecha).getFullYear();

      var fecha = day + '/' + monthIndex + '/' + year;


      const contract = new ContractD({belongsTo});
      contract.belongsTo = newUser.id;
      contract._activities.gestionarCuenta._actions.Alta.events.userRegistered = "User registered at " + hour + " of " + fecha + " with id: "+ newUser.id;
      if(newUser.empresa == "Si"){
        contract._activities.ofertarEmpleo._actions.registrarEmpresa.events.companyRegister = "Company registered at " + hour + " of " + fecha + " with id: "+ newUser.id;
      }
      if(newUser.empresa == "No"){
        contract._activities.aplicacion._actions.registrarDemandante.events.candidateRegister = "Candidate registered at " + hour + " of " + fecha + " with id: "+ newUser.id;
      }
      contract.save();

      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};

export const renderSigninForm = (req, res) => res.render("users/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/users/signin",
  failureFlash: true,
});

// export const login = async (req, res) => {
//   var hour = new Date();
//   var fecha = new Date();

//   var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

//   var day = new Date(fecha).getDate();
//   var monthIndex = new Date(fecha).getMonth() + 1;
//   var year = new Date(fecha).getFullYear();

//   var fecha = day + '/' + monthIndex + '/' + year;
  
//   const userId = req.user.id; 
//   const contractUL = await ContractD.findOne({ belongsTo: userId });

//   const phrase = "User with id: "+ userId + " logged in at " + hour + " of " + fecha;

//   contractUL._activities.gestionarCuenta._actions.Alta.events.logins.push(phrase);

//   await contractUL.save();

// };

export const logout = async (req, res) => {
  var hour = new Date();
  var fecha = new Date();

  var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

  var day = new Date(fecha).getDate();
  var monthIndex = new Date(fecha).getMonth() + 1;
  var year = new Date(fecha).getFullYear();

  var fecha = day + '/' + monthIndex + '/' + year;
  
  const userId = req.user.id; 
  const contractUL = await ContractD.findOne({ belongsTo: userId });

  const phrase = "User with id: "+ userId + " logged out at " + hour + " of " + fecha;

  contractUL._activities.gestionarCuenta._actions.Baja.events.logouts.push(phrase);

  await contractUL.save();

  req.logout();

  req.flash("success_msg", "You are logged out now.");
  res.redirect("/users/signin");
};

export const deleted = async (req, res) => {
  var hour = new Date();
  var fecha = new Date();

  const userDelete =  await User.findById(req.user.id);
  await userDelete.delete();

  var hour = hour.getHours()+ ':' + hour.getMinutes()+ ':' + hour.getSeconds();

  var day = new Date(fecha).getDate();
  var monthIndex = new Date(fecha).getMonth() + 1;
  var year = new Date(fecha).getFullYear();

  var fecha = day + '/' + monthIndex + '/' + year;

  const userId = req.user.id; 
  const contractUD = await ContractD.findOne({ belongsTo: userId });
  // const contractId = contractUD._id;

  contractUD._activities.gestionarCuenta._actions.Baja.events.userDeleted = "User with id: "+ userId + " deleted his account at " + hour + " of " + fecha;
  contractUD.save();

  // await contractUD.updateOne({_id: contractId},
  //                   {$set: {'_activities.gestionarCuenta._actions.Baja.events.userDeleted': "User with id: "+ userId + " deleted his account at " + hour + " of " + fecha}});

  req.flash("success_msg", "Account deleted succesfully");
  res.redirect("/");
};