import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res) => {
  const result = await Contact.find();
  res.status(200).json(result);
};
