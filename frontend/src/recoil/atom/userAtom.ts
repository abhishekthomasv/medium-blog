import {atom} from "recoil";

export const userAtom = atom({
    key: "userAtom",
    default: {
        email:null,
        name:null,
        id:null,
        caption:null,
    },
});