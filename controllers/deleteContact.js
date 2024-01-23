import { removeContact } from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
