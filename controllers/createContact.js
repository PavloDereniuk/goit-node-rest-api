import { Contact } from "../models/contact.js";

const createContact = async (req, res) => {
  const owner = req.user.id;
  const contactData = { ...req.body, owner };
  const result = await Contact.create( contactData );

  res.status(201).json(result);
};

export { createContact };
