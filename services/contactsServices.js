import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { contactsPath } from "../db/index.js";

console.log(contactsPath);

const listContacts = async () => {
  const contacts = await readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const index = data.findIndex((data) => data.id === contactId);
  if (index === -1) return null;
  const [result] = data.splice(index, 1);
  await writeFile(contactsPath, JSON.stringify(data, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const changeContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = {
    ...contacts[index],
    ...data,
  };
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
};
