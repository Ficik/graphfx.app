
// import defaultValues from '../../defaultGraph';
import {Graph} from 'graphfx';

const SAVE_PREFIX = 'GRAPHFX_SAVE_';

export const toSaveSlotKey = (name) => `${SAVE_PREFIX}${name}`;

export const listSaves = () => {
  const regex = new RegExp(`^${SAVE_PREFIX}(.+)$`);
    const slots = Object.keys(localStorage).filter((key) => regex.test(key));
    return slots.map((key) => key.match(regex)[1]);
}

export const load = async (name) => {
  try {
    return await Graph.deserialize(JSON.parse(localStorage.getItem(toSaveSlotKey(name))) || []);
  } catch (err) {
    return await Graph.deserialize([]);
  }
};
export const save = (name, graph) => localStorage.setItem(toSaveSlotKey(name), JSON.stringify(graph.serialize()));