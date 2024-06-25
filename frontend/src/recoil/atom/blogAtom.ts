import { atom } from "recoil";
import { Blog } from "../../hooks";

export const blogContentAtom = atom({
  key: "blogContentAtom",
  default: "",
},
);
export const blogTitleAtom = atom({
  key: "blogTitleAtom",
  default: "",
},
);

export const blogOldData = atom<Blog>({
  key: "blogOldData", 
  default: {
    content: "",
    title: "",
    id: "",
    date: "",
    author: {
      name: "",
      id: "",
    },
  },
})

export const blogData = atom<Blog[]>({
  key: "blogData",
  default: [],
})