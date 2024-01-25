import express from "express";
import { contactsControllers } from "../controllers/index.js";
import { validateBody } from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/contact.js";
import isValidID from "../middlewares/isValidID.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidID, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidID, contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidID,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidID,
  validateBody(updateFavoriteSchema),
  contactsControllers.updateFavorite
);

export default contactsRouter;
