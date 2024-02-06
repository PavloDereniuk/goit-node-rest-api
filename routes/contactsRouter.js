import express from "express";
import { contactsControllers } from "../controllers/index.js";
import { validateBody } from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/contact.js";
import isValidID from "../middlewares/isValidID.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsControllers.getAllContacts);

contactsRouter.get("/:id", authenticate,  isValidID, contactsControllers.getOneContact);

contactsRouter.delete("/:id", authenticate, isValidID, contactsControllers.deleteContact);

contactsRouter.post(
  "/", authenticate, 
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id", authenticate, 
  isValidID,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite", authenticate, 
  isValidID,
  validateBody(updateFavoriteSchema),
  contactsControllers.updateFavorite
);

export default contactsRouter;
