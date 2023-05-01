import journalApi from "@/api/journalApi";

export const loadEntries = async ({ commit }) => {
  const { data } = await journalApi.get("/Entries.json");
  if (!data) {
    commit("setEntries", []);
    return;
  }
  const entries = [];
  for (let id of Object.keys(data)) {
    console.log(data[id]);
    entries.push({
      id,
      ...data[id],
    });
  }

  commit("setEntries", entries);
};
export const updateEntry = async ({ commit }, entry) => {
  const { id, ...rest } = entry;
  await journalApi.put(`/Entries/${id}.json`, rest);

  commit("updateEntry", { ...entry });
};
export const createEntry = async ({ commit }, entry) => {
  const { data } = await journalApi.post("/Entries.json", entry);

  const newEntry = { id: data.name, ...entry };
  commit("addEntry", newEntry);
  return data.name;
};

export const deleteEntry = async ({ commit }, id) => {
  await journalApi.delete(`/Entries/${id}.json`);
  commit("deleteEntry", id);
};
