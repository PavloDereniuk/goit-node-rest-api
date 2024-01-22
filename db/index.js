import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contactsPath = join(__dirname, "contacts.json");


export {contactsPath}