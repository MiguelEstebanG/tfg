import { Router } from "express";
import {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  registerOne,
  renderRegisterOneForm,
  renderViewApplicants,
  interview,
  renderInterview,
  hire,
  renderHire,
  //renderViewApplicantsForm,
} 
from "../controllers/notes.controller.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", renderNotes);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

// Register 
router.get("/notes/:id/register", isAuthenticated, renderRegisterOneForm);

router.post("/notes/:id/register", isAuthenticated, registerOne);

//See the list of applicants
router.get("/notes/:id/view-applicants", isAuthenticated , renderViewApplicants);

//interview
router.get("/notes/interview/:id", isAuthenticated, renderInterview);

router.post("/notes/interview/:id", isAuthenticated, interview);

//contract
router.get("/notes/hire/:id", isAuthenticated, renderHire);

router.post("/notes/hire/:id", isAuthenticated, hire);

//router.post("notes/:id/view-applicants", isAuthenticated, renderViewApplicantsForm);

export default router;
