import FormClient from "@/repositories/FormClient";

export default {

    postForm(url, payload) {
        return FormClient.post(url,payload);
    },

};