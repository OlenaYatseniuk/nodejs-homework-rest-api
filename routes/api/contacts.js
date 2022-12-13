import { Router } from "express";
import {
  getContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusByID,
} from "../../controllers/contacts.js";
import { auth } from "../../middleware/auth.js";
import { contactSchema, validateData } from "../../middleware/validator.js";

const router = Router();

router.use(auth);

router.get("/", getContacts);

router.get("/:contactId", getById);

router.post("/", validateData(contactSchema), addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", validateData(contactSchema), updateContact);

router.patch("/:contactId/favorite", updateStatusByID);

export default router;
