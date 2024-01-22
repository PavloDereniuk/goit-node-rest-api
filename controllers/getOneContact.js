import { getContactById } from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
