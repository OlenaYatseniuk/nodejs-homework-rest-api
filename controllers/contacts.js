import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
  updateFavoriteById,
} from "../services/contacts.js";

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { page = 1, limit = 5, favorite } = req.query;
    limit = Number(limit) > 10 ? 10 : Number(limit);
    page = Number(page) < 1 ? 1 : Number(page);
    let skip = (page - 1) * limit;

    const contacts = await getAllContacts(userId, limit, skip, favorite);
    res.status(200).json({ data: contacts, limit, page });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

export const getById = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId, userId);
    if (contact) {
      res.status(200).json({ data: contact });
    } else {
      res
        .status(404)
        .json({ message: `Such contact with id: ${contactId} doesn't exist!` });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const removeContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;
    const contact = await deleteContactById(contactId, userId);
    if (contact) {
      res.status(200).json({ data: contact });
    } else {
      res
        .status(404)
        .json({ message: `Such contact with id: ${contactId} doesn't exist!` });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const addContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const newContact = await createContact(body, userId);
    res.status(201).json({ data: newContact });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

export const updateContact = async (req, res) => {
  try {
    const body = req.body;
    const contactId = req.params.contactId;
    const userId = req.user.id;
    const contact = await updateContactById(contactId, userId, body);
    if (contact) {
      res.status(200).json({ data: contact });
    } else {
      res
        .status(404)
        .json({ message: `Such contact with id: ${contactId} doesn't exist!` });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateStatusByID = async (req, res) => {
  try {
    const body = req.body;
    const contactId = req.params.contactId;
    const userId = req.user.id;
    if (!body.hasOwnProperty("favorite")) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const contact = await updateFavoriteById(contactId, userId, body.favorite);
    if (contact) {
      res.status(200).json({ data: contact });
    } else {
      res
        .status(404)
        .json({ message: `Such contact with id: ${contactId} doesn't exist!` });
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};
