import { Contact } from "../models/contact.js";

const createContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export { createContact };