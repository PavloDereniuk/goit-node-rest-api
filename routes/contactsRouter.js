import express from "express";
import {
  contactsControllers
} from "../controllers/index.js";
import { validateBody } from "../helpers/validateBody.js";
// import { createContactSchema, preUpdateContactSchema, UpdateContactSchema } from "../schemas/index.js";
import { contactsSchemas } from "../schemas/index.js";

// const validateMiddleware = validateBody(createContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", validateBody(contactsSchemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id",  validateBody(contactsSchemas.updateContactSchema), contactsControllers.updateContact);

export default contactsRouter;
