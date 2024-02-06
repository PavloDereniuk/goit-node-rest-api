import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res) => {
  const owner = req.user.id;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filterConditions = { owner };
  if (favorite !== undefined) {
    filterConditions.favorite = favorite;
  }

  const result = await Contact.find(filterConditions, "-createdAt -updatedAt").skip(skip).limit(limit);
  res.status(200).json(result);
};
