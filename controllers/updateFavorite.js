import { Contact } from "../models/contact.js";
import { HttpError } from "../helpers/HttpError.js";

export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await Contact.findByIdAndUpdate(id, data, {new: true});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
