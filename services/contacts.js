import Contact from "../schemas/contact.js";

export const getAllContacts = async (owner, limit, skip, favorite) => {
  const filter = favorite ? { owner, favorite } : { owner };
  const total = await Contact.count(filter);
  const result = await Contact.find({ ...filter })
    .limit(limit)
    .skip(skip);
  return { total, result };
};

export const getContactById = (contactId, owner) => {
  return Contact.findOne({ _id: contactId, owner });
};

export const createContact = (contact, owner) => {
  return Contact.create({ ...contact, owner });
};

export const deleteContactById = (contactId, owner) => {
  return Contact.findOneAndDelete({ _id: contactId, owner });
};

export const updateContactById = (contactId, owner, body) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner }, body, {
    new: true,
    runValidators: true,
  });
};

export const updateFavoriteById = (contactId, owner, favorite) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner },
    { favorite },
    { new: true, runValidators: true }
  );
};
