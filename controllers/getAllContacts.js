import { listContacts } from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const result = await listContacts();
  res.status(200).json(result);
};
