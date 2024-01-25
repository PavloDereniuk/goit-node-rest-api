import { getAllContacts } from "./getAllContacts.js";
import { getOneContact } from "./getOneContact.js";
import { createContact } from "./createContact.js";
import { updateContact } from "./updateContact.js";
import { deleteContact } from "./deleteContact.js";
import { updateFavorite } from "./updateFavorite.js";
import { contactsControllersWrapper } from "../helpers/contactsControllersWrapper.js";

export default {
  getAllContacts: contactsControllersWrapper(getAllContacts),
  getOneContact: contactsControllersWrapper(getOneContact),
  deleteContact: contactsControllersWrapper(deleteContact),
  createContact: contactsControllersWrapper(createContact),
  updateContact: contactsControllersWrapper(updateContact),
  updateFavorite: contactsControllersWrapper(updateFavorite),
};
