import { changeContact } from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (Object.keys(data).length === 0) {
    // res.status(400).json({ "message": "Body must have at least one field" });
    throw HttpError(400, "Body must have at least one field");
}
  const result = await changeContact(id, data);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
